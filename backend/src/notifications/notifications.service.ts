import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getChannels() {
    return this.prisma.notificationChannel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getChannelById(id: string) {
    const channel = await this.prisma.notificationChannel.findUnique({ where: { id } });
    if (!channel) throw new NotFoundException('NotificationChannel not found');
    return channel;
  }

  async createChannel(data: any) {
    return this.prisma.notificationChannel.create({ data });
  }

  async updateChannel(id: string, data: any) {
    return this.prisma.notificationChannel.update({
      where: { id },
      data,
    });
  }

  async deleteChannel(id: string) {
    return this.prisma.notificationChannel.delete({ where: { id } });
  }

  async sendNotification(channelId: string, message: string) {
    const channel = await this.getChannelById(channelId);
    
    // Mock sending logic for now
    this.logger.log(`[MOCK] Sending message to ${channel.type} channel ${channel.name}: ${message}`);
    
    return { success: true, message: 'Notification sent successfully (mocked)' };
  }
}
