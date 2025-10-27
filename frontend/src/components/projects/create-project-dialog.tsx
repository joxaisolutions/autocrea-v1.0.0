'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ProjectFramework, ProjectLanguage } from '@/types/project';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const frameworks: { value: ProjectFramework; label: string }[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'node', label: 'Node.js' },
  { value: 'express', label: 'Express' },
  { value: 'vanilla', label: 'Vanilla JS' },
];

const languages: { value: ProjectLanguage; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
];

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState<ProjectFramework>('react');
  const [language, setLanguage] = useState<ProjectLanguage>('typescript');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    // TODO: Implement project creation logic
    console.log('Creating project:', {
      name,
      description,
      framework,
      language,
      mode,
      aiPrompt: mode === 'ai' ? aiPrompt : undefined,
    });

    setTimeout(() => {
      setIsCreating(false);
      onOpenChange(false);
      // Reset form
      setName('');
      setDescription('');
      setAiPrompt('');
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-electric-500/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Create New Project</DialogTitle>
          <DialogDescription className="text-gray-400">
            Start a new project from scratch or let AI build it for you
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as 'manual' | 'ai')}>
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="manual">Manual Setup</TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="my-awesome-app"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-navy-400 border-electric-500/20 focus:border-electric-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-navy-400 border-electric-500/20 focus:border-electric-500 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="framework">Framework *</Label>
                <Select value={framework} onValueChange={(v) => setFramework(v as ProjectFramework)}>
                  <SelectTrigger className="bg-navy-400 border-electric-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-electric-500/20">
                    {frameworks.map((fw) => (
                      <SelectItem key={fw.value} value={fw.value}>
                        {fw.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as ProjectLanguage)}>
                  <SelectTrigger className="bg-navy-400 border-electric-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-electric-500/20">
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-6">
            <div className="glass rounded-lg p-4 border border-electric-500/20 bg-electric-500/5">
              <div className="flex items-start space-x-2">
                <Sparkles className="h-5 w-5 text-electric-500 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold text-electric-500">AI-Powered Generation</p>
                  <p className="text-gray-400">
                    Describe your app and JoxCoder will generate the entire codebase for you.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-prompt">What do you want to build? *</Label>
              <Textarea
                id="ai-prompt"
                placeholder="Example: A todo list app with authentication, where users can create, edit, and delete tasks. Include dark mode support and responsive design."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="bg-navy-400 border-electric-500/20 focus:border-electric-500 resize-none"
                rows={6}
              />
              <p className="text-xs text-gray-400">
                Be specific about features, design, and functionality you want.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-name">Project Name *</Label>
              <Input
                id="ai-name"
                placeholder="my-awesome-app"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-navy-400 border-electric-500/20 focus:border-electric-500"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            className="btn-primary"
            onClick={handleCreate}
            disabled={
              isCreating ||
              !name ||
              (mode === 'ai' && !aiPrompt)
            }
          >
            {isCreating ? (
              <>
                <span className="loading-spinner mr-2" />
                Creating...
              </>
            ) : mode === 'ai' ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
