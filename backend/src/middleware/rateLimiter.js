// backend/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Generic rate limiter – can be customized per route
const createLimiter = (options) => {
  const defaults = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
  };
  return rateLimit({ ...defaults, ...options });
};

// Export common limiters
module.exports = {
  generalLimiter: createLimiter({}),
  authLimiter: createLimiter({ windowMs: 10 * 60 * 1000, max: 20 }), // stricter for auth endpoints
  geminiLimiter: createLimiter({ windowMs: 1 * 60 * 1000, max: 30 }), // protect Gemini API
};
