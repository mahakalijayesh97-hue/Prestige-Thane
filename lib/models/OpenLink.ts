import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IOpenLinkDoc extends Document {
  supabase_id?: string;
  title: string;
  slug: string;
  url: string;
  link_type: 'page' | 'scroller' | 'external';
  target: '_self' | '_blank';
  html: string;
  css: string;
  js: string;
  content: string;
  status: 'draft' | 'published';
  is_active: boolean;
  add_to_navbar: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

const OpenLinkSchema = new Schema<IOpenLinkDoc>(
  {
    supabase_id: { type: String, default: null, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    url: { type: String, required: true },
    link_type: { type: String, enum: ['page', 'scroller', 'external'], default: 'page' },
    target: { type: String, enum: ['_self', '_blank'], default: '_self' },
    html: { type: String, default: '' },
    css: { type: String, default: '' },
    js: { type: String, default: '' },
    content: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    is_active: { type: Boolean, default: true },
    add_to_navbar: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

OpenLinkSchema.index({ is_active: 1, sort_order: 1 });
OpenLinkSchema.index({ slug: 1, status: 1 });

if (mongoose.models && mongoose.models.OpenLink) {
  delete mongoose.models.OpenLink;
}

const OpenLinkModel: Model<IOpenLinkDoc> = mongoose.model<IOpenLinkDoc>('OpenLink', OpenLinkSchema);

export default OpenLinkModel;
