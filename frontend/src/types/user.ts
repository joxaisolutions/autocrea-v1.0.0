export type UserPlan = 'free' | 'pro' | 'enterprise';

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
  };
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    maxProjects: 3,
    maxAIRequests: 100,
    maxStorage: 500 * 1024 * 1024, // 500MB
    features: {
      deployment: true,
      collaboration: false,
      gitIntegration: false,
      prioritySupport: false,
    },
  },
  pro: {
    maxProjects: -1, // unlimited
    maxAIRequests: 1000,
    maxStorage: 10 * 1024 * 1024 * 1024, // 10GB
    features: {
      deployment: true,
      collaboration: false,
      gitIntegration: false,
      prioritySupport: true,
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
    },
  },
};
