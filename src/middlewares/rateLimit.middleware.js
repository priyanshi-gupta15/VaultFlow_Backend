// src/middlewares/rateLimit.middleware.js

// Simple in-memory rate limiter (no external deps needed)
const requestCounts = new Map();

const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later.' } = {}) => {
  // Clean up expired entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requestCounts.entries()) {
      if (now - data.startTime > windowMs) {
        requestCounts.delete(key);
      }
    }
  }, windowMs);

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 1, startTime: now });
      return next();
    }

    const data = requestCounts.get(key);

    // Reset window if expired
    if (now - data.startTime > windowMs) {
      requestCounts.set(key, { count: 1, startTime: now });
      return next();
    }

    data.count++;

    if (data.count > max) {
      return res.status(429).json({
        status: 'fail',
        message,
      });
    }

    next();
  };
};

export default rateLimit;
