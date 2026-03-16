import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  pharmacyId: mongoose.Types.ObjectId;
  medicineId: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reservationDate: Date;
  notes?: string;
  createdAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, default: 1, min: 1 },
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    reservationDate: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

reservationSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IReservation>('Reservation', reservationSchema);
