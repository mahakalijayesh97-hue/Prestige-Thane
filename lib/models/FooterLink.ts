import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IFooterLinkDoc extends Document {
  supabase_id?: string;
  label: string;
  url: string;
  column_id: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

const FooterLinkSchema = new Schema<IFooterLinkDoc>(
  {
    supabase_id: { type: String, default: null, index: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    column_id: { type: String, required: true, index: true },
    sort_order: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

FooterLinkSchema.index({ column_id: 1, sort_order: 1 });

if (mongoose.models && mongoose.models.FooterLink) {
  delete mongoose.models.FooterLink;
}

const FooterLinkModel: Model<IFooterLinkDoc> =
  mongoose.model<IFooterLinkDoc>('FooterLink', FooterLinkSchema);

export default FooterLinkModel;

