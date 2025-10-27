import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston about our colors
winston.addColors(colors);

// Define format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console(),

  // File transport for errors
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),

  // File transport for all logs
  new winston.transports.File({ filename: 'logs/combined.log' }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
});

export default logger;

// Helper functions for common log patterns
export const logRequest = (method: string, url: string, userId?: string) => {
  logger.http(`${method} ${url}${userId ? ` - User: ${userId}` : ''}`);
};

export const logError = (error: Error, context?: string) => {
  logger.error(`${context ? `[${context}] ` : ''}${error.message}`, {
    stack: error.stack,
  });
};

export const logAIRequest = (
  type: string,
  userId: string,
  tokensUsed: number
) => {
  logger.info(
    `AI Request: ${type} - User: ${userId} - Tokens: ${tokensUsed}`
  );
};

export const logDeployment = (
  provider: string,
  projectId: string,
  status: string
) => {
  logger.info(
    `Deployment: ${provider} - Project: ${projectId} - Status: ${status}`
  );
};
