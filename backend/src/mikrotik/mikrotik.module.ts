import { Module } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';
import { MikrotikController } from './mikrotik.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [PrismaModule, DriversModule],
  controllers: [MikrotikController],
  providers: [MikrotikService],
  exports: [MikrotikService],
})
export class MikrotikModule {}
