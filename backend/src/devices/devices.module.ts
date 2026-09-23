import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';

import { CredentialsService } from './credentials.service';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService, CredentialsService],
  exports: [DevicesService, CredentialsService],
})
export class DevicesModule {}
