import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPageDoc extends Document {
  supabase_id?: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  content: string;
  seo_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  hero_image?: string | null;
  is_homepage: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

const PageSchema = new Schema<IPageDoc>(
  {
    supabase_id: { type: String, default: null, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    content: { type: String, default: '' },
    seo_title: { type: String, default: null },
    meta_description: { type: String, default: null },
    meta_keywords: { type: String, default: null },
    hero_image: { type: String, default: null },
    is_homepage: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (mongoose.models && mongoose.models.Page) {
  delete mongoose.models.Page;
}

const PageModel: Model<IPageDoc> = mongoose.model<IPageDoc>('Page', PageSchema);

export default PageModel;

