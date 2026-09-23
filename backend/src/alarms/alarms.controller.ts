import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { AlarmsService } from './alarms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Get()
  getAlarms() {
    return this.alarmsService.getAlarms();
  }

  @Post(':id/acknowledge')
  acknowledgeAlarm(@Param('id') id: string, @Req() req: any) {
    return this.alarmsService.acknowledgeAlarm(id, req.user.id);
  }

  @Post(':id/resolve')
  resolveAlarm(@Param('id') id: string) {
    return this.alarmsService.resolveAlarm(id);
  }
}
