import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IThemeSetting extends Document {
  primary_color: string;
  accent_color: string;
  text_color: string;
  heading_color: string;
  muted_text_color: string;
  site_name_color: string;
  sub_site_name: string;
  sub_site_name_color: string;
  favicon_url: string;
  custom_css: string;
  custom_js: string;
  header_scripts: string;
  navbar_phone: string;
  navbar_phone_show: boolean;
  navbar_cta_text: string;
  navbar_cta_url: string;
  navbar_cta_show: boolean;

  // Prestige Project Showcase Fields
  project_title: string;
  project_category: string;
  project_subtitle: string;
  project_location: string;
  project_description: string;
  project_starting_price: string;
  project_configuration: string;
  project_possession: string;
  project_rera: string;
  project_developer: string;
  project_tagline: string;
  project_hero_image: string;

  // Property Advisor Chat Settings
  advisor_chat_enabled: boolean;
  advisor_chat_title: string;
  advisor_chat_subtitle: string;
  advisor_chat_tooltip: string;
  advisor_chat_welcome_title: string;
  advisor_chat_welcome_msg: string;
  advisor_chat_action_1: string;
  advisor_chat_action_2: string;
  advisor_chat_whatsapp: string;
  advisor_chat_prefill: string;

  created_at: Date;
  updated_at: Date;
}

const ThemeSettingSchema = new Schema<IThemeSetting>(
  {
    primary_color: { type: String, default: '#2563eb' },
    accent_color: { type: String, default: '#f59e0b' },
    text_color: { type: String, default: '#1e293b' },
    heading_color: { type: String, default: '#0f172a' },
    muted_text_color: { type: String, default: '#64748b' },
    site_name_color: { type: String, default: '#0f172a' },
    sub_site_name: { type: String, default: '' },
    sub_site_name_color: { type: String, default: '#64748b' },
    favicon_url: { type: String, default: '' },
    custom_css: { type: String, default: '' },
    custom_js: { type: String, default: '' },
    header_scripts: { type: String, default: '' },
    navbar_phone: { type: String, default: '+91 90222 22448' },
    navbar_phone_show: { type: Boolean, default: true },
    navbar_cta_text: { type: String, default: 'Book Site Visit' },
    navbar_cta_url: { type: String, default: '#book-site-visit' },
    navbar_cta_show: { type: Boolean, default: true },

    // Prestige Project Showcase Defaults
    project_title: { type: String, default: 'Prestige Thane' },
    project_category: { type: String, default: 'PRE-LAUNCH LUXURY TOWNSHIP' },
    project_subtitle: { type: String, default: 'Luxury Living in the Heart of Thane' },
    project_location: { type: String, default: 'Balkum, Kapurbawadi, Thane West, Maharashtra' },
    project_description: {
      type: String,
      default:
        'Experience ultra-premium 2, 3 & 4 BHK residences set across 30+ acres of lush green landscapes. Thoughtfully designed homes with world-class amenities, exceptional connectivity, and the trust of Prestige Group.',
    },
    project_starting_price: { type: String, default: '₹1.59 Cr*' },
    project_configuration: { type: String, default: '2, 3 & 4 BHK' },
    project_possession: { type: String, default: 'Dec 2028' },
    project_rera: { type: String, default: 'MAHARERA: AWAITING RERA' },
    project_developer: { type: String, default: 'BY PRESTIGE GROUP' },
    project_tagline: { type: String, default: 'Live the Prestige Life' },
    project_hero_image: { type: String, default: '/assets/prestige-hero-bg.webp' },

    // Property Advisor Chat Defaults
    advisor_chat_enabled: { type: Boolean, default: true },
    advisor_chat_title: { type: String, default: 'Prestige Thane Desk' },
    advisor_chat_subtitle: { type: String, default: 'Pre-Launch Advisor Online' },
    advisor_chat_tooltip: { type: String, default: 'Chat with Property Advisor' },
    advisor_chat_welcome_title: { type: String, default: 'Welcome to Prestige Thane!' },
    advisor_chat_welcome_msg: {
      type: String,
      default:
        'Prestige Thane is an upcoming pre-launch project. Register your interest to get official updates on launch timing, pricing, and layout updates.',
    },
    advisor_chat_action_1: { type: String, default: 'Request Price Updates' },
    advisor_chat_action_2: { type: String, default: 'Request Master & Floor Plan Layouts' },
    advisor_chat_whatsapp: { type: String, default: '919022222448' },
    advisor_chat_prefill: {
      type: String,
      default: 'Hi, I would like to receive pre-launch early access updates',
    },
  },
  {
    strict: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Ensure hot-reload picks up schema updates
if (mongoose.models && mongoose.models.ThemeSetting) {
  delete mongoose.models.ThemeSetting;
}

const ThemeSetting: Model<IThemeSetting> = mongoose.model<IThemeSetting>(
  'ThemeSetting',
  ThemeSettingSchema
);

export default ThemeSetting;
