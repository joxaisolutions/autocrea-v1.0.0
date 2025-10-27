import Link from 'next/link';
import { MoreVertical, Clock, Code2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="glass border-electric-500/20 hover:border-electric-500/40 transition-all group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1 flex-1">
          <Link href={`/editor/${project.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg line-clamp-1">{project.name}</h3>
          </Link>
          {project.description && (
            <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass border-electric-500/20">
            <DropdownMenuItem>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Code2 className="h-4 w-4 mr-2" />
              Clone
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-electric-500/10 text-electric-500 border-electric-500/30">
            {project.framework}
          </Badge>
          <Badge variant="outline" className="bg-cyber-500/10 text-cyber-500 border-cyber-500/30">
            {project.language}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{formatDate(project.updatedAt)}</span>
        </div>
        {project.lastDeployedAt && (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
            Deployed
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
