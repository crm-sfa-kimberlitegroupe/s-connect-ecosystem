import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QUEUE_NAMES } from './queue.constants';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('stats')
  async getStats() {
    return this.queueService.getQueueStats();
  }

  @Post('email')
  async addEmailJob(@Body() data: any) {
    return this.queueService.addEmailJob(data);
  }

  @Post('analytics')
  async addAnalyticsJob(@Body() data: any) {
    return this.queueService.addAnalyticsJob(data);
  }

  @Post('data-pipeline')
  async addDataPipelineJob(@Body() data: any) {
    return this.queueService.addDataPipelineJob(data);
  }

  @Post('ml-predictions')
  async addMLPredictionJob(@Body() data: any) {
    return this.queueService.addMLPredictionJob(data);
  }

  @Delete('clean/:queueName')
  async cleanQueue(@Param('queueName') queueName: string) {
    return this.queueService.cleanCompletedJobs(queueName);
  }
}