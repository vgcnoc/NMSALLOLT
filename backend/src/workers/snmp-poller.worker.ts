import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { DriverFactory } from '../drivers/driver-factory.service';

@Processor('snmp-polling')
export class SnmpPollerWorker extends WorkerHost {
  private readonly logger = new Logger(SnmpPollerWorker.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly driverFactory: DriverFactory,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { deviceId, useMock } = job.data;
    this.logger.log(`Processing SNMP polling job for device ID: ${deviceId}`);

    try {
      const device = await this.prisma.device.findUnique({ where: { id: deviceId } });
      if (!device) {
        throw new Error(`Device ${deviceId} not found`);
      }

      // Decrypt credentials logic would go here
      const credentials = {
        ip: device.ipAddress,
        snmpVersion: device.snmpVersion,
        snmpCommunity: device.snmpCommunity, // Usually would decrypt
        sshUsername: device.sshUsername,
        sshPassword: device.sshPassword, // Usually would decrypt
      };

      const driver = this.driverFactory.createOltDriver(device.vendor || 'generic', '', useMock);
      
      await driver.connect(credentials);
      
      const systemInfo = await driver.getSystemInfo();
      const cpu = await (driver as any).getCpu?.() || 0;
      const memory = await (driver as any).getMemory?.() || 0;
      const temp = await (driver as any).getTemperature?.() || 0;
      
      await this.prisma.device.update({
        where: { id: device.id },
        data: {
          status: 'ONLINE',
          lastSeenAt: new Date(),
          metadata: {
            systemInfo,
            performance: { cpu, memory, temperature: temp, timestamp: new Date() }
          }
        }
      });
      
      await driver.disconnect();
      
      this.logger.log(`Completed SNMP polling for device ${deviceId}`);
      return { success: true, deviceId };
    } catch (error) {
      this.logger.error(`Failed SNMP polling for device ${deviceId}: ${error.message}`);
      
      await this.prisma.device.update({
        where: { id: deviceId },
        data: { status: 'OFFLINE' }
      }).catch(e => this.logger.error('Failed to update device status to offline', e));
      
      throw error;
    }
  }
}
