# 🚀 AUTOCREA - Fase 3: Backend Development

**Fecha de inicio**: 27 de Octubre, 2025
**Versión**: v1.0.0
**Stack**: Express + TypeScript + Convex + Socket.io + Docker

---

## 📋 Resumen de la Fase 3

En esta fase construiremos el backend completo de AUTOCREA, incluyendo:

1. **Express Server** - API REST con TypeScript
2. **Convex Database** - Schemas y queries
3. **WebSocket Server** - Terminal en tiempo real
4. **Code Execution Service** - Sandbox con Docker
5. **File System Service** - Gestión de archivos de proyectos
6. **Deployment Service** - Integración con Vercel/Netlify/Railway

---

## 🏗️ Arquitectura del Backend

```
backend/
├── src/
│   ├── server.ts              # Express server main
│   ├── config/                # Configuración
│   │   ├── env.ts
│   │   └── constants.ts
│   ├── middleware/            # Middleware
│   │   ├── auth.ts           # Clerk authentication
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── rateLimit.ts
│   ├── routes/                # API Routes
│   │   ├── projects.ts       # CRUD proyectos
│   │   ├── files.ts          # CRUD archivos
│   │   ├── code.ts           # Ejecución de código
│   │   ├── ai.ts             # JoxCoder AI
│   │   └── deploy.ts         # Deployment
│   ├── services/              # Business logic
│   │   ├── projectService.ts
│   │   ├── fileService.ts
│   │   ├── codeExecutionService.ts
│   │   ├── aiService.ts
│   │   └── deploymentService.ts
│   ├── websocket/             # WebSocket
│   │   ├── terminalHandler.ts
│   │   └── collaborationHandler.ts
│   └── utils/                 # Utilities
│       ├── logger.ts
│       ├── validators.ts
│       └── sanitizer.ts
├── convex/                    # Convex backend
│   ├── schema.ts             # Database schemas
│   ├── projects.ts           # Project queries/mutations
│   ├── files.ts              # File queries/mutations
│   ├── users.ts              # User queries/mutations
│   └── aiRequests.ts         # AI request tracking
├── docker/                    # Docker configs
│   ├── Dockerfile.sandbox    # Code execution sandbox
│   └── docker-compose.yml
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 📦 Dependencias Necesarias

### Core
- `express` - Framework HTTP
- `typescript` - Type safety
- `ts-node` - TypeScript execution
- `@types/express` - Types para Express

### Authentication
- `@clerk/express` - Clerk middleware para Express
- `@clerk/backend` - Clerk SDK

### Database
- `convex` - Convex client

### WebSocket
- `socket.io` - WebSocket server
- `@types/socket.io` - Types

### Code Execution
- `dockerode` - Docker API client
- `isolated-vm` - JavaScript sandbox alternativo

### Utilities
- `winston` - Logging
- `express-rate-limit` - Rate limiting
- `helmet` - Security headers
- `cors` - CORS handling
- `dotenv` - Environment variables
- `joi` - Input validation
- `uuid` - ID generation

### AI
- `@anthropic-ai/sdk` - Para JoxCoder (Claude API)
- `openai` - Alternativa OpenAI

### Deployment
- `@vercel/client` - Vercel API
- `netlify` - Netlify API
- `axios` - HTTP client

---

## 🗄️ Convex Database Schemas

### 1. **Projects Schema**

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.string(), // Clerk user ID
    framework: v.union(
      v.literal("react"),
      v.literal("nextjs"),
      v.literal("vue"),
      v.literal("html")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("archived"),
      v.literal("deploying"),
      v.literal("deployed")
    ),
    deploymentUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  files: defineTable({
    projectId: v.id("projects"),
    path: v.string(), // e.g., "src/App.jsx"
    content: v.string(),
    language: v.string(),
    size: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_path", ["projectId", "path"]),

  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    plan: v.union(
      v.literal("free-trial"),
      v.literal("creator"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    aiRequestsUsed: v.number(),
    storageUsed: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  aiRequests: defineTable({
    userId: v.string(),
    projectId: v.optional(v.id("projects")),
    prompt: v.string(),
    response: v.string(),
    model: v.string(),
    tokensUsed: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"]),

  deployments: defineTable({
    projectId: v.id("projects"),
    userId: v.string(),
    provider: v.union(
      v.literal("vercel"),
      v.literal("netlify"),
      v.literal("railway")
    ),
    url: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("building"),
      v.literal("success"),
      v.literal("failed")
    ),
    logs: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),
});
```

---

## 🔌 API Endpoints

### Projects API

```typescript
// GET /api/projects
// Lista todos los proyectos del usuario
// Query params: ?status=active&limit=10&offset=0

// POST /api/projects
// Crea un nuevo proyecto
// Body: { name, description, framework }

// GET /api/projects/:id
// Obtiene un proyecto específico

// PUT /api/projects/:id
// Actualiza un proyecto
// Body: { name?, description?, status? }

// DELETE /api/projects/:id
// Elimina un proyecto
```

### Files API

```typescript
// GET /api/projects/:projectId/files
// Lista todos los archivos de un proyecto

// GET /api/files/:fileId
// Obtiene el contenido de un archivo

// POST /api/files
// Crea un nuevo archivo
// Body: { projectId, path, content, language }

// PUT /api/files/:fileId
// Actualiza el contenido de un archivo
// Body: { content }

// DELETE /api/files/:fileId
// Elimina un archivo
```

### Code Execution API

```typescript
// POST /api/code/execute
// Ejecuta código en un sandbox
// Body: { code, language, timeout?, input? }
// Response: { output, error?, executionTime }
```

### AI API

