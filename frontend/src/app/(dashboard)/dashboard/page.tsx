'use client';

import { Suspense } from 'react';
import { Plus, Code2, Zap, FolderKanban, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useUser();

  // Fetch user's projects
  const projects = useQuery(
    api.projects.getUserProjects,
    user ? { userId: user.id } : 'skip'
  );

  // Calculate stats
  const totalProjects = projects?.length || 0;
  const recentProjects = projects
    ?.sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link href="/projects">
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-electric-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-electric-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProjects}</div>
            <p className="text-xs text-gray-400 mt-1">
              {projects ? 'All your projects' : 'Loading...'}
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-electric-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              AI Requests
            </CardTitle>
            <Zap className="h-4 w-4 text-electric-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-gray-400 mt-1">
              100 remaining this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-electric-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Storage Used
            </CardTitle>
            <Code2 className="h-4 w-4 text-electric-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0 MB</div>
            <p className="text-xs text-gray-400 mt-1">
              500 MB available
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-electric-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Deployments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-electric-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-gray-400 mt-1">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="glass border-electric-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription className="text-gray-400">
                Your most recently updated projects
              </CardDescription>
            </div>
            <Link href="/projects">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!projects ? (
            <ProjectsSkeleton />
          ) : recentProjects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`/editor/${project._id}`}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-electric-500/5 transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg bg-electric-500/20 flex items-center justify-center">
                    <Code2 className="h-6 w-6 text-electric-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{project.name}</h4>
                    <p className="text-sm text-gray-400 truncate">
                      {project.description || `${project.framework} project`}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/editor/demo">
          <Card className="glass border-electric-500/20 hover:border-electric-500/40 transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-electric-500/20 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-electric-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Try Editor</CardTitle>
                  <CardDescription className="text-gray-400">
                    Test the code editor now
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Card className="glass border-electric-500/20 hover:border-electric-500/40 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-electric-500/20 flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-electric-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Create from Template</CardTitle>
                <CardDescription className="text-gray-400">
                  Start with a pre-built template
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="glass border-electric-500/20 hover:border-electric-500/40 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-electric-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-electric-500" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Code Generation</CardTitle>
                <CardDescription className="text-gray-400">
                  Generate code with JoxCoder AI
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="glass border-electric-500/20 bg-gradient-to-br from-electric-500/5 to-cyber-500/5">
        <CardHeader>
          <CardTitle>Getting Started with AUTOCREA</CardTitle>
          <CardDescription className="text-gray-400">
            Follow these steps to create your first project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric-500 text-white text-sm font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold">Create a Project</h4>
              <p className="text-sm text-gray-400">
                Choose from templates or start from scratch
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric-500/50 text-white text-sm font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold">Use AI to Generate Code</h4>
              <p className="text-sm text-gray-400">
                Describe what you want and let JoxCoder build it
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric-500/30 text-white text-sm font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold">Deploy Your App</h4>
              <p className="text-sm text-gray-400">
                One-click deployment to Vercel, Netlify, or Railway
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-24 w-24 rounded-full bg-electric-500/10 flex items-center justify-center mb-4">
        <FolderKanban className="h-12 w-12 text-electric-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
      <p className="text-gray-400 mb-4 max-w-sm">
        Get started by creating your first project. Use templates or let AI build it for you.
      </p>
      <Link href="/projects/new">
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Project
        </Button>
      </Link>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
