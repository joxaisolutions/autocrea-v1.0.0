export type UserPlan = 'free-trial' | 'creator' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: UserPlan;
  createdAt: number;
  updatedAt: number;
}

export interface PlanLimits {
  maxProjects: number;
  maxAIRequests: number;
  maxStorage: number; // in bytes
  features: {
    deployment: boolean;
    collaboration: boolean;
    gitIntegration: boolean;
    prioritySupport: boolean;
    customDomain: boolean;
    analytics: boolean;
  };
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  'free-trial': {
    maxProjects: 3,
    maxAIRequests: 100,
    maxStorage: 500 * 1024 * 1024, // 500MB
    features: {
      deployment: true,
      collaboration: false,
      gitIntegration: false,
      prioritySupport: false,
      customDomain: false,
      analytics: false,
    },
  },
  creator: {
    maxProjects: 10,
    maxAIRequests: 500,
    maxStorage: 5 * 1024 * 1024 * 1024, // 5GB
    features: {
      deployment: true,
      collaboration: false,
      gitIntegration: true,
      prioritySupport: false,
      customDomain: false,
      analytics: true,
    },
  },
  pro: {
    maxProjects: -1, // unlimited
    maxAIRequests: 2000,
    maxStorage: 20 * 1024 * 1024 * 1024, // 20GB
    features: {
      deployment: true,
      collaboration: true,
      gitIntegration: true,
      prioritySupport: true,
      customDomain: true,
      analytics: true,
    },
  },
  enterprise: {
    maxProjects: -1, // unlimited
    maxAIRequests: -1, // unlimited
    maxStorage: 100 * 1024 * 1024 * 1024, // 100GB
    features: {
      deployment: true,
      collaboration: true,
      gitIntegration: true,
      prioritySupport: true,
      customDomain: true,
      analytics: true,
    },
  },
};
