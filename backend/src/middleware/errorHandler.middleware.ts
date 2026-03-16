import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: `Yol tapılmadı: ${req.originalUrl}` });
};

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server xətası';

  // Mongoose duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} artıq mövcuddur`;
    statusCode = 409;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    message = Object.values(err.errors)[0]?.message || 'Validasiya xətası';
    statusCode = 400;
  }

  // Mongoose cast error
  if (err instanceof mongoose.Error.CastError) {
    message = 'Etibarsız ID formatı';
    statusCode = 400;
  }

  // JWT errors
  if (err instanceof JsonWebTokenError) {
    message = 'Etibarsız token';
    statusCode = 401;
  }

  if (err instanceof TokenExpiredError) {
    message = 'Tokenin vaxtı bitib';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
