import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AlarmRulesService } from './alarm-rules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('alarm-rules')
export class AlarmRulesController {
  constructor(private readonly alarmRulesService: AlarmRulesService) {}

  @Get()
  getAlarmRules() {
    return this.alarmRulesService.getAlarmRules();
  }

  @Get(':id')
  getAlarmRuleById(@Param('id') id: string) {
    return this.alarmRulesService.getAlarmRuleById(id);
  }

  @Post()
  createAlarmRule(@Body() data: any) {
    return this.alarmRulesService.createAlarmRule(data);
  }

  @Put(':id')
  updateAlarmRule(@Param('id') id: string, @Body() data: any) {
    return this.alarmRulesService.updateAlarmRule(id, data);
  }

  @Delete(':id')
  deleteAlarmRule(@Param('id') id: string) {
    return this.alarmRulesService.deleteAlarmRule(id);
  }
}
