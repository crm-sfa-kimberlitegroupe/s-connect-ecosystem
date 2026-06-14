import { InjectQueue } from '@nestjs/bull';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_NAMES } from './queue.constants';

const ENABLE_QUEUES = process.env.ENABLE_QUEUES === 'true';

@Injectable()
export class QueueService {
  constructor(
    @Optional() @InjectQueue(QUEUE_NAMES.EMAIL) private emailQueue: Queue,
    @Optional() @InjectQueue(QUEUE_NAMES.ANALYTICS) private analyticsQueue: Queue,
    @Optional() @InjectQueue(QUEUE_NAMES.DATA_PIPELINE) private dataPipelineQueue: Queue,
    @Optional() @InjectQueue(QUEUE_NAMES.ML_PREDICTIONS) private mlPredictionsQueue: Queue,
  ) {}

  // Email Queue
  async addEmailJob(data: any) {
    if (!ENABLE_QUEUES || !this.emailQueue) {
      return this.simulateJob('email', data);
    }
    
    return this.emailQueue.add('send-email', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  // Analytics Queue
  async addAnalyticsJob(data: any) {
    if (!ENABLE_QUEUES || !this.analyticsQueue) {
      return this.simulateJob('analytics', data);
    }
    
    return this.analyticsQueue.add('generate-analytics', data, {
      attempts: 2,
      priority: 1,
    });
  }

  // Data Pipeline Queue
  async addDataPipelineJob(data: any) {
    if (!ENABLE_QUEUES || !this.dataPipelineQueue) {
      return this.simulateJob('data-pipeline', data);
    }
    
    return this.dataPipelineQueue.add('process-data', data, {
      attempts: 3,
      delay: 5000,
    });
  }

  // ML Predictions Queue
  async addMLPredictionJob(data: any) {
    if (!ENABLE_QUEUES || !this.mlPredictionsQueue) {
      return this.simulateJob('ml-predictions', data);
    }
    
    return this.mlPredictionsQueue.add('generate-prediction', data, {
      attempts: 2,
      priority: 2,
    });
  }

  // Get Queue Statistics
  async getQueueStats() {
    if (!ENABLE_QUEUES || !this.emailQueue) {
      return this.getSimulationStats();
    }

    try {
      const [email, analytics, dataPipeline, mlPredictions] = await Promise.all([
        this.emailQueue?.getJobCounts() || Promise.resolve({ waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 }),
        this.analyticsQueue?.getJobCounts() || Promise.resolve({ waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 }),
        this.dataPipelineQueue?.getJobCounts() || Promise.resolve({ waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 }),
        this.mlPredictionsQueue?.getJobCounts() || Promise.resolve({ waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 }),
      ]);

      return {
        email,
        analytics,
        dataPipeline,
        mlPredictions,
        mode: 'redis',
      };
    } catch (error) {
      console.error('Error getting queue stats:', error);
      return this.getSimulationStats();
    }
  }

  // Clean completed jobs
  async cleanCompletedJobs(queueName: string) {
    if (!ENABLE_QUEUES) {
      return { message: 'Queue mode disabled, no jobs to clean', mode: 'simulation' };
    }

    let queue: Queue | undefined;
    switch (queueName) {
      case QUEUE_NAMES.EMAIL:
        queue = this.emailQueue;
        break;
      case QUEUE_NAMES.ANALYTICS:
        queue = this.analyticsQueue;
        break;
      case QUEUE_NAMES.DATA_PIPELINE:
        queue = this.dataPipelineQueue;
        break;
      case QUEUE_NAMES.ML_PREDICTIONS:
        queue = this.mlPredictionsQueue;
        break;
      default:
        throw new Error('Invalid queue name');
    }

    if (!queue) {
      return { message: `Queue ${queueName} not available`, mode: 'simulation' };
    }

    return queue.clean(0, 'completed');
  }

  // Simulation de job processing (mode sans Redis)
  private async simulateJob(type: string, data: any) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `SIM-${Date.now()}`,
      type,
      data,
      status: 'completed',
      processedAt: new Date().toISOString(),
      result: this.getSimulationResult(type),
      mode: 'simulation',
    };
  }

  private getSimulationResult(type: string) {
    switch (type) {
      case 'email':
        return { success: true, messageId: `SIM-${Date.now()}` };
      case 'analytics':
        return { success: true, data: { totalSales: Math.random() * 10000 } };
      case 'data-pipeline':
        return { success: true, recordsProcessed: Math.floor(Math.random() * 1000) };
      case 'ml-predictions':
        return { success: true, predictions: { recommendedQuantity: Math.floor(Math.random() * 100) } };
      default:
        return { success: true };
    }
  }

  private getSimulationStats() {
    return {
      email: { waiting: 0, active: 0, completed: 5, failed: 0, delayed: 0 },
      analytics: { waiting: 0, active: 0, completed: 3, failed: 0, delayed: 0 },
      dataPipeline: { waiting: 0, active: 0, completed: 2, failed: 0, delayed: 0 },
      mlPredictions: { waiting: 0, active: 0, completed: 8, failed: 0, delayed: 0 },
      mode: 'simulation',
    };
  }
}