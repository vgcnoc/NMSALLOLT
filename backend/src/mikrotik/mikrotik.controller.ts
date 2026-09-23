import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mikrotik')
export class MikrotikController {
  constructor(private readonly mikrotikService: MikrotikService) {}

  @Get(':id/pppoe')
  getPppoeActive(@Param('id') id: string) {
    return this.mikrotikService.getPppoeActive(id);
  }

  @Get(':id/dhcp')
  getDhcpLeases(@Param('id') id: string) {
    return this.mikrotikService.getDhcpLeases(id);
  }

  @Get(':id/interfaces')
  getInterfaces(@Param('id') id: string) {
    return this.mikrotikService.getInterfaces(id);
  }
}
