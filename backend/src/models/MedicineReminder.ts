import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicineReminder extends Document {
  userId: mongoose.Types.ObjectId;
  medicineName: string;
  dosage: string;
  frequency: 'daily' | 'weekly';
  times: string[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  chronicDisease?: string;
  reminderType: 'app' | 'sms' | 'email';
  createdAt: Date;
}

const reminderSchema = new Schema<IMedicineReminder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    times: [{ type: String }],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    chronicDisease: { type: String },
    reminderType: { type: String, enum: ['app', 'sms', 'email'], default: 'app' },
  },
  { timestamps: true }
);

export default mongoose.model<IMedicineReminder>('MedicineReminder', reminderSchema);
