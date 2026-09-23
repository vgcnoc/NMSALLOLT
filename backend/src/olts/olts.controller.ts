import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { OltsService } from './olts.service';

@Controller('olts')
export class OltsController {
  constructor(private readonly oltsService: OltsService) {}
  
  @Get()
  findAll(@Query('search') search?: string) { return this.oltsService.findAll(search); }
  
  @Get(':id')
  findOne(@Param('id') id: string) { return this.oltsService.findOne(id); }
  
  @Get(':id/boards')
  getBoards(@Param('id') id: string) { return this.oltsService.getBoards(id); }
  
  @Get(':id/pon-ports')
  getPonPorts(@Param('id') id: string) { return this.oltsService.getPonPorts(id); }
  
  @Get(':id/onus')
  getOnus(@Param('id') id: string) { return this.oltsService.getOnus(id); }
  
  @Get(':id/alarms')
  getAlarms(@Param('id') id: string) { return this.oltsService.getAlarms(id); }
  
  @Post(':id/poll')
  pollOlt(@Param('id') id: string) { return this.oltsService.pollOlt(id); }
}
