import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderIntelligenceService } from './order-intelligence.service';

@Controller('order-intelligence')
export class OrderIntelligenceController {
  constructor(private readonly orderIntelligenceService: OrderIntelligenceService) {}

  @Post('predict')
  async predict(@Body() data: any) {
    return this.orderIntelligenceService.predictOrder(data);
  }

  @Post('optimize')
  async optimize(@Body() data: any) {
    return this.orderIntelligenceService.optimizeOrder(data);
  }

  @Get('recommendations/:outletId')
  async getRecommendations(@Param('outletId') outletId: string) {
    return this.orderIntelligenceService.getRecommendations(outletId);
  }

  @Post('anomalies')
  async detectAnomalies(@Body() data: any) {
    return this.orderIntelligenceService.detectAnomalies(data);
  }
}