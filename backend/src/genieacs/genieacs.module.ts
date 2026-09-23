import { Module } from '@nestjs/common';
import { GenieacsService } from './genieacs.service';
import { GenieacsController } from './genieacs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GenieacsController],
  providers: [GenieacsService],
  exports: [GenieacsService],
})
export class GenieacsModule {}
