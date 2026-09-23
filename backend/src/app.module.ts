import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuditModule } from './audit/audit.module';
import { DevicesModule } from './devices/devices.module';
import { WebsocketModule } from './websocket/websocket.module';
import { PopsModule } from './pops/pops.module';
import { OltsModule } from './olts/olts.module';
import { OnusModule } from './onus/onus.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SearchModule } from './search/search.module';
import { WorkersModule } from './workers/workers.module';
import { DriversModule } from './drivers/drivers.module';
import { GenieacsModule } from './genieacs/genieacs.module';
import { MikrotikModule } from './mikrotik/mikrotik.module';
import { AlarmsModule } from './alarms/alarms.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
    DevicesModule,
    WebsocketModule,
    PopsModule,
    OltsModule,
    OnusModule,
    DashboardModule,
    SearchModule,
    WorkersModule,
    DriversModule,
    GenieacsModule,
    MikrotikModule,
    AlarmsModule,
    NotificationsModule,
    MapModule,
    // Future Modules to implement:
    // MetricsModule,
    // DiscoveryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
