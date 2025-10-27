import request from 'supertest';
import express from 'express';
import aiRoutes from '../../routes/ai';
import projectRoutes from '../../routes/projects';
import deployRoutes from '../../routes/deploy';
import { authenticateUser } from '../../middleware/auth';

// Mock middleware
jest.mock('../../middleware/auth');
const mockedAuth = authenticateUser as jest.MockedFunction<
  typeof authenticateUser
>;

// Mock services
jest.mock('../../services/aiService');
jest.mock('../../services/deploymentService');

import * as aiService from '../../services/aiService';

describe('API Routes Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock authentication middleware
    mockedAuth.mockImplementation((req: any, res, next) => {
      req.userId = 'test_user_123';
      req.user = {
        id: 'test_user_123',
        email: 'test@example.com',
        name: 'Test User',
      };
      next();
    });

    // Mount routes
    app.use('/api/ai', aiRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/deploy', deployRoutes);
  });

  describe('AI Routes', () => {
    describe('POST /api/ai/generate', () => {
      it('should generate code successfully', async () => {
        const mockResponse = {
          response: 'Generated code explanation',
          code: 'function hello() { console.log("Hello"); }',
          tokensUsed: 150,
        };

        jest
          .spyOn(aiService, 'generateCode')
          .mockResolvedValue(mockResponse);

        const response = await request(app)
          .post('/api/ai/generate')
          .send({
            prompt: 'Create a hello function',
            language: 'javascript',
          })
          .expect(200);

        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('tokensUsed');
        expect(response.body.tokensUsed).toBe(150);
      });

      it('should return 400 for missing prompt', async () => {
        const response = await request(app)
          .post('/api/ai/generate')
          .send({
            language: 'javascript',
          })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });

      it('should handle AI service errors', async () => {
        jest
          .spyOn(aiService, 'generateCode')
          .mockRejectedValue(new Error('AI service error'));

        const response = await request(app)
          .post('/api/ai/generate')
          .send({
            prompt: 'Create a function',
          })
          .expect(500);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('POST /api/ai/explain', () => {
      it('should explain code successfully', async () => {
        const mockResponse = {
          response: 'This code does...',
          tokensUsed: 100,
        };

        jest
          .spyOn(aiService, 'explainCode')
          .mockResolvedValue(mockResponse);

        const response = await request(app)
          .post('/api/ai/explain')
          .send({
            code: 'const x = 5;',
            language: 'javascript',
          })
          .expect(200);

        expect(response.body).toHaveProperty('response');
        expect(response.body.response).toBe('This code does...');
      });

      it('should return 400 for missing code', async () => {
        await request(app)
          .post('/api/ai/explain')
          .send({})
          .expect(400);
      });
    });

    describe('POST /api/ai/fix', () => {
      it('should fix code errors', async () => {
        const mockResponse = {
          response: 'Fixed explanation',
          code: 'const x = 5; console.log(x);',
          tokensUsed: 120,
        };

        jest.spyOn(aiService, 'fixCode').mockResolvedValue(mockResponse);

        const response = await request(app)
          .post('/api/ai/fix')
          .send({
            code: 'const x = 5; console.log(y);',
            error: 'ReferenceError: y is not defined',
            language: 'javascript',
          })
          .expect(200);

        expect(response.body).toHaveProperty('code');
        expect(response.body.code).toContain('console.log(x)');
      });

      it('should return 400 for missing error message', async () => {
        await request(app)
          .post('/api/ai/fix')
          .send({
            code: 'const x = 5;',
          })
          .expect(400);
      });
    });

    describe('POST /api/ai/refactor', () => {
      it('should refactor code', async () => {
        const mockResponse = {
          response: 'Refactored with improvements',
          code: 'const add = (a, b) => a + b;',
          tokensUsed: 110,
        };

        jest
          .spyOn(aiService, 'refactorCode')
          .mockResolvedValue(mockResponse);

        const response = await request(app)
          .post('/api/ai/refactor')
          .send({
            code: 'function add(a, b) { return a + b; }',
            instructions: 'Convert to arrow function',
            language: 'javascript',
          })
          .expect(200);

        expect(response.body.code).toContain('=>');
      });
    });

    describe('POST /api/ai/complete', () => {
      it('should provide code completion', async () => {
        const mockResponse = {
          response: 'return items.length;',
          code: 'return items.length;',
          tokensUsed: 50,
        };

        jest
          .spyOn(aiService, 'completeCode')
          .mockResolvedValue(mockResponse);

        const response = await request(app)
          .post('/api/ai/complete')
          .send({
            code: 'function getCount(items) {',
            cursorPosition: 26,
            language: 'javascript',
          })
          .expect(200);

        expect(response.body).toHaveProperty('code');
      });
    });

    describe('GET /api/ai/history', () => {
      it('should return AI request history', async () => {
        const response = await request(app)
          .get('/api/ai/history')
          .expect(200);

        expect(response.body).toHaveProperty('requests');
        expect(Array.isArray(response.body.requests)).toBe(true);
      });

      it('should support pagination', async () => {
        const response = await request(app)
          .get('/api/ai/history')
          .query({ limit: 10, offset: 0 })
          .expect(200);

        expect(response.body.requests.length).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('Project Routes', () => {
    describe('GET /api/projects', () => {
      it('should return user projects', async () => {
        const response = await request(app)
          .get('/api/projects')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('POST /api/projects', () => {
      it('should create a new project', async () => {
        const response = await request(app)
          .post('/api/projects')
          .send({
            name: 'Test Project',
            framework: 'nextjs',
            description: 'A test project',
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Test Project');
      });

      it('should return 400 for invalid project data', async () => {
        await request(app)
          .post('/api/projects')
          .send({
            name: '', // Empty name
          })
          .expect(400);
      });
    });

    describe('GET /api/projects/:id', () => {
      it('should return a specific project', async () => {
        const response = await request(app)
          .get('/api/projects/proj_123')
          .expect(200);

        expect(response.body).toHaveProperty('id');
      });

      it('should return 404 for non-existent project', async () => {
        await request(app)
          .get('/api/projects/nonexistent')
          .expect(404);
      });
    });

    describe('PUT /api/projects/:id', () => {
      it('should update a project', async () => {
        const response = await request(app)
          .put('/api/projects/proj_123')
          .send({
            name: 'Updated Project Name',
          })
          .expect(200);

        expect(response.body.name).toBe('Updated Project Name');
      });
    });

    describe('DELETE /api/projects/:id', () => {
      it('should delete a project', async () => {
        await request(app)
          .delete('/api/projects/proj_123')
          .expect(200);
      });
    });
  });

  describe('Deployment Routes', () => {
    describe('POST /api/deploy', () => {
      it('should initiate deployment', async () => {
        const response = await request(app)
          .post('/api/deploy')
          .send({
            projectId: 'proj_123',
            provider: 'vercel',
            environment: 'production',
          })
          .expect(201);

        expect(response.body).toHaveProperty('deploymentId');
      });

      it('should return 400 for invalid provider', async () => {
        await request(app)
          .post('/api/deploy')
          .send({
            projectId: 'proj_123',
            provider: 'invalid',
          })
          .expect(400);
      });
    });

    describe('GET /api/deploy/:projectId', () => {
      it('should return project deployments', async () => {
        const response = await request(app)
          .get('/api/deploy/proj_123')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all routes', async () => {
      // Temporarily remove auth mock
      mockedAuth.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ error: 'Unauthorized' });
      });

      await request(app)
        .get('/api/projects')
        .expect(401);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', async () => {
      await request(app)
        .get('/api/unknown')
        .expect(404);
    });

    it('should handle malformed JSON', async () => {
      await request(app)
        .post('/api/projects')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });
  });
});
