import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  phone: string;
  email: string;
  configuration: string;
  intent: string;
  source: string;
  notes?: string;
  is_read?: boolean;
  status?: string;
  created_at: Date;
  updated_at: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, default: 'Homebuyer' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    configuration: { type: String, default: '2 BHK' },
    intent: { type: String, default: 'General Enquiry' },
    source: { type: String, default: 'Hero Section' },
    notes: { type: String, default: '' },
    is_read: { type: Boolean, default: false },
    status: { type: String, default: 'new' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (mongoose.models && mongoose.models.Lead) {
  delete mongoose.models.Lead;
}

const Lead: Model<ILead> = mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;

