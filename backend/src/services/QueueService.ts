import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { CompanyDescriptionService } from './CompanyDescriptionService';
import { JobStatus } from '../models/JobStatus';
import { Server } from 'socket.io';

let io: Server;

export const initializeQueueService = (socketServer: Server) => {
  io = socketServer;
};

// Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

// Queue for company description generation
export const descriptionQueue = new Queue('company-description', { connection });

// Worker to process the jobs
const worker = new Worker('company-description', async (job: Job) => {
  try {
    const { companyId } = job.data;
    console.log(`Starting job ${job.id} for company ${companyId}`);
    
    // Update job status to processing
    await JobStatus.findOneAndUpdate(
      { jobId: job.id },
      { status: 'processing' },
      { new: true }
    );

    // Notify frontend about status change
    console.log(`Emitting processing status for job ${job.id}`);
    io.emit(`job:${job.id}`, { 
      status: 'processing',
      jobId: job.id,
      companyId
    });

    const company = await CompanyDescriptionService.generateAndSaveDescription(companyId);
    
    // Update job status to completed
    await JobStatus.findOneAndUpdate(
      { jobId: job.id },
      { 
        status: 'completed',
        result: company
      },
      { new: true }
    );

    // Notify frontend about completion
    console.log(`Emitting completed status for job ${job.id}`);
    io.emit(`job:${job.id}`, { 
      status: 'completed',
      result: company,
      jobId: job.id,
      companyId
    });

    return { success: true, company };
  } catch (error: any) {
    console.error('Job failed:', error);
    
    // Update job status to failed
    await JobStatus.findOneAndUpdate(
      { jobId: job.id },
      { 
        status: 'failed',
        error: error.message || 'Failed to generate company description'
      },
      { new: true }
    );

    // Notify frontend about failure with detailed error
    console.log(`Emitting failed status for job ${job.id}`);
    io.emit(`job:${job.id}`, { 
      status: 'failed',
      error: error.message || 'Failed to generate company description',
      jobId: job.id,
      companyId: job.data.companyId
    });

    // Also emit a general error event for the company
    console.log(`Emitting company error for company ${job.data.companyId}`);
    io.emit(`company:${job.data.companyId}:error`, {
      type: 'description-generation',
      error: error.message || 'Failed to generate company description',
      jobId: job.id
    });

    throw error;
  }
}, { connection });

// Handle worker events
worker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} completed for company ${job.data.companyId}`);
});

worker.on('failed', (job: Job | undefined, error: Error) => {
  if (job) {
    console.error(`Job ${job.id} failed for company ${job.data.companyId}:`, error);
  } else {
    console.error('Job failed:', error);
  }
});

export const QueueService = {
  async addDescriptionJob(companyId: string) {
    const job = await descriptionQueue.add('generate-description', { companyId });
    
    // Create initial job status record
    await JobStatus.create({
      jobId: job.id,
      type: 'description-generation',
      status: 'pending',
      companyId
    });

    // Notify frontend about new job
    io.emit(`job:${job.id}`, { 
      status: 'pending',
      jobId: job.id
    });

    return job.id;
  },

  async getJobStatus(jobId: string) {
    // Get status from MongoDB instead of Redis
    const jobStatus = await JobStatus.findOne({ jobId });
    if (!jobStatus) {
      return { status: 'not_found' };
    }

    return {
      status: jobStatus.status,
      progress: jobStatus.progress,
      result: jobStatus.result,
      error: jobStatus.error,
      createdAt: jobStatus.createdAt,
      updatedAt: jobStatus.updatedAt
    };
  },

  // Get all jobs for a company
  async getCompanyJobs(companyId: string) {
    return JobStatus.find({ companyId })
      .sort({ createdAt: -1 })
      .limit(10);
  }
}; 