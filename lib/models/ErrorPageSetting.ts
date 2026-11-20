import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IErrorPageQuickLink {
  id: string;
  label: string;
  desc: string;
  url: string;
  icon?: string;
  enabled?: boolean;
}

export interface IErrorPageSetting extends Document {
  badge_text: string;
  error_code: string;
  heading: string;
  subheading: string;
  primary_btn_text: string;
  primary_btn_url: string;
  secondary_btn_text: string;
  show_secondary_btn: boolean;
  quick_links: IErrorPageQuickLink[];
  support_phone: string;
  whatsapp_number: string;
  whatsapp_text: string;
  show_support_strip: boolean;
  created_at: Date;
  updated_at: Date;
}

const QuickLinkSchema = new Schema<IErrorPageQuickLink>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    desc: { type: String, default: '' },
    url: { type: String, required: true },
    icon: { type: String, default: 'compass' },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const ErrorPageSettingSchema = new Schema<IErrorPageSetting>(
  {
    badge_text: { type: String, default: 'Page Not Found • 404' },
    error_code: { type: String, default: '404' },
    heading: {
      type: String,
      default: 'The Luxury Residence You Are Looking For Seems Relocated',
    },
    subheading: {
      type: String,
      default:
        'The page or layout you requested does not exist or might have been renamed during recent pre-launch updates. Let us guide you back to the official township showcase.',
    },
    primary_btn_text: { type: String, default: 'Return to Homepage' },
    primary_btn_url: { type: String, default: '/' },
    secondary_btn_text: { type: String, default: 'Go Back' },
    show_secondary_btn: { type: Boolean, default: true },
    quick_links: {
      type: [QuickLinkSchema],
      default: [
        {
          id: 'ql_1',
          label: 'Project Overview',
          desc: 'Master layout & 30+ acre luxury township',
          url: '/#overview',
          icon: 'compass',
          enabled: true,
        },
        {
          id: 'ql_2',
          label: 'Floor Plans',
          desc: '2, 3 & 4 BHK architectural layouts',
          url: '/#floor-plans',
          icon: 'building',
          enabled: true,
        },
        {
          id: 'ql_3',
          label: 'Pricing & Configurations',
          desc: 'Starting from ₹1.59 Cr* with early benefits',
          url: '/#pricing',
          icon: 'tag',
          enabled: true,
        },
        {
          id: 'ql_4',
          label: 'Official Sales Desk',
          desc: 'Speak with our certified project specialist',
          url: '/contact',
          icon: 'phone',
          enabled: true,
        },
      ],
    },
    support_phone: { type: String, default: '+91 90222 22448' },
    whatsapp_number: { type: String, default: '919022222448' },
    whatsapp_text: {
      type: String,
      default: 'Hi Prestige Thane Desk, I need assistance finding project details.',
    },
    show_support_strip: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (mongoose.models && mongoose.models.ErrorPageSetting) {
  delete mongoose.models.ErrorPageSetting;
}

const ErrorPageSetting: Model<IErrorPageSetting> =
  mongoose.models.ErrorPageSetting ||
  mongoose.model<IErrorPageSetting>('ErrorPageSetting', ErrorPageSettingSchema);

export default ErrorPageSetting;
