import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/backend';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

/**
 * Authentication middleware using Clerk
 * Verifies the Bearer token in Authorization header
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Clerk
    try {
      const session = await clerkClient.sessions.verifySession(token, {
        jwtKey: process.env.CLERK_SECRET_KEY,
      });

      if (!session) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        });
      }

      // Get user information
      const user = await clerkClient.users.getUser(session.userId);

      // Attach user info to request
      req.userId = user.id;
      req.user = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      };

      next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token, continue without user info
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const session = await clerkClient.sessions.verifySession(token, {
        jwtKey: process.env.CLERK_SECRET_KEY,
      });

      if (session) {
        const user = await clerkClient.users.getUser(session.userId);
        req.userId = user.id;
        req.user = {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        };
      }
    } catch (verifyError) {
      // Invalid token, but we don't fail the request
      console.warn('Optional auth - invalid token:', verifyError);
    }

    next();
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    next(); // Don't fail on optional auth errors
  }
};
