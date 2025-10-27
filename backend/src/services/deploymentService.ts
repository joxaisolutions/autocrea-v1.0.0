import axios from 'axios';

export interface DeploymentConfig {
  provider: 'vercel' | 'netlify' | 'railway';
  projectName: string;
  gitUrl?: string;
  branch?: string;
  buildCommand?: string;
  outputDirectory?: string;
  envVars?: Record<string, string>;
}

export interface DeploymentResult {
  success: boolean;
  deploymentId?: string;
  url?: string;
  buildId?: string;
  error?: string;
}

/**
 * Deploy to Vercel
 */
export async function deployToVercel(
  config: DeploymentConfig
): Promise<DeploymentResult> {
  try {
    const response = await axios.post(
      'https://api.vercel.com/v13/deployments',
      {
        name: config.projectName,
        gitSource: config.gitUrl
          ? {
              type: 'github',
              repo: config.gitUrl,
              ref: config.branch || 'main',
            }
          : undefined,
        buildCommand: config.buildCommand,
        outputDirectory: config.outputDirectory,
        env: config.envVars,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      deploymentId: response.data.id,
      url: response.data.url,
      buildId: response.data.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Deploy to Netlify
 */
export async function deployToNetlify(
  config: DeploymentConfig
): Promise<DeploymentResult> {
  try {
    // Create site if gitUrl is provided
    if (config.gitUrl) {
      const siteResponse = await axios.post(
        'https://api.netlify.com/api/v1/sites',
        {
          name: config.projectName,
          repo: {
            provider: 'github',
            repo: config.gitUrl,
            branch: config.branch || 'main',
          },
          build_settings: {
            cmd: config.buildCommand,
            dir: config.outputDirectory,
            env: config.envVars,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Trigger deploy
      const deployResponse = await axios.post(
        `https://api.netlify.com/api/v1/sites/${siteResponse.data.id}/deploys`,
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
          },
        }
      );

      return {
        success: true,
        deploymentId: deployResponse.data.id,
        url: siteResponse.data.url,
        buildId: deployResponse.data.id,
      };
    }

    return {
      success: false,
      error: 'Git URL is required for Netlify deployment',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

/**
 * Deploy to Railway
 */
export async function deployToRailway(
  config: DeploymentConfig
): Promise<DeploymentResult> {
  try {
    const response = await axios.post(
      'https://backboard.railway.app/graphql/v2',
      {
        query: `
          mutation deployProject($input: DeployInput!) {
            deploy(input: $input) {
              id
              url
              status
            }
          }
        `,
        variables: {
          input: {
            projectName: config.projectName,
            repo: config.gitUrl,
            branch: config.branch || 'main',
            buildCommand: config.buildCommand,
            envVars: config.envVars,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const deployment = response.data.data.deploy;

    return {
      success: true,
      deploymentId: deployment.id,
      url: deployment.url,
      buildId: deployment.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get deployment status from provider
 */
export async function getDeploymentStatus(
  provider: string,
  deploymentId: string
): Promise<{
  status: 'pending' | 'building' | 'success' | 'failed';
  url?: string;
  logs?: string;
}> {
  try {
    switch (provider) {
      case 'vercel':
        const vercelResponse = await axios.get(
          `https://api.vercel.com/v13/deployments/${deploymentId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
            },
          }
        );
        return {
          status: mapVercelStatus(vercelResponse.data.readyState),
          url: vercelResponse.data.url,
        };

      case 'netlify':
        const netlifyResponse = await axios.get(
          `https://api.netlify.com/api/v1/deploys/${deploymentId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
            },
          }
        );
        return {
          status: mapNetlifyStatus(netlifyResponse.data.state),
          url: netlifyResponse.data.deploy_ssl_url,
          logs: netlifyResponse.data.summary?.messages?.join('\n'),
        };

      case 'railway':
        // Railway status check would go here
        return {
          status: 'pending',
        };

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  } catch (error: any) {
    console.error('Error getting deployment status:', error);
    return {
      status: 'failed',
    };
  }
}

/**
 * Cancel a deployment
 */
export async function cancelDeployment(
  provider: string,
  deploymentId: string
): Promise<boolean> {
  try {
    switch (provider) {
      case 'vercel':
        await axios.patch(
          `https://api.vercel.com/v13/deployments/${deploymentId}/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
            },
          }
        );
        return true;

      case 'netlify':
        await axios.post(
          `https://api.netlify.com/api/v1/deploys/${deploymentId}/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
            },
          }
        );
        return true;

      default:
        return false;
    }
  } catch (error) {
    console.error('Error cancelling deployment:', error);
    return false;
  }
}

// Helper functions to map provider statuses
function mapVercelStatus(
  status: string
): 'pending' | 'building' | 'success' | 'failed' {
  switch (status) {
    case 'READY':
      return 'success';
    case 'ERROR':
    case 'CANCELED':
      return 'failed';
    case 'BUILDING':
      return 'building';
    default:
      return 'pending';
  }
}

function mapNetlifyStatus(
  status: string
): 'pending' | 'building' | 'success' | 'failed' {
  switch (status) {
    case 'ready':
      return 'success';
    case 'error':
      return 'failed';
    case 'building':
      return 'building';
    default:
      return 'pending';
  }
}
