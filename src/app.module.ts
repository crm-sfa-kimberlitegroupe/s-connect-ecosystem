import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

// Modules de base
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TerritoriesModule } from './territories/territories.module';
import { OutletsModule } from './outlets/outlets.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { VisitsModule } from './visits/visits.module';

// Modules ML avancés
import { QueueModule } from './queue/queue.module';
import { OrderIntelligenceModule } from './order-intelligence/order-intelligence.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TerritoriesModule,
    OutletsModule,
    CloudinaryModule,
    VisitsModule,
    QueueModule,
    OrderIntelligenceModule,
    AnalyticsModule,
  ],
})
export class AppModule {}