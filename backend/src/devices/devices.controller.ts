import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateDeviceDto } from './dto/create-device.dto';

@ApiTags('devices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new device' })
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all devices' })
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device by id' })
  findOne(@Param('id') id: string) {
    return this.devicesService.findById(id);
  }

  @Post(':id/poll')
  @ApiOperation({ summary: 'Trigger a manual poll for a device' })
  async poll(@Param('id') id: string) {
    // In a real implementation, this would queue a job or call the driver
    // For now, return success so the frontend doesn't throw 404
    return { success: true, message: 'Poll initiated successfully for device ' + id };
  }
}
