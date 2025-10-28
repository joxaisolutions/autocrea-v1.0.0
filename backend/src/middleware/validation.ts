import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Validation middleware for project creation/update
 */
export const validateProject = (req: Request, _res: Response, next: NextFunction) => {
  const { name, framework } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new AppError('Project name is required', 400);
  }

  if (name.length > 100) {
    throw new AppError('Project name must be less than 100 characters', 400);
  }

  const validFrameworks = ['react', 'nextjs', 'vue', 'html', 'node'];
  if (!framework || !validFrameworks.includes(framework)) {
    throw new AppError(`Framework must be one of: ${validFrameworks.join(', ')}`, 400);
  }

  next();
};

/**
 * Validation middleware for file operations
 */
export const validateFile = (req: Request, _res: Response, next: NextFunction) => {
  const { path, content } = req.body;

  if (!path || typeof path !== 'string' || path.trim().length === 0) {
    throw new AppError('File path is required', 400);
  }

  // Validate path doesn't contain dangerous characters
  if (path.includes('..') || path.startsWith('/')) {
    throw new AppError('Invalid file path', 400);
  }

  if (!content || typeof content !== 'string') {
    throw new AppError('File content is required', 400);
  }

  // Limit file size to 10MB
  const contentSize = Buffer.byteLength(content, 'utf8');
  if (contentSize > 10 * 1024 * 1024) {
    throw new AppError('File size cannot exceed 10MB', 400);
  }

  next();
};

/**
 * Validation middleware for AI requests
 */
export const validateAIRequest = (req: Request, _res: Response, next: NextFunction) => {
  const { type, prompt } = req.body;

  const validTypes = ['generate', 'explain', 'fix', 'refactor', 'complete'];
  if (!type || !validTypes.includes(type)) {
    throw new AppError(`Request type must be one of: ${validTypes.join(', ')}`, 400);
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new AppError('Prompt is required', 400);
  }

  if (prompt.length > 5000) {
    throw new AppError('Prompt must be less than 5000 characters', 400);
  }

  next();
};

/**
 * Validation middleware for deployment
 */
export const validateDeployment = (req: Request, _res: Response, next: NextFunction) => {
  const { provider, environment } = req.body;

  const validProviders = ['vercel', 'netlify', 'railway'];
  if (!provider || !validProviders.includes(provider)) {
    throw new AppError(`Provider must be one of: ${validProviders.join(', ')}`, 400);
  }

  const validEnvironments = ['production', 'preview', 'development'];
  if (!environment || !validEnvironments.includes(environment)) {
    throw new AppError(`Environment must be one of: ${validEnvironments.join(', ')}`, 400);
  }

  next();
};

/**
 * Validation middleware for code execution
 */
export const validateCodeExecution = (req: Request, _res: Response, next: NextFunction) => {
  const { code, language } = req.body;

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    throw new AppError('Code is required', 400);
  }

  const validLanguages = ['javascript', 'typescript', 'python', 'html', 'css'];
  if (!language || !validLanguages.includes(language)) {
    throw new AppError(`Language must be one of: ${validLanguages.join(', ')}`, 400);
  }

  // Limit code size to 1MB
  const codeSize = Buffer.byteLength(code, 'utf8');
  if (codeSize > 1024 * 1024) {
    throw new AppError('Code size cannot exceed 1MB', 400);
  }

  next();
};
