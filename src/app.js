// src/app.js
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';
import AppError from './utils/AppError.js';
import rateLimit from './middlewares/rateLimit.middleware.js';

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Rate limiting - 100 requests per 15 minutes per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Stricter rate limit for auth routes
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many authentication attempts, please try again later.' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Implement CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// 2) ROUTES
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'VaultFlow API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      finance: '/api/finance',
      users: '/api/users',
    }
  });
});

app.use('/api', routes);

// 3) UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4) GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export default app;
