import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';

import {
  RATE_LIMIT_AUTH_WINDOW_MS,
  RATE_LIMIT_AUTH_MAX,
  RATE_LIMIT_API_WINDOW_MS,
  RATE_LIMIT_API_MAX,
} from './config/constants';
import env from './config/env';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import pharmacyRoutes from './routes/pharmacies.routes';
import medicineRoutes from './routes/medicines.routes';
import reservationRoutes from './routes/reservations.routes';
import chatRoutes from './routes/chat.routes';
import adminRoutes from './routes/admin.routes';
import reminderRoutes from './routes/reminders.routes';
import { notFound, errorHandler } from './middleware/errorHandler.middleware';

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new SocketIOServer(server, {
  cors: { origin: env.FRONTEND_URL, credentials: true },
});

io.on('connection', (socket) => {
  socket.on('join', (conversationId: string) => socket.join(conversationId));
  socket.on('message', (data: { conversationId: string; content: string }) => {
    io.to(data.conversationId).emit('message', data);
  });
});

// Security
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: RATE_LIMIT_AUTH_WINDOW_MS, max: RATE_LIMIT_AUTH_MAX, message: 'Çox sayda sorğu. Biraz gözləyin.' }));
app.use('/api', rateLimit({ windowMs: RATE_LIMIT_API_WINDOW_MS, max: RATE_LIMIT_API_MAX }));

// Logging
if (env.isDev) app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reminders', reminderRoutes);

// ✅ ROOT ROUTE
app.get('/', (_req, res) => {
  res.json({ 
    success: true,
    message: 'MedSearch API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', env: env.NODE_ENV }));

// Error handling
app.use(notFound);
app.use(errorHandler);

export { app, server, io };
