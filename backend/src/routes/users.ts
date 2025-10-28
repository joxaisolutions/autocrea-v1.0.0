import { Router, Request, Response } from 'express';
import { authenticateUser } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Apply authentication to all user routes
router.use(authenticateUser);

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    // TODO: Implement Convex query to fetch user by clerkId
    const user = {
      _id: `user_${Date.now()}`,
      clerkId: userId,
      email: req.user?.email || 'user@example.com',
      name: req.user?.name || 'User',
      avatarUrl: null,
      plan: 'free-trial',
      aiRequestsUsed: 25,
      storageUsed: 50 * 1024 * 1024, // 50MB
      projectsCount: 2,
      preferences: {
        editorTheme: 'vs-dark',
        fontSize: 14,
        autoSave: true,
        language: 'en',
      },
      createdAt: Date.now() - 86400000 * 30, // 30 days ago
      updatedAt: Date.now(),
      lastLoginAt: Date.now(),
    };

    res.json({
      success: true,
      data: user,
    });
  })
);

/**
 * PUT /api/users/me
 * Update current user profile
 */
router.put(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { name, avatarUrl, preferences } = req.body;

    // TODO: Implement Convex mutation to update user
    const updatedUser = {
      _id: `user_${Date.now()}`,
      clerkId: userId,
      email: req.user?.email || 'user@example.com',
      name: name || req.user?.name || 'User',
      avatarUrl: avatarUrl || null,
      plan: 'free-trial',
      aiRequestsUsed: 25,
      storageUsed: 50 * 1024 * 1024,
      projectsCount: 2,
      preferences: preferences || {
        editorTheme: 'vs-dark',
        fontSize: 14,
        autoSave: true,
        language: 'en',
      },
      updatedAt: Date.now(),
    };

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  })
);

/**
 * GET /api/users/me/usage
 * Get current user's usage statistics
 */
router.get(
  '/me/usage',
  asyncHandler(async (_req: Request, res: Response) => {
    // TODO: Implement Convex queries to calculate usage
    const usage = {
      plan: 'free-trial',
      limits: {
        maxProjects: 3,
        maxAIRequests: 100,
        maxStorage: 500 * 1024 * 1024, // 500MB
      },
      current: {
        projects: 2,
        aiRequests: 25,
        storage: 50 * 1024 * 1024, // 50MB
      },
      percentage: {
        projects: 66.67,
        aiRequests: 25,
        storage: 10,
      },
      resetDate: Date.now() + 86400000 * 15, // 15 days from now
    };

    res.json({
      success: true,
      data: usage,
    });
  })
);

/**
 * PUT /api/users/me/preferences
 * Update user preferences
 */
router.put(
  '/me/preferences',
  asyncHandler(async (req: Request, res: Response) => {
    const { editorTheme, fontSize, autoSave, language } = req.body;

    // TODO: Implement Convex mutation to update preferences
    const preferences = {
      editorTheme: editorTheme || 'vs-dark',
      fontSize: fontSize || 14,
      autoSave: autoSave !== undefined ? autoSave : true,
      language: language || 'en',
    };

    res.json({
      success: true,
      data: preferences,
      message: 'Preferences updated successfully',
    });
  })
);

/**
 * POST /api/users/me/sync
 * Sync user data from Clerk
 */
router.post(
  '/me/sync',
  asyncHandler(async (_req: Request, res: Response) => {
    // TODO: Fetch latest user data from Clerk
    // TODO: Update Convex database with synced data

    res.json({
      success: true,
      message: 'User data synced successfully',
    });
  })
);

/**
 * DELETE /api/users/me
 * Delete user account (soft delete)
 */
router.delete(
  '/me',
  asyncHandler(async (_req: Request, res: Response) => {
    // TODO: Soft delete user in Convex
    // TODO: Archive all projects
    // TODO: Schedule data deletion after 30 days

    res.json({
      success: true,
      message: 'Account deletion initiated. Data will be permanently deleted in 30 days.',
    });
  })
);

export default router;
