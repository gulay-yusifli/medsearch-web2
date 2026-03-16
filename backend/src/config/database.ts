import mongoose from 'mongoose';
import env from './env';

const connectDB = async (retries = 5): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB bağlandı: ${conn.connection.host}`);
  } catch (error) {
    if (retries > 0) {
      console.log(`MongoDB bağlantı xətası. ${retries} cəhd qalır...`);
      await new Promise((r) => setTimeout(r, 3000));
      return connectDB(retries - 1);
    }
    console.error('MongoDB bağlantısı uğursuz oldu:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB bağlantısı kəsildi. Yenidən bağlanılır...');
  setTimeout(() => connectDB(), 3000);
});

export default connectDB;
