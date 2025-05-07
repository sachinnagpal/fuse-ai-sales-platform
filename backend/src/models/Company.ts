import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  size: string;
  website: string;
  founded: number;
  locality: string;
  region: string;
  country: string;
  industry: string;
  linkedin_url: string;
  description?: string;
  isSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema({
  name: { type: String, required: true, index: true },
  size: { type: String, required: true, index: true },
  website: { type: String, required: true },
  founded: { type: Number, required: true },
  locality: { type: String, required: true },
  region: { type: String, required: true },
  country: { type: String, required: true, index: true },
  industry: { type: String, required: true, index: true },
  linkedin_url: { type: String, required: true },
  description: { type: String },
  isSaved: { type: Boolean, default: false, index: true },
}, {
  timestamps: true
});

companySchema.index({ name: 1 });
companySchema.index({ country: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ size: 1 });


export const Company = mongoose.model<ICompany>('Company', companySchema); 