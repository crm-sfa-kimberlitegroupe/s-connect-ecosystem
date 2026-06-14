import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.analyticsService.getDashboardData();
  }

  @Get('sales')
  async getSalesAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('territoryId') territoryId?: string,
    @Query('vendorId') vendorId?: string,
  ) {
    return this.analyticsService.getSalesAnalytics({
      startDate,
      endDate,
      territoryId,
      vendorId,
    });
  }

  @Get('performance')
  async getPerformanceAnalytics(
    @Query('userId') userId?: string,
    @Query('territoryId') territoryId?: string,
    @Query('period') period?: string,
  ) {
    return this.analyticsService.getPerformanceAnalytics({
      userId,
      territoryId,
      period,
    });
  }

  @Get('territories/:territoryId')
  async getTerritoryAnalytics(@Param('territoryId') territoryId: string) {
    return this.analyticsService.getTerritoryAnalytics(territoryId);
  }

  @Post('reports')
  async generateReport(@Body() data: any) {
    return this.analyticsService.generateReport(data);
  }
}
