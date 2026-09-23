import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlarmRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAlarmRules() {
    return this.prisma.alarmRule.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAlarmRuleById(id: string) {
    const rule = await this.prisma.alarmRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException('AlarmRule not found');
    return rule;
  }

  async createAlarmRule(data: any) {
    return this.prisma.alarmRule.create({
      data,
    });
  }

  async updateAlarmRule(id: string, data: any) {
    return this.prisma.alarmRule.update({
      where: { id },
      data,
    });
  }

  async deleteAlarmRule(id: string) {
    return this.prisma.alarmRule.delete({
      where: { id },
    });
  }
}
