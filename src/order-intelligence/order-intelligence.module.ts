import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderIntelligenceService } from './order-intelligence.service';
import { OrderIntelligenceController } from './order-intelligence.controller';

@Module({
  imports: [HttpModule],
  controllers: [OrderIntelligenceController],
  providers: [OrderIntelligenceService],
  exports: [OrderIntelligenceService],
})
export class OrderIntelligenceModule {}