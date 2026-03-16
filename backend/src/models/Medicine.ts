import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  genericName: string;
  category: string;
  description: string;
  activeIngredient: string;
  manufacturer: string;
  requiresPrescription: boolean;
  imageUrl?: string;
  createdAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: 'Ümumi' },
    description: { type: String, default: '' },
    activeIngredient: { type: String, default: '' },
    manufacturer: { type: String, default: '' },
    requiresPrescription: { type: Boolean, default: false },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

medicineSchema.index({ name: 'text', genericName: 'text', activeIngredient: 'text' });

export default mongoose.model<IMedicine>('Medicine', medicineSchema);
