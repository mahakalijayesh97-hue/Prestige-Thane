import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IFooterSetting extends Document {
  footer_image: string;
  custom_html: string;
  custom_css: string;
  custom_js: string;
  show_default_links: boolean;
  created_at: Date;
  updated_at: Date;
}

const FooterSettingSchema = new Schema<IFooterSetting>(
  {
    footer_image: { type: String, default: '' },
    custom_html: { type: String, default: '' },
    custom_css: { type: String, default: '' },
    custom_js: { type: String, default: '' },
    show_default_links: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const FooterSetting: Model<IFooterSetting> =
  (mongoose.models && mongoose.models.FooterSetting) ||
  mongoose.model<IFooterSetting>('FooterSetting', FooterSettingSchema);

export default FooterSetting;

