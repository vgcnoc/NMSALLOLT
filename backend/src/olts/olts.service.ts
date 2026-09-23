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

  getBoards(id: string) { return []; }
  getPonPorts(id: string) { return []; }
  getOnus(id: string) { return []; }
  getAlarms(id: string) { return []; }
  pollOlt(id: string) { return true; }
}
