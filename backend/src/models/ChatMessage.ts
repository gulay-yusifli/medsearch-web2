import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  conversationId: string;
  isRead: boolean;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'assistant', 'admin'], required: true },
    content: { type: String, required: true },
    conversationId: { type: String, required: true, default: 'ai-consultation' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatMessageSchema.index({ userId: 1, conversationId: 1 });

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
