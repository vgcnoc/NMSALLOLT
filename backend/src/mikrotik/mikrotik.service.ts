import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriverFactory } from '../drivers/driver-factory.service';

@Injectable()
export class MikrotikService {
  private readonly logger = new Logger(MikrotikService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly driverFactory: DriverFactory,
  ) {}

  private async getDriverForDevice(deviceId: string) {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
      include: { mikrotik: true },
    });

    if (!device || !device.mikrotik) {
      throw new NotFoundException(`Mikrotik device with ID ${deviceId} not found`);
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

    return { driver, device };
  }

  async getPppoeActive(deviceId: string) {
    const { driver } = await this.getDriverForDevice(deviceId);
    try {
      return await driver.getPppoeActive();
    } finally {
      await driver.disconnect();
    }
  }

  async getDhcpLeases(deviceId: string) {
    const { driver } = await this.getDriverForDevice(deviceId);
    try {
      return await driver.getDhcpLeases();
    } finally {
      await driver.disconnect();
    }
  }

  async getInterfaces(deviceId: string) {
    const { driver } = await this.getDriverForDevice(deviceId);
    try {
      return await driver.getInterfaces();
    } finally {
      await driver.disconnect();
    }
  }
}
