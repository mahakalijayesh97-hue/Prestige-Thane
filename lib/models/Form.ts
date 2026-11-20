import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IFormField {
  id: string;
  name: string;
  label: string;
  type: 'tel' | 'email' | 'text' | 'pills' | 'select' | 'textarea';
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
  };
  sort_order: number;
}

export interface IForm extends Document {
  title: string;
  slug: string;
  description: string;
  is_active: boolean;
  button_1_text: string;
  button_2_text: string;
  whatsapp_number: string;
  partner_name: string;
  disclaimer: string;
  fields: IFormField[];
  // Email Notifications Settings
  notify_admin: boolean;
  admin_notification_email?: string;
  admin_email_subject?: string;
  auto_reply_user: boolean;
  user_email_subject?: string;
  user_email_message?: string;
  created_at: Date;
  updated_at: Date;
}

const FormFieldSchema = new Schema<IFormField>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['tel', 'email', 'text', 'pills', 'select', 'textarea'],
      default: 'text',
    },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
    validation: {
      pattern: { type: String, default: '' },
      minLength: { type: Number },
      maxLength: { type: Number },
      errorMessage: { type: String, default: '' },
    },
    sort_order: { type: Number, default: 0 },
  },
  { _id: false }
);

const FormSchema = new Schema<IForm>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    is_active: { type: Boolean, default: true },
    button_1_text: { type: String, default: 'Option 1 • Instant Details' },
    button_2_text: { type: String, default: 'Option 2 • Guided Tour' },
    whatsapp_number: { type: String, default: '919022222448' },
    partner_name: { type: String, default: 'First Team' },
    disclaimer: {
      type: String,
      default: '🔒 100% Privacy Protected • Zero spam • Official pre-launch project updates only',
    },
    fields: { type: [FormFieldSchema], default: [] },
    notify_admin: { type: Boolean, default: true },
    admin_notification_email: { type: String, default: '' },
    admin_email_subject: { type: String, default: '' },
    auto_reply_user: { type: Boolean, default: false },
    user_email_subject: { type: String, default: 'Thank you for your enquiry - Prestige Thane' },
    user_email_message: {
      type: String,
      default:
        'Thank you for reaching out to us. We have received your request and our project specialist will get in touch with you shortly with full project details.',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (mongoose.models && mongoose.models.Form) {
  delete mongoose.models.Form;
}

export const DEFAULT_EARLY_ACCESS_FORM = {
  title: 'Pre-Launch Enquiry Modal',
  slug: 'early-access-modal',
  description: 'Official pre-launch updates, floor plans, and pricing will be shared directly.',
  is_active: true,
  button_1_text: 'Option 1 • Instant Details',
  button_2_text: 'Option 2 • Guided Tour',
  whatsapp_number: '919022222448',
  partner_name: 'First Team',
  disclaimer: '🔒 100% Privacy Protected • Zero spam • Official pre-launch project updates only',
  notify_admin: true,
  admin_notification_email: '',
  admin_email_subject: '',
  auto_reply_user: true,
  user_email_subject: 'Thank you for registering your interest in Prestige Thane',
  user_email_message:
    'Thank you for your interest! We have received your details. Our Prestige project specialist will connect with you shortly with the official brochure, price sheet, and floor plans.',
  fields: [
    {
      id: 'field_phone',
      name: 'phone',
      label: 'Mobile Number',
      type: 'tel' as const,
      placeholder: 'Enter 10-digit mobile number',
      required: true,
      options: [],
      validation: {
        pattern: '^[0-9]{10}$',
        minLength: 10,
        maxLength: 10,
        errorMessage: 'Please enter a valid 10-digit mobile number.',
      },
      sort_order: 0,
    },
    {
      id: 'field_email',
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      placeholder: 'your.email@example.com',
      required: true,
      options: [],
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        errorMessage: 'Please enter a valid email address.',
      },
      sort_order: 1,
    },
    {
      id: 'field_config',
      name: 'configuration',
      label: 'Configuration',
      type: 'pills' as const,
      placeholder: '',
      required: true,
      options: ['2 BHK', '3 BHK', '4 BHK', 'All Units'],
      validation: {
        errorMessage: 'Please select a configuration.',
      },
      sort_order: 2,
    },
  ],
};

const Form: Model<IForm> = mongoose.model<IForm>('Form', FormSchema);

export default Form;
