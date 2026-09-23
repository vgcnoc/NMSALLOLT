import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { DriversModule } from '../drivers/drivers.module';
import { SnmpPollerWorker } from './snmp-poller.worker';
import { SshPollerWorker } from './ssh-poller.worker';
import { MikrotikPollerWorker } from './mikrotik-poller.worker';
import { AlarmProcessorWorker } from './alarm-processor.worker';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'snmp-poll' },
      { name: 'ssh-poll' },
      { name: 'mikrotik-poll' },
      { name: 'genieacs-sync' },
      { name: 'alarm-process' },
      { name: 'notification-send' },
      { name: 'device-discovery' },
      { name: 'metric-aggregate' },
    ),
    DriversModule,
  ],
  providers: [SnmpPollerWorker, SshPollerWorker, MikrotikPollerWorker, AlarmProcessorWorker, SchedulerService],
})
export class WorkersModule {}
