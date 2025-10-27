import axios from 'axios';
import {
  deployToVercel,
  deployToNetlify,
  deployToRailway,
  getDeploymentStatus,
  cancelDeployment,
} from '../../services/deploymentService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Deployment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deployToVercel', () => {
    it('should successfully deploy to Vercel', async () => {
      const mockResponse = {
        data: {
          id: 'dpl_123',
          url: 'https://my-app-abc123.vercel.app',
          builds: [{ id: 'bld_123' }],
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const config = {
        projectName: 'test-project',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
        buildCommand: 'npm run build',
        envVars: [{ key: 'API_URL', value: 'https://api.example.com' }],
      };

      const result = await deployToVercel(config);

      expect(result.success).toBe(true);
      expect(result.deploymentId).toBe('dpl_123');
      expect(result.url).toBe('https://my-app-abc123.vercel.app');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.vercel.com/v13/deployments',
        expect.objectContaining({
          name: 'test-project',
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        })
      );
    });

    it('should handle Vercel API errors', async () => {
      mockedAxios.post.mockRejectedValue({
        response: {
          data: { error: { message: 'Invalid token' } },
        },
      });

      const config = {
        projectName: 'test-project',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
      };

      const result = await deployToVercel(config);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid token');
    });

    it('should include environment variables in deployment', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { id: 'dpl_123', url: 'https://app.vercel.app' },
      });

      const config = {
        projectName: 'test-project',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
        envVars: [
          { key: 'NODE_ENV', value: 'production' },
          { key: 'API_KEY', value: 'secret' },
        ],
      };

      await deployToVercel(config);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          env: config.envVars,
        }),
        expect.any(Object)
      );
    });
  });

  describe('deployToNetlify', () => {
    it('should successfully deploy to Netlify', async () => {
      // Mock site creation
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          id: 'site_123',
          name: 'test-site',
        },
      });

      // Mock build trigger
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          id: 'build_456',
          deploy_id: 'deploy_789',
        },
      });

      // Mock build status
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          state: 'ready',
          ssl_url: 'https://test-site.netlify.app',
        },
      });

      const config = {
        projectName: 'test-site',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
        buildCommand: 'npm run build',
        publishDir: 'dist',
      };

      const result = await deployToNetlify(config);

      expect(result.success).toBe(true);
      expect(result.url).toContain('netlify.app');
    });

    it('should configure build settings correctly', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { id: 'site_123' },
      });

      const config = {
        projectName: 'test-site',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
        buildCommand: 'npm run build',
        publishDir: 'build',
        envVars: [{ key: 'REACT_APP_API', value: 'https://api.com' }],
      };

      await deployToNetlify(config);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('netlify.com'),
        expect.objectContaining({
          build_settings: expect.objectContaining({
            cmd: 'npm run build',
            dir: 'build',
          }),
        }),
        expect.any(Object)
      );
    });
  });

  describe('deployToRailway', () => {
    it('should successfully deploy to Railway', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            deployProject: {
              id: 'railway_123',
              url: 'https://my-app.railway.app',
            },
          },
        },
      });

      const config = {
        projectName: 'test-railway',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
        envVars: [{ key: 'DATABASE_URL', value: 'postgresql://...' }],
      };

      const result = await deployToRailway(config);

      expect(result.success).toBe(true);
      expect(result.deploymentId).toBe('railway_123');
    });

    it('should use GraphQL API correctly', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            deployProject: {
              id: 'railway_123',
              url: 'https://app.railway.app',
            },
          },
        },
      });

      const config = {
        projectName: 'test',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
      };

      await deployToRailway(config);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://backboard.railway.app/graphql/v2',
        expect.objectContaining({
          query: expect.stringContaining('mutation'),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        })
      );
    });
  });

  describe('getDeploymentStatus', () => {
    it('should get Vercel deployment status', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          readyState: 'READY',
          state: 'READY',
        },
      });

      const status = await getDeploymentStatus('vercel', 'dpl_123');

      expect(status).toBe('success');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('vercel.com'),
        expect.any(Object)
      );
    });

    it('should get Netlify deployment status', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          state: 'ready',
        },
      });

      const status = await getDeploymentStatus('netlify', 'deploy_123');

      expect(status).toBe('success');
    });

    it('should handle building state', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          state: 'BUILDING',
        },
      });

      const status = await getDeploymentStatus('vercel', 'dpl_123');

      expect(status).toBe('building');
    });

    it('should handle failed deployments', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          state: 'ERROR',
        },
      });

      const status = await getDeploymentStatus('vercel', 'dpl_123');

      expect(status).toBe('failed');
    });
  });

  describe('cancelDeployment', () => {
    it('should cancel Vercel deployment', async () => {
      mockedAxios.delete.mockResolvedValue({
        data: { state: 'CANCELED' },
      });

      const result = await cancelDeployment('vercel', 'dpl_123');

      expect(result.success).toBe(true);
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('dpl_123'),
        expect.any(Object)
      );
    });

    it('should cancel Netlify deployment', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { state: 'canceled' },
      });

      const result = await cancelDeployment('netlify', 'deploy_123');

      expect(result.success).toBe(true);
    });

    it('should handle cancellation errors', async () => {
      mockedAxios.delete.mockRejectedValue({
        response: {
          data: { error: 'Deployment already completed' },
        },
      });

      const result = await cancelDeployment('vercel', 'dpl_123');

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network Error'));

      const config = {
        projectName: 'test',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
      };

      const result = await deployToVercel(config);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network Error');
    });

    it('should handle missing credentials', async () => {
      // Temporarily remove token
      const originalToken = process.env.VERCEL_TOKEN;
      delete process.env.VERCEL_TOKEN;

      const config = {
        projectName: 'test',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
      };

      const result = await deployToVercel(config);

      expect(result.success).toBe(false);
      expect(result.error).toContain('token');

      // Restore token
      process.env.VERCEL_TOKEN = originalToken;
    });
  });

  describe('Environment Variables', () => {
    it('should properly format environment variables', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { id: 'dpl_123', url: 'https://app.vercel.app' },
      });

      const config = {
        projectName: 'test',
        gitUrl: 'https://github.com/user/repo',
        branch: 'main',
        envVars: [
          { key: 'API_URL', value: 'https://api.com' },
          { key: 'SECRET_KEY', value: 'supersecret' },
        ],
      };

      await deployToVercel(config);

      const callArgs = mockedAxios.post.mock.calls[0];
      expect(callArgs[1].env).toEqual(config.envVars);
    });
  });
});
