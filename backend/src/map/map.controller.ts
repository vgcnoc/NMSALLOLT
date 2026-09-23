import { Controller, Get, UseGuards } from '@nestjs/common';
import { MapService } from './map.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('map')
@UseGuards(JwtAuthGuard)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('nodes')
  getNodes() {
    return this.mapService.getNodesGeoJson();
  }

  @Get('routes')
  getRoutes() {
    return this.mapService.getRoutesGeoJson();
  }

  @Get('topology')
  getTopology() {
    return this.mapService.getTopology();
  }
}
