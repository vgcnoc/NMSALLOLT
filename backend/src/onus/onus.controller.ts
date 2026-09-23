import { Controller, Get, Param, Post } from '@nestjs/common';
import { OnusService } from './onus.service';

@Controller('onus')
export class OnusController {
  constructor(private readonly onusService: OnusService) {}
  
  @Get()
  findAll() { return this.onusService.findAll(); }
  
  @Get(':id')
  findOne(@Param('id') id: string) { return this.onusService.findOne(+id); }
  
  @Get(':id/optical-power')
  getOpticalPower(@Param('id') id: string) { return this.onusService.getOpticalPower(+id); }
  
  @Post(':id/reboot')
  reboot(@Param('id') id: string) { return this.onusService.reboot(+id); }
}
