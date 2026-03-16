import mongoose, { Document, Schema } from 'mongoose';

interface MedicineEntry {
  medicineId: mongoose.Types.ObjectId;
  price: number;
  inStock: boolean;
}

export interface IPharmacy extends Document {
  name: string;
  address: string;
  phone?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  workingHours: Record<string, { open: string; close: string; isOpen: boolean }>;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  medicines: MedicineEntry[];
  isActive: boolean;
  createdAt: Date;
}

const pharmacySchema = new Schema<IPharmacy>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [49.8671, 40.4093],
      },
    },
    workingHours: { type: Schema.Types.Mixed, default: {} },
    isOpen: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    medicines: [
      {
        medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine' },
        price: { type: Number, required: true, min: 0 },
        inStock: { type: Boolean, default: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

pharmacySchema.index({ location: '2dsphere' });
pharmacySchema.index({ name: 'text', address: 'text' });

export default mongoose.model<IPharmacy>('Pharmacy', pharmacySchema);
