import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlarmsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAlarms() {
    return this.prisma.alarm.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        device: true,
        alarmRule: true,
      },
    });
  }

  async acknowledgeAlarm(id: string, userId: string) {
    const alarm = await this.prisma.alarm.findUnique({ where: { id } });
    if (!alarm) throw new NotFoundException('Alarm not found');

    return this.prisma.alarm.update({
      where: { id },
      data: {
        status: 'ACKNOWLEDGED',
        acknowledgedAt: new Date(),
        acknowledgedByUserId: userId,
      },
    });
  }

  async resolveAlarm(id: string) {
    const alarm = await this.prisma.alarm.findUnique({ where: { id } });
    if (!alarm) throw new NotFoundException('Alarm not found');

    return this.prisma.alarm.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        clearedAt: new Date(),
      },
    });
  }
}
