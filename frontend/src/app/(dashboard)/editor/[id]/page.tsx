'use client';

import { useState } from 'react';
import { Play, Save, Settings2, Download, Share2, Terminal as TerminalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from '@/components/editor/code-editor';
import { FileTree } from '@/components/editor/file-tree';
import { Terminal } from '@/components/terminal/terminal';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { FileTreeNode } from '@/types/file';

// Mock data - Replace with real data from Convex
const mockFiles: FileTreeNode[] = [
  {
    name: 'src',
    path: 'src',
    type: 'folder',
    children: [
      {
        name: 'index.js',
        path: 'src/index.js',
        type: 'file',
        language: 'javascript',
      },
      {
        name: 'App.jsx',
        path: 'src/App.jsx',
        type: 'file',
        language: 'javascript',
      },
      {
        name: 'styles.css',
        path: 'src/styles.css',
        type: 'file',
        language: 'css',
      },
    ],
  },
  {
    name: 'public',
    path: 'public',
    type: 'folder',
    children: [
      {
        name: 'index.html',
        path: 'public/index.html',
        type: 'file',
        language: 'html',
      },
    ],
  },
  {
    name: 'package.json',
    path: 'package.json',
    type: 'file',
    language: 'json',
  },
  {
    name: 'README.md',
    path: 'README.md',
    type: 'file',
    language: 'markdown',
  },
];

const mockFileContents: Record<string, string> = {
  'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  'src/App.jsx': `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>Welcome to AUTOCREA</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default App;`,
  'src/styles.css': `.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #0066FF;
  margin-bottom: 1rem;
}

button {
  background: #0066FF;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #0052CC;
}`,
  'public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AUTOCREA App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
  'package.json': `{
  "name": "my-autocrea-app",
  "version": "1.0.0",
  "description": "Created with AUTOCREA",
  "main": "src/index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}`,
  'README.md': `# My AUTOCREA App

This project was created with AUTOCREA - AI-powered web development platform.

## Available Scripts

- \`npm start\` - Runs the app in development mode
- \`npm build\` - Builds the app for production
- \`npm test\` - Runs the test suite

## Learn More

Visit [AUTOCREA](https://autocrea.app) to learn more.`,
};

export default function EditorPage({ params }: { params: { id: string } }) {
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);
  const [code, setCode] = useState('');
  const [showTerminal, setShowTerminal] = useState(true);

  const handleFileSelect = (file: FileTreeNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setCode(mockFileContents[file.path] || '// File content');
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleSave = () => {
    console.log('Saving file:', selectedFile?.path);
    // TODO: Implement save to backend
  };

  const handleRun = () => {
    console.log('Running project...');
    // TODO: Implement run functionality
  };

  return (
    <div className="fixed inset-0 lg:left-64 top-16 flex flex-col bg-navy-300">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 glass border-b border-electric-500/10">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="font-semibold">My Project</h2>
            {selectedFile && (
              <p className="text-xs text-gray-400">{selectedFile.path}</p>
            )}
          </div>
          {selectedFile && (
            <Badge variant="outline" className="bg-electric-500/10 text-electric-500 border-electric-500/30">
              {selectedFile.language}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleRun}>
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTerminal(!showTerminal)}
          >
            <TerminalIcon className="h-4 w-4 mr-2" />
            Terminal
          </Button>
          <Separator orientation="vertical" className="h-6 bg-electric-500/20" />
          <Button variant="ghost" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 flex-shrink-0">
          <FileTree
            files={mockFiles}
            selectedFile={selectedFile?.path}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              <Tabs defaultValue="code" className="flex-1 flex flex-col">
                <TabsList className="glass border-b border-electric-500/20 rounded-none justify-start px-4">
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="code" className="flex-1 m-0">
                  <CodeEditor
                    value={code}
                    language={selectedFile.language || 'javascript'}
                    onChange={handleCodeChange}
                  />
                </TabsContent>
                <TabsContent value="preview" className="flex-1 m-0 bg-white">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Preview coming soon...</p>
                      <p className="text-sm text-gray-400">
                        Live preview will be available after backend integration
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Terminal */}
              {showTerminal && (
                <div className="h-64 border-t border-electric-500/20">
                  <Terminal />
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-deep-black">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-300">
                  No file selected
                </h3>
                <p className="text-gray-400">
                  Select a file from the tree to start editing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
