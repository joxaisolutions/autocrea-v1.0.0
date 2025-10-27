export type FileLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'yaml'
  | 'xml'
  | 'plaintext';

export interface File {
  id: string;
  projectId: string;
  path: string;
  content: string;
  language: FileLanguage;
  size: number;
  createdAt: number;
  updatedAt: number;
}

export interface CreateFileData {
  projectId: string;
  path: string;
  content: string;
  language: FileLanguage;
}

export interface UpdateFileData {
  content?: string;
  path?: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  language?: FileLanguage;
}
