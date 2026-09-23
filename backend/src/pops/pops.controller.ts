import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PopsService } from './pops.service';
import { CreatePopDto } from './dto/create-pop.dto';

@Controller('pops')
export class PopsController {
  constructor(private readonly popsService: PopsService) {}
  
  @Get()
  findAll() { return this.popsService.findAll(); }
  
  @Get(':id')
  findOne(@Param('id') id: string) { return this.popsService.findOne(+id); }
  
  @Post()
  create(@Body() createPopDto: CreatePopDto) { return this.popsService.create(createPopDto); }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePopDto: any) { return this.popsService.update(+id, updatePopDto); }
  
  @Delete(':id')
  remove(@Param('id') id: string) { return this.popsService.remove(+id); }
  
  @Get(':id/devices')
  getDevices(@Param('id') id: string) { return this.popsService.getDevices(+id); }
}
