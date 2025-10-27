'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { FileTreeNode } from '@/types/file';

interface FileTreeProps {
  files: FileTreeNode[];
  onFileSelect?: (file: FileTreeNode) => void;
  selectedFile?: string;
  onFileCreate?: (path: string) => void;
  onFileDelete?: (path: string) => void;
}

export function FileTree({
  files,
  onFileSelect,
  selectedFile,
  onFileCreate,
  onFileDelete,
}: FileTreeProps) {
  return (
    <div className="h-full overflow-auto bg-navy-400 border-r border-electric-500/20">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300">FILES</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onFileCreate?.('new-file.js')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {files.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              level={0}
              onSelect={onFileSelect}
              selectedPath={selectedFile}
              onDelete={onFileDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: FileTreeNode;
  level: number;
  onSelect?: (file: FileTreeNode) => void;
  selectedPath?: string;
  onDelete?: (path: string) => void;
}

function TreeNode({ node, level, onSelect, selectedPath, onDelete }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSelected = selectedPath === node.path;
  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else {
      onSelect?.(node);
    }
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              'flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
              isSelected && 'bg-electric-500/20 border border-electric-500/50',
              !isSelected && 'hover:bg-electric-500/10'
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={handleClick}
          >
            {isFolder && (
              <span className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </span>
            )}
            <span className="flex-shrink-0">
              {isFolder ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-electric-500" />
                ) : (
                  <Folder className="h-4 w-4 text-electric-500" />
                )
              ) : (
                <FileIcon filename={node.name} />
              )}
            </span>
            <span className={cn('text-sm truncate', isSelected && 'font-semibold')}>
              {node.name}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="glass border-electric-500/20">
          <ContextMenuItem onClick={() => onSelect?.(node)}>
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDelete?.(node.path)} className="text-red-500">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split('.').pop()?.toLowerCase();

  const getColor = () => {
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'text-yellow-500';
      case 'ts':
      case 'tsx':
        return 'text-blue-500';
      case 'css':
      case 'scss':
        return 'text-pink-500';
      case 'html':
        return 'text-orange-500';
      case 'json':
        return 'text-green-500';
      case 'md':
        return 'text-gray-400';
      default:
        return 'text-gray-500';
    }
  };

  return <File className={cn('h-4 w-4', getColor())} />;
}
