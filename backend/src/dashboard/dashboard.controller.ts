import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  
  @Get('overview')
  getOverview() { return this.dashboardService.getOverview(); }
  
  @Get('charts/ont-status')
  getOntStatus() { return this.dashboardService.getOntStatus(); }
  
  @Get('charts/traffic')
  getTraffic() { return this.dashboardService.getTraffic(); }
  
  @Get('charts/alarms')
  getAlarms() { return this.dashboardService.getAlarms(); }
}
