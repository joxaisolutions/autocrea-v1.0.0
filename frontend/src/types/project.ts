export type ProjectStatus = 'active' | 'archived' | 'deleted';

export type ProjectFramework = 'react' | 'vue' | 'angular' | 'svelte' | 'next' | 'nuxt' | 'node' | 'express' | 'vanilla';

export type ProjectLanguage = 'javascript' | 'typescript' | 'python' | 'html';

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  template?: string;
  framework: ProjectFramework;
  language: ProjectLanguage;
  status: ProjectStatus;
  lastDeployedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  template?: string;
  framework: ProjectFramework;
  language: ProjectLanguage;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}
