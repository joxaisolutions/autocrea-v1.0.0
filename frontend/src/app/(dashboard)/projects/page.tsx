'use client';

import { useState } from 'react';
import { Plus, Grid3x3, List, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectList } from '@/components/projects/project-list';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';

export default function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Mock projects - will be replaced with real data from Convex
  const projects: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Projects</h1>
          <p className="text-gray-400 mt-1">Manage and organize your applications</p>
        </div>
        <Button className="btn-primary" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-navy-400 border-electric-500/20 focus:border-electric-500"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
            <TabsList className="glass border border-electric-500/20">
              <TabsTrigger value="grid">
                <Grid3x3 className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Projects Display */}
      {projects.length === 0 ? (
        <EmptyState onCreateClick={() => setCreateDialogOpen(true)} />
      ) : view === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}

      {/* Create Project Dialog */}
      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="glass rounded-2xl border border-electric-500/20 p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="h-32 w-32 rounded-full bg-electric-500/10 flex items-center justify-center mb-6">
          <Plus className="h-16 w-16 text-electric-500" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">Create Your First Project</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          Start building amazing applications with AUTOCREA. Choose from templates or create from
          scratch with AI assistance.
        </p>
        <Button className="btn-primary" onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>
    </div>
  );
}
