import connectDB from './config/database';
import { server } from './server';
import env from './config/env';
import User from './models/User';

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: env.ADMIN_EMAIL });
    if (!existing) {
      await User.create({
        name: 'Admin',
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`✅ Admin hesabı yaradıldı: ${env.ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error('Admin seed xətası:', err);
  }
};

const start = async () => {
  await connectDB();
  await seedAdmin();
  server.listen(env.PORT, () => {
    console.log(`🚀 Server port ${env.PORT} üzərində işləyir [${env.NODE_ENV}]`);
  });
};

start().catch(console.error);
