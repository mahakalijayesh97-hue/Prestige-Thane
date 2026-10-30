import mongoose, { Schema, Model, Document } from 'mongoose';

export interface INavItemDoc extends Document {
  supabase_id?: string;
  label: string;
  url: string;
  parent_id?: string | null;
  sort_order: number;
  target: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const NavItemSchema = new Schema<INavItemDoc>(
  {
    supabase_id: { type: String, default: null, index: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    parent_id: { type: String, default: null, index: true },
    sort_order: { type: Number, default: 0 },
    target: { type: String, default: '_self' },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (mongoose.models && mongoose.models.NavItem) {
  delete mongoose.models.NavItem;
}

const NavItemModel: Model<INavItemDoc> = mongoose.model<INavItemDoc>('NavItem', NavItemSchema);

export default NavItemModel;