```typescript
// POST /api/ai/generate
// Genera código con JoxCoder AI
// Body: { prompt, context?, model? }
// Response: { code, explanation, tokensUsed }

// POST /api/ai/explain
// Explica código existente
// Body: { code, language }
// Response: { explanation }

// POST /api/ai/fix
// Sugiere fixes para errores
// Body: { code, error }
// Response: { fixedCode, explanation }
```

### Deployment API

```typescript
// POST /api/deploy
// Despliega un proyecto
// Body: { projectId, provider }
// Response: { deploymentId, status, url? }

// GET /api/deployments/:id
// Obtiene el estado de un deployment

// GET /api/projects/:projectId/deployments
// Lista todos los deployments de un proyecto
```

---

## 🔌 WebSocket Events

### Terminal

```typescript
// Client → Server
socket.emit('terminal:command', { projectId, command });
socket.emit('terminal:input', { terminalId, input });
socket.emit('terminal:resize', { terminalId, cols, rows });

// Server → Client
socket.emit('terminal:output', { output, stream }); // stream: 'stdout' | 'stderr'
socket.emit('terminal:error', { error });
socket.emit('terminal:exit', { code });
```

### Collaboration (Futuro)

```typescript
// Client → Server
socket.emit('file:edit', { fileId, changes });
socket.emit('cursor:move', { fileId, position });

// Server → Client
socket.emit('file:updated', { fileId, changes, userId });
socket.emit('user:joined', { userId, name });
socket.emit('user:left', { userId });
```

---

## 🐳 Docker Sandbox

### Dockerfile para Code Execution

```dockerfile
# docker/Dockerfile.sandbox
FROM node:20-alpine

# Instalar dependencias básicas
RUN apk add --no-cache \
    python3 \
    py3-pip \
    bash \
    curl

# Crear usuario no-root
RUN addgroup -g 1000 sandbox && \
    adduser -D -u 1000 -G sandbox sandbox

# Directorio de trabajo
WORKDIR /sandbox

# Cambiar a usuario sandbox
USER sandbox

# Command
CMD ["sh"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - CONVEX_URL=${CONVEX_URL}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    volumes:
      - ./src:/app/src
    depends_on:
      - redis

  sandbox:
    build:
      context: ./docker
      dockerfile: Dockerfile.sandbox
    network_mode: none  # Sin acceso a red para seguridad
    mem_limit: 256m
    cpus: 0.5
    pids_limit: 50

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

---

## 🔒 Seguridad

### 1. Authentication

```typescript
// middleware/auth.ts
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth({
  onError: (error) => {
    return { error: 'Unauthorized' };
  },
});

// Usage
app.get('/api/projects', requireAuth, getProjects);
```

### 2. Rate Limiting

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: 'Too many requests, please try again later.',
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // 50 AI requests por hora (Free plan)
  message: 'AI request limit exceeded.',
});
```

### 3. Input Validation

```typescript
// utils/validators.ts
import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  framework: Joi.string()
    .valid('react', 'nextjs', 'vue', 'html')
    .required(),
});

export const executeCodeSchema = Joi.object({
  code: Joi.string().max(50000).required(), // Max 50KB
  language: Joi.string().valid('javascript', 'python', 'html').required(),
  timeout: Joi.number().min(1).max(30).optional(), // Max 30s
});
```

### 4. Sanitización

```typescript
// utils/sanitizer.ts
export function sanitizeFilePath(path: string): string {
  // Prevenir path traversal
  return path.replace(/\.\./g, '').replace(/^\//, '');
}

export function sanitizeCode(code: string): string {
  // Remover potenciales comandos peligrosos
  const dangerousPatterns = [
    /require\(['"]child_process['"]\)/g,
    /require\(['"]fs['"]\)/g,
    /eval\(/g,
    /Function\(/g,
  ];

  let sanitized = code;
  dangerousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '/* BLOCKED */');
  });

  return sanitized;
}
```

---

## 📝 Implementación Paso a Paso

### Paso 1: Setup del Proyecto Backend

```bash
# Crear directorio backend
mkdir backend
cd backend

# Inicializar npm
npm init -y

# Instalar dependencias
npm install express typescript ts-node @types/express @types/node
npm install convex socket.io helmet cors dotenv winston joi
npm install @clerk/express @clerk/backend
npm install express-rate-limit dockerode uuid

# Instalar dev dependencies
npm install -D nodemon @types/socket.io @types/cors
```

### Paso 2: Configurar TypeScript

```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Paso 3: Scripts en package.json

```json
// backend/package.json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint src --ext .ts",
    "test": "jest"
  }
}
```

---

## 🧪 Testing

### Setup de Jest

```bash
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

```javascript
// backend/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
```

### Ejemplo de Test

```typescript
// src/__tests__/projects.test.ts
import request from 'supertest';
import app from '../server';

describe('Projects API', () => {
  it('should create a new project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({
        name: 'Test Project',
        framework: 'react',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Project');
  });
});
```

---

## 📊 Monitoring & Logging

### Winston Logger

```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

---

## 🚀 Deployment (Railway)

### railway.toml

```toml
[build]
  builder = "NIXPACKS"
  buildCommand = "npm run build"

[deploy]
  startCommand = "npm start"
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 10

[[healthcheck]]
  path = "/health"
  timeout = 10
  interval = 30
```

---

## 📈 Próximos Pasos

1. ✅ Crear estructura del backend
2. ✅ Configurar Convex schemas
3. ⏳ Implementar API endpoints
4. ⏳ Configurar WebSocket server
5. ⏳ Implementar code execution service
6. ⏳ Integrar JoxCoder AI
7. ⏳ Setup deployment services
8. ⏳ Testing completo
9. ⏳ Deploy a Railway

---

**¡Comenzamos la implementación! 🚀**
