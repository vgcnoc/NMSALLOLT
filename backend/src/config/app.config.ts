import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT || '3000', 10),
  name: process.env.APP_NAME || 'ISP NMS',
  url: process.env.APP_URL || 'http://localhost:3000',
  corsOrigins: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['*'],
}));
