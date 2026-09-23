import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { DriverFactory } from '../drivers/driver-factory.service';

@Processor('ssh-polling')
export class SshPollerWorker extends WorkerHost {
  private readonly logger = new Logger(SshPollerWorker.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly driverFactory: DriverFactory,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { deviceId, useMock } = job.data;
    this.logger.log(`Processing SSH polling job for device ID: ${deviceId}`);

    try {
      const device = await this.prisma.device.findUnique({ where: { id: deviceId } });
      if (!device) {
        throw new Error(`Device ${deviceId} not found`);
      }

      const credentials = {
        ip: device.ipAddress,
        sshUsername: device.sshUsername,
        sshPassword: device.sshPassword,
      };

      const driver = this.driverFactory.createOltDriver(device.vendor || 'generic', '', useMock);
      
      await driver.connect(credentials);
      
      const ponPorts = await driver.getPonPorts();
      
      for (const port of ponPorts) {
        // Upsert PON port in DB (pseudo code depending on schema)
        this.logger.debug(`Found PON port ${port.slot}/${port.port} status ${port.status}`);
        
        const onus = await driver.getOnus(port.slot, port.port);
        for (const onu of onus) {
          const power = await driver.getOpticalPower(port.slot, port.port, onu.onuId);
          this.logger.debug(`ONU ${onu.serialNumber} power: Rx ${power.rxPower}, Tx ${power.txPower}`);
          // Upsert ONU in DB
        }
      }
      
      await driver.disconnect();
      
      this.logger.log(`Completed SSH polling for device ${deviceId}`);
      return { success: true, deviceId };
    } catch (error) {
      this.logger.error(`Failed SSH polling for device ${deviceId}: ${error.message}`);
      throw error;
    }
  }
}
