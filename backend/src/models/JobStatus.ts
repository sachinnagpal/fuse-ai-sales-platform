import mongoose, { Schema, Document } from 'mongoose';

export interface IJobStatus extends Document {
  jobId: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  companyId: string;
  result?: any;
  error?: string;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobStatusSchema = new Schema({
  jobId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed']
  },
  companyId: { type: String, required: true },
  result: { type: Schema.Types.Mixed },
  error: { type: String },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

export const JobStatus = mongoose.model<IJobStatus>('JobStatus', JobStatusSchema); 