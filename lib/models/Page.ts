import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPageBlock {
  id: string;
  type: string;
  name: string;
  subtitle?: string;
  enabled?: boolean;
  data?: Record<string, any>;
}

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

  // Upgraded CMS fields
  enable_tailwind_cdn?: boolean;
  custom_css?: string;
  custom_js?: string;
  blocks?: IPageBlock[];
  override_global_title?: boolean;
  head_scripts?: string | null;
  hide_from_nav?: boolean;
  hide_from_sitemap?: boolean;
  no_index?: boolean;
  no_follow?: boolean;
  change_frequency?: string;
  sitemap_priority?: number;

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

    // Upgraded CMS fields
    enable_tailwind_cdn: { type: Boolean, default: false },
    custom_css: { type: String, default: '' },
    custom_js: { type: String, default: '' },
    blocks: { type: [Schema.Types.Mixed], default: [] },
    override_global_title: { type: Boolean, default: false },
    head_scripts: { type: String, default: '' },
    hide_from_nav: { type: Boolean, default: false },
    hide_from_sitemap: { type: Boolean, default: false },
    no_index: { type: Boolean, default: false },
    no_follow: { type: Boolean, default: false },
    change_frequency: { type: String, default: 'weekly' },
    sitemap_priority: { type: Number, default: 0.8 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

PageSchema.index({ slug: 1, status: 1 });
PageSchema.index({ status: 1, sort_order: 1 });

if (mongoose.models && mongoose.models.Page) {
  delete mongoose.models.Page;
}

const PageModel: Model<IPageDoc> = mongoose.model<IPageDoc>('Page', PageSchema);

export default PageModel;
