import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function AIPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold gradient-text">AI Assistant</h1>
          <Badge className="bg-electric-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            New
          </Badge>
        </div>
        <p className="text-gray-400 mt-1">
          Powered by JoxCoder - Your AI coding companion
        </p>
      </div>

      <Separator className="bg-electric-500/20" />

      <div className="grid gap-6">
        <Card className="glass border-electric-500/20 bg-gradient-to-br from-electric-500/5 to-cyber-500/5">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-electric-500" />
              <CardTitle>JoxCoder AI Assistant</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Generate code, explain concepts, and build applications with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="h-24 w-24 rounded-full bg-electric-500/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-12 w-12 text-electric-500 animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant Coming Soon</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                JoxCoder integration is being prepared. Soon you'll be able to generate entire
                applications with just a prompt.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass border-electric-500/20">
            <CardHeader>
              <CardTitle>Code Generation</CardTitle>
              <CardDescription className="text-gray-400">
                Generate production-ready code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Describe what you want to build and JoxCoder will generate clean, functional code
                for you.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-electric-500/20">
            <CardHeader>
              <CardTitle>Code Explanation</CardTitle>
              <CardDescription className="text-gray-400">
                Understand any code instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Paste any code snippet and JoxCoder will explain what it does in simple terms.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-electric-500/20">
            <CardHeader>
              <CardTitle>Bug Detection</CardTitle>
              <CardDescription className="text-gray-400">
                Find and fix issues automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                JoxCoder analyzes your code to detect bugs, vulnerabilities, and performance
                issues.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-electric-500/20">
            <CardHeader>
              <CardTitle>Refactoring</CardTitle>
              <CardDescription className="text-gray-400">
                Improve code quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Let JoxCoder refactor your code following best practices and modern patterns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
