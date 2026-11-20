import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISmtpSetting extends Document {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from_name: string;
  from_email: string;
  admin_email: string;
  notify_on_lead: boolean;
  notify_on_contact: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const SmtpSettingSchema = new Schema<ISmtpSetting>(
  {
    enabled: { type: Boolean, default: false },
    host: { type: String, default: '' },
    port: { type: Number, default: 587 },
    secure: { type: Boolean, default: false },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
    from_name: { type: String, default: 'Prestige Thane' },
    from_email: { type: String, default: '' },
    admin_email: { type: String, default: '' },
    notify_on_lead: { type: Boolean, default: true },
    notify_on_contact: { type: Boolean, default: true },
  },
  {
    strict: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (mongoose.models && mongoose.models.SmtpSetting) {
  delete mongoose.models.SmtpSetting;
}

const SmtpSetting: Model<ISmtpSetting> =
  mongoose.models.SmtpSetting ||
  mongoose.model<ISmtpSetting>('SmtpSetting', SmtpSettingSchema);

export default SmtpSetting;
