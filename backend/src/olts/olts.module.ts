import { Module } from '@nestjs/common';
import { OltsController } from './olts.controller';
import { OltsService } from './olts.service';
import { PonPortsService } from './pon-ports.service';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [DriversModule],
  controllers: [OltsController],
  providers: [OltsService, PonPortsService],
  exports: [OltsService]
})
export class OltsModule {}
