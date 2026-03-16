import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  totalSearches: number;
  newUsers: number;
  totalReservations: number;
  popularMedicines: { name: string; count: number }[];
  popularPharmacies: { name: string; count: number }[];
  createdAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    date: { type: Date, required: true, unique: true },
    totalSearches: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    totalReservations: { type: Number, default: 0 },
    popularMedicines: [{ name: String, count: Number }],
    popularPharmacies: [{ name: String, count: Number }],
  },
  { timestamps: true }
);

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);
