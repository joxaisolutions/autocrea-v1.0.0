import { Request, Response, NextFunction } from 'express';
import logger, { logRequest } from '../utils/logger';

/**
 * Request logging middleware
 * Logs all incoming HTTP requests with timing information
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log request
  logRequest(req.method, req.path, req.userId);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, path, userId } = req;
    const { statusCode } = res;

    const logMessage = `${method} ${path} ${statusCode} ${duration}ms${userId ? ` - User: ${userId}` : ''}`;

    if (statusCode >= 500) {
      logger.error(logMessage);
    } else if (statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.http(logMessage);
    }
  });

  next();
};

/**
 * Performance monitoring middleware
 * Tracks slow requests and logs warnings
 */
export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const SLOW_REQUEST_THRESHOLD = 1000; // 1 second

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    if (duration > SLOW_REQUEST_THRESHOLD) {
      logger.warn(
        `Slow request detected: ${req.method} ${req.path} took ${duration}ms`
      );
    }
  });

  next();
};

/**
 * Error logging middleware
 * Logs detailed error information
 */
export const errorLogger = (
  err: Error,
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.error(`Error in ${req.method} ${req.path}`, {
    error: err.message,
    stack: err.stack,
    userId: req.userId,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  next(err);
};
