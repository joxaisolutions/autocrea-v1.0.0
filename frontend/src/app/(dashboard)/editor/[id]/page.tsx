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
    <title>AUTOCREA Demo</title>
    <style>
      body {
        margin: 0;
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-center;
      }
      .container {
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        max-width: 500px;
        text-align: center;
      }
      h1 {
        color: #667eea;
        margin-bottom: 20px;
      }
      button {
        background: #667eea;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        margin: 10px;
        transition: all 0.3s;
      }
      button:hover {
        background: #764ba2;
        transform: scale(1.05);
      }
      .counter {
        font-size: 48px;
        color: #667eea;
        margin: 20px 0;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🚀 Welcome to AUTOCREA</h1>
      <p>AI-Powered Web Development Platform</p>
      <div class="counter" id="counter">0</div>
      <button onclick="increment()">Click Me!</button>
      <button onclick="reset()">Reset</button>
    </div>
    <script>
      let count = 0;
      function increment() {
        count++;
        document.getElementById('counter').textContent = count;
      }
      function reset() {
        count = 0;
        document.getElementById('counter').textContent = count;
      }
    </script>
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
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-sm text-gray-600 font-mono">
                          preview://localhost:3000
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // Reload preview
                          const iframe = document.querySelector('#preview-frame') as HTMLIFrameElement;
                          if (iframe) iframe.src = iframe.src;
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Refresh
                      </Button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {selectedFile?.language === 'html' || selectedFile?.path.endsWith('.html') ? (
                        <iframe
                          id="preview-frame"
                          srcDoc={code}
                          className="w-full h-full border-0"
                          sandbox="allow-scripts allow-modals"
                          title="Preview"
                        />
                      ) : selectedFile?.language === 'javascript' || selectedFile?.language === 'typescript' ? (
                        <div className="flex items-center justify-center h-full bg-gray-50">
                          <div className="text-center max-w-md p-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                              <Play className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              JavaScript/TypeScript Preview
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              To preview React/JS files, they need to be bundled and executed.
                              This will be available after backend integration.
                            </p>
                            <pre className="text-left bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-64">
                              {code}
                            </pre>
                          </div>
                        </div>
                      ) : selectedFile?.language === 'css' ? (
                        <div className="flex items-center justify-center h-full bg-white">
                          <div className="text-center max-w-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              CSS Preview
                            </h3>
                            <div className="border-2 border-gray-200 rounded-lg p-6">
                              <style>{code}</style>
                              <div className="space-y-4">
                                <div className="sample-box p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded">
                                  Sample styled element
                                </div>
                                <div className="sample-text">Sample text with your CSS applied</div>
                                <button className="sample-button px-4 py-2 rounded">Sample Button</button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                              Preview shows how your CSS affects sample elements
                            </p>
                          </div>
                        </div>
                      ) : selectedFile?.language === 'markdown' ? (
                        <div className="h-full overflow-auto bg-white">
                          <div className="max-w-4xl mx-auto p-8 prose prose-lg">
                            <div dangerouslySetInnerHTML={{ __html: code.replace(/\n/g, '<br>') }} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50">
                          <div className="text-center">
                            <p className="text-gray-600 mb-2">Preview not available for this file type</p>
                            <p className="text-sm text-gray-400">
                              Supported: HTML, CSS, Markdown
                            </p>
                          </div>
                        </div>
                      )}
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
