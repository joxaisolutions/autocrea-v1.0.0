import Link from 'next/link';
import { MoreVertical, Clock, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types/project';

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="glass rounded-lg border border-electric-500/20 overflow-hidden">
      <div className="divide-y divide-electric-500/10">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-6 hover:bg-electric-500/5 transition-colors group"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="h-12 w-12 rounded-lg bg-electric-500/20 flex items-center justify-center">
                <Code2 className="h-6 w-6 text-electric-500" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/editor/${project.id}`} className="hover:underline">
                  <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                </Link>
                {project.description && (
                  <p className="text-sm text-gray-400 truncate">{project.description}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="bg-electric-500/10 text-electric-500 border-electric-500/30 text-xs">
                    {project.framework}
                  </Badge>
                  <Badge variant="outline" className="bg-cyber-500/10 text-cyber-500 border-cyber-500/30 text-xs">
                    {project.language}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatDate(project.updatedAt)}</span>
              </div>
              {project.lastDeployedAt && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                  Deployed
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-electric-500/20">
                  <DropdownMenuItem>Open</DropdownMenuItem>
                  <DropdownMenuItem>Clone</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
