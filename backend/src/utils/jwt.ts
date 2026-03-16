import jwt from 'jsonwebtoken';
import env from '../config/env';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string): { userId: string; role: string } => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId, type: 'refresh' }, env.JWT_SECRET, { expiresIn: '30d' });
};
