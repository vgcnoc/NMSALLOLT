import { Injectable } from '@nestjs/common';
import { DriverFactory } from '../drivers/driver-factory.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OltsService {
  constructor(
    private driverFactory: DriverFactory,
    private prisma: PrismaService
  ) {}

  async findAll(search?: string) {
    const where = search ? {
      device: {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { ipAddress: { contains: search } }
        ]
      }
    } : {};

    const olts = await this.prisma.olt.findMany({
      where,
      include: { device: true },
    });
    
    return {
      data: olts,
      meta: {
        total: olts.length,
        page: 1,
        limit: olts.length || 10,
        totalPages: 1
      }
    };
  }

  async findOne(id: string) { 
    return this.prisma.olt.findUnique({
      where: { id },
      include: { device: true }
    });
  }

  async getBoards(id: string) { 
    return this.prisma.oltBoard.findMany({ where: { oltId: id } });
  }
  
  async getPonPorts(id: string) { 
    return this.prisma.oltPonPort.findMany({ where: { oltId: id } });
  }
  
  async getOnus(id: string) { 
    const onus = await this.prisma.onu.findMany({ where: { oltId: id } });
    return { data: onus, meta: { total: onus.length, page: 1, limit: onus.length || 10, totalPages: 1 } };
  }
  
  async getAlarms(id: string) { 
    return []; 
  }

  async pollOlt(id: string) { 
    const olt = await this.prisma.olt.findUnique({
      where: { id },
      include: { 
        device: {
          include: { credential: true }
        } 
      }
    });
    
    if (!olt) throw new Error('OLT not found');

    // Remove the mock override: pass false for useMock
    const driver = this.driverFactory.createOltDriver(olt.device.vendor || 'zte', olt.device.model || '', false);
    
    const creds = olt.device.credential || {};
    
    await driver.connect({ 
      ip: olt.device.ipAddress,
      sshUsername: creds.sshUsernameEnc, 
      sshPassword: creds.sshPasswordEnc,
      sshPort: creds.sshPort || 22,
      apiUsername: creds.apiUsernameEnc,
      apiPassword: creds.apiPasswordEnc,
    });

    // Poll live data from the OLT via SSH/SNMP
    const ports = await driver.getPonPorts();
    
    // Clear old data
    await this.prisma.onu.deleteMany({ where: { oltId: id } });
    await this.prisma.oltPonPort.deleteMany({ where: { oltId: id } });

    // Insert new PON Ports
    for (const p of ports) {
      const slotNum = Number(p.slot);
      const portNum = Number(p.port);

      const ponPort = await this.prisma.oltPonPort.create({
        data: {
          oltId: id,
          slot: slotNum,
          port: portNum,
          name: `gpon-olt_1/${slotNum}/${portNum}`,
          status: p.adminState || p.status || 'up',
          totalOnus: 2,
          onlineOnus: 1,
          ponType: 'GPON'
        }
      });

      const onus = await driver.getOnus(slotNum, portNum);
      for (const o of onus) {
        const power = await driver.getOpticalPower(slotNum, portNum, o.id);
        await this.prisma.onu.create({
          data: {
            oltId: id,
            ponPortId: ponPort.id,
            onuId: o.id,
            serialNumber: o.sn,
            status: o.status,
            macAddress: o.mac || '00:11:22:33:44:55',
            rxPower: power.rx,
            txPower: power.tx
          }
        });
      }
    }

    await driver.disconnect();
    return { success: true, message: 'OLT polled successfully' };
  }
}
