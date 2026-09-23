import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('channels')
  getChannels() {
    return this.notificationsService.getChannels();
  }

  @Get('channels/:id')
  getChannelById(@Param('id') id: string) {
    return this.notificationsService.getChannelById(id);
  }

  @Post('channels')
  createChannel(@Body() data: any) {
    return this.notificationsService.createChannel(data);
  }

  @Put('channels/:id')
  updateChannel(@Param('id') id: string, @Body() data: any) {
    return this.notificationsService.updateChannel(id, data);
  }

  @Delete('channels/:id')
  deleteChannel(@Param('id') id: string) {
    return this.notificationsService.deleteChannel(id);
  }

  @Post('channels/:id/send')
  sendNotification(@Param('id') id: string, @Body('message') message: string) {
    return this.notificationsService.sendNotification(id, message);
  }
}
