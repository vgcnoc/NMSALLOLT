import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GenieacsService } from './genieacs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('genieacs')
export class GenieacsController {
  constructor(private readonly genieacsService: GenieacsService) {}

  @Get('devices')
  getDevices(@Query() query: any) {
    return this.genieacsService.getDevices(query);
  }

  @Get('devices/:id')
  getDeviceById(@Param('id') id: string) {
    return this.genieacsService.getDeviceById(id);
  }

  @Post('devices/:id/refresh')
  refreshDevice(@Param('id') id: string) {
    return this.genieacsService.refreshDevice(id);
  }

  @Post('devices/:id/reboot')
  rebootDevice(@Param('id') id: string) {
    return this.genieacsService.rebootDevice(id);
  }

  @Post('devices/:id/factory-reset')
  factoryResetDevice(@Param('id') id: string) {
    return this.genieacsService.factoryResetDevice(id);
  }

  @Post('devices/:id/parameters')
  getParameterValues(@Param('id') id: string, @Body('params') params: string[]) {
    return this.genieacsService.getParameterValues(id, params);
  }

  @Post('devices/:id/set-parameters')
  setParameterValues(@Param('id') id: string, @Body('params') params: Record<string, any>) {
    return this.genieacsService.setParameterValues(id, params);
  }
}
