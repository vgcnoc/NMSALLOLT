import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  
  @Cron(CronExpression.EVERY_5_MINUTES)
  handleSnmpPoll() { this.logger.log('Scheduling SNMP Polls'); }
  
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleSshPoll() { this.logger.log('Scheduling SSH Polls'); }
}
