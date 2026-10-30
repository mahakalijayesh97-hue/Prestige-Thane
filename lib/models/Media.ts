import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IMedia extends Document {
  name: string;
  url: string;
  type: string;
  size?: number | null;
  created_at: Date;
  updated_at: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: 'image' },
    size: { type: Number, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (mongoose.models && mongoose.models.Media) {
  delete mongoose.models.Media;
}

const Media: Model<IMedia> = mongoose.model<IMedia>('Media', MediaSchema);

export default Media;

