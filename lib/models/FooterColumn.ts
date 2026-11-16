import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IFooterColumnDoc extends Document {
  supabase_id?: string;
  title: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

const FooterColumnSchema = new Schema<IFooterColumnDoc>(
  {
    supabase_id: { type: String, default: null, index: true },
    title: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

FooterColumnSchema.index({ sort_order: 1 });

if (mongoose.models && mongoose.models.FooterColumn) {
  delete mongoose.models.FooterColumn;
}

const FooterColumnModel: Model<IFooterColumnDoc> =
  mongoose.model<IFooterColumnDoc>('FooterColumn', FooterColumnSchema);

export default FooterColumnModel;

