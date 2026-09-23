import { Module } from '@nestjs/common';
import { AlarmsService } from './alarms.service';
import { AlarmsController } from './alarms.controller';
import { AlarmRulesService } from './alarm-rules.service';
import { AlarmRulesController } from './alarm-rules.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlarmsController, AlarmRulesController],
  providers: [AlarmsService, AlarmRulesService],
  exports: [AlarmsService, AlarmRulesService],
})
export class AlarmsModule {}
