import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for AI endpoints
 * 20 requests per 15 minutes per IP
 */
export const aiLimiter = rateLimit({
  windowMs: 900000, // 15 minutes
  max: 20,
  message: {
    error: 'Too Many Requests',
    message: 'AI rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Authentication rate limiter
 * 5 failed attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 900000, // 15 minutes
  max: 5,
  skipSuccessfulRequests: true,
  message: {
    error: 'Too Many Requests',
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Deployment rate limiter
 * 10 deployments per hour per user
 */
export const deployLimiter = rateLimit({
  windowMs: 3600000, // 1 hour
  max: 10,
  message: {
    error: 'Too Many Requests',
    message: 'Deployment rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
