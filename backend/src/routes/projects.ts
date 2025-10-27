import { Router, Request, Response } from 'express';
import { authenticateUser } from '@/middleware/auth';
import { validateProject } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import { AppError } from '@/middleware/errorHandler';

const router = Router();

// Apply authentication to all project routes
router.use(authenticateUser);

/**
 * GET /api/projects
 * Get all projects for the authenticated user
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;

    // TODO: Implement Convex query to fetch projects
    // For now, return mock data
    const projects = [
      {
        _id: '1',
        name: 'My React App',
        description: 'A sample React application',
        userId,
        framework: 'react',
        status: 'active',
        isPublic: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    res.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  })
);

/**
 * GET /api/projects/:id
 * Get a specific project by ID
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;

    // TODO: Implement Convex query to fetch project by ID
    // Verify project belongs to user
    const project = {
      _id: id,
      name: 'My React App',
      description: 'A sample React application',
      userId,
      framework: 'react',
      status: 'active',
      isPublic: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      success: true,
      data: project,
    });
  })
);

/**
 * POST /api/projects
 * Create a new project
 */
router.post(
  '/',
  validateProject,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { name, description, framework, template, isPublic } = req.body;

    // TODO: Check user's plan limits
    // TODO: Implement Convex mutation to create project
    const newProject = {
      _id: `proj_${Date.now()}`,
      name,
      description: description || '',
      userId,
      framework,
      template: template || null,
      status: 'active',
      isPublic: isPublic || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    res.status(201).json({
      success: true,
      data: newProject,
      message: 'Project created successfully',
    });
  })
);

/**
 * PUT /api/projects/:id
 * Update a project
 */
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;
    const { name, description, isPublic, tags, status } = req.body;

    // TODO: Implement Convex mutation to update project
    // Verify project belongs to user
    const updatedProject = {
      _id: id,
      name: name || 'My React App',
      description: description || '',
      userId,
      framework: 'react',
      status: status || 'active',
      isPublic: isPublic !== undefined ? isPublic : false,
      tags: tags || [],
      updatedAt: Date.now(),
    };

    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully',
    });
  })
);

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;

    // TODO: Implement Convex mutation to delete project
    // Verify project belongs to user
    // Also delete all associated files

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  })
);

export default router;
