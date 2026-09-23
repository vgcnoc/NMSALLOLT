import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriverFactory } from '../drivers/driver-factory.service';

@Processor('mikrotik-poll')
export class MikrotikPollerWorker extends WorkerHost {
  private readonly logger = new Logger(MikrotikPollerWorker.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly driverFactory: DriverFactory,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { deviceId } = job.data;
    
    if (!deviceId) {
      this.logger.warn('No deviceId provided in job data');
      return;
    }

    try {
      const device = await this.prisma.device.findUnique({
        where: { id: deviceId },
        include: { mikrotik: true },
      });

      if (!device || !device.mikrotik) {
        this.logger.warn(`Device ${deviceId} not found or not a Mikrotik`);
        return;
      }

      const driver = this.driverFactory.createRouterDriver('mikrotik');
      const connected = await driver.connect({
        ipAddress: device.ipAddress,
        apiUsername: device.mikrotik.apiUsername,
        apiPassword: device.mikrotik.apiPassword,
        apiPort: device.mikrotik.apiPort || 443,
        apiUseSsl: device.mikrotik.apiUseSsl ?? true,
      });

      if (!connected) {
        throw new Error(`Failed to connect to Mikrotik at ${device.ipAddress}`);
      }

      // Fetch System Info
      const systemInfo = await driver.getSystemInfo();
      const cpuLoad = systemInfo.resource?.['cpu-load'] ? parseInt(systemInfo.resource['cpu-load']) : 0;
      const freeMem = systemInfo.resource?.['free-memory'] ? parseInt(systemInfo.resource['free-memory']) : 0;
      const totalMem = systemInfo.resource?.['total-memory'] ? parseInt(systemInfo.resource['total-memory']) : 1;
      const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

      // Update Device status
      await this.prisma.device.update({
        where: { id: deviceId },
        data: {
          status: 'ONLINE',
          lastSeen: new Date(),
          cpuUsage: cpuLoad,
          memoryUsage: memoryUsage,
          uptime: systemInfo.resource?.uptime || '',
        },
      });

      // Disconnect
      await driver.disconnect();
      
      this.logger.log(`Successfully polled Mikrotik device ${deviceId}`);
      return true;
    } catch (error) {
      this.logger.error(`Error polling Mikrotik device ${job.data.deviceId}: ${error.message}`);
      
      if (job.data.deviceId) {
        await this.prisma.device.update({
          where: { id: job.data.deviceId },
          data: { status: 'OFFLINE' },
        });
      }
      
      throw error;
    }
  }
}
