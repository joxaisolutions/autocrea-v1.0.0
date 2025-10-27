# AUTOCREA Backend

Backend de AUTOCREA - APIs REST y WebSocket para ejecución de código, gestión de proyectos y integración con JoxCoder AI.

## Stack Tecnológico

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **WebSocket:** Socket.io
- **Containerización:** Docker (sandbox de ejecución)
- **Auth:** Clerk Backend SDK
- **Database:** Convex

## Estructura del Proyecto

```
backend/
├── src/
│   ├── index.ts                     # Entry point
│   ├── app.ts                       # Express app configuration
│   ├── server.ts                    # HTTP + WebSocket server
│   ├── api/                         # REST API endpoints
│   │   ├── routes/
│   │   │   ├── projects.routes.ts
│   │   │   ├── files.routes.ts
│   │   │   ├── execute.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   └── deploy.routes.ts
│   │   └── controllers/
│   │       ├── projects.controller.ts
│   │       ├── files.controller.ts
│   │       ├── execute.controller.ts
│   │       ├── ai.controller.ts
│   │       └── deploy.controller.ts
│   ├── services/                    # Business logic
│   │   ├── code-execution/
│   │   │   ├── sandbox.service.ts   # Docker sandbox
│   │   │   └── executor.service.ts  # Código executor
│   │   ├── ai-integration/
│   │   │   ├── joxcoder.service.ts  # JoxCoder API client
│   │   │   └── prompts.ts           # AI prompts templates
│   │   ├── deployment/
│   │   │   ├── vercel.service.ts
│   │   │   ├── netlify.service.ts
│   │   │   └── railway.service.ts
│   │   └── file-system/
│   │       ├── storage.service.ts
│   │       └── archive.service.ts
│   ├── websocket/                   # Socket.io handlers
│   │   ├── terminal.handler.ts
│   │   └── collaboration.handler.ts
│   ├── middleware/                  # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/                       # Utilities
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── helpers.ts
│   └── types/                       # TypeScript types
│       ├── api.types.ts
│       ├── project.types.ts
│       └── execution.types.ts
├── logs/                            # Log files
├── tests/                           # Tests
└── package.json
```

## Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Configurar todas las variables necesarias (ver `.env.example`).

### 3. Instalar Docker (Requerido para Sandbox)

#### Windows:
```bash
# Descargar Docker Desktop desde:
https://www.docker.com/products/docker-desktop

# Iniciar Docker Desktop
```

#### macOS:
```bash
# Descargar Docker Desktop desde:
https://www.docker.com/products/docker-desktop

# Iniciar Docker Desktop
```

### 4. Pull Docker Images

```bash
docker pull node:20-alpine
docker pull python:3.11-alpine
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor con hot-reload (localhost:8000)

# Producción
npm run build            # Compila TypeScript a JavaScript
npm start                # Inicia servidor de producción

# Calidad de código
npm run lint             # Ejecuta ESLint
npm run type-check       # Verifica tipos de TypeScript
npm run format           # Formatea código con Prettier

# Testing
npm test                 # Ejecuta tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Coverage report
```

## API Endpoints

### Base URL
```
Development: http://localhost:8000/api
Production: https://autocrea-backend.railway.app/api
```

### Autenticación

Todas las rutas (excepto health check) requieren autenticación con Clerk.

Headers requeridos:
```
Authorization: Bearer <clerk_session_token>
```

### Endpoints

#### Health Check
```http
GET /health
```
Verifica el estado del servidor.

#### Projects

```http
# Listar proyectos del usuario
GET /api/projects

# Obtener un proyecto
GET /api/projects/:id

# Crear nuevo proyecto
POST /api/projects
Content-Type: application/json
{
  "name": "My Project",
  "description": "Project description",
  "template": "react-vite",
  "framework": "react",
  "language": "typescript"
}

# Actualizar proyecto
PATCH /api/projects/:id
Content-Type: application/json
{
  "name": "Updated Name",
  "description": "Updated description"
}

# Eliminar proyecto
DELETE /api/projects/:id

# Archivar proyecto
POST /api/projects/:id/archive

# Clonar proyecto
POST /api/projects/:id/clone
```

#### Files

```http
# Listar archivos del proyecto
GET /api/files?projectId=<project_id>

# Obtener contenido de archivo
GET /api/files/:id

# Crear archivo
POST /api/files
Content-Type: application/json
{
  "projectId": "project_id",
  "path": "/src/index.ts",
  "content": "console.log('Hello');",
  "language": "typescript"
}

# Actualizar archivo
PATCH /api/files/:id
Content-Type: application/json
{
  "content": "Updated content"
}

# Eliminar archivo
DELETE /api/files/:id

# Upload múltiples archivos
POST /api/files/upload
Content-Type: multipart/form-data
```

#### Code Execution

```http
# Ejecutar código en sandbox
POST /api/execute
Content-Type: application/json
{
  "projectId": "project_id",
  "language": "javascript",
  "code": "console.log('Hello World');",
  "timeout": 5000
}

# Response:
{
  "success": true,
  "output": "Hello World\n",
  "error": null,
  "executionTime": 45
}
```

#### AI Code Generation (JoxCoder)

```http
# Generar código con IA
POST /api/ai/generate
Content-Type: application/json
{
  "prompt": "Create a React component for a todo list",
  "context": {
    "framework": "react",
    "language": "typescript",
    "projectId": "project_id"
  }
}

# Refactorizar código
POST /api/ai/refactor
Content-Type: application/json
{
  "code": "function add(a,b){return a+b}",
  "instructions": "Add TypeScript types and JSDoc comments"
}

# Explicar código
POST /api/ai/explain
Content-Type: application/json
{
  "code": "const result = array.reduce((acc, val) => acc + val, 0);"
}

# Detectar errores
POST /api/ai/analyze
Content-Type: application/json
{
  "code": "console.log(undefinedVar);",
  "language": "javascript"
}
```

#### Deployment

```http
# Deploy a Vercel
POST /api/deploy/vercel
Content-Type: application/json
{
  "projectId": "project_id",
  "name": "my-app",
  "env": {
    "NODE_ENV": "production"
  }
}

# Deploy a Netlify
POST /api/deploy/netlify
Content-Type: application/json
{
  "projectId": "project_id",
  "name": "my-app",
  "buildCommand": "npm run build",
  "publishDirectory": "dist"
}

# Deploy a Railway
POST /api/deploy/railway
Content-Type: application/json
{
  "projectId": "project_id",
  "name": "my-app"
}

# Obtener logs de deployment
GET /api/deploy/:deploymentId/logs
```

## WebSocket Events

### Conexión

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8000', {
  auth: {
    token: clerkSessionToken
  }
});
```

### Terminal Events

```javascript
// Cliente → Servidor

// Crear nueva terminal
socket.emit('terminal:create', { projectId });

// Ejecutar comando
socket.emit('terminal:command', {
  terminalId,
  command: 'npm install'
});

// Enviar input
socket.emit('terminal:input', {
  terminalId,
  data: 'y\n'
});

// Cerrar terminal
socket.emit('terminal:close', { terminalId });

// Servidor → Cliente

// Terminal creada
socket.on('terminal:created', ({ terminalId }) => {});

// Output de terminal
socket.on('terminal:output', ({ terminalId, data }) => {
  console.log(data);
});

// Terminal cerrada
socket.on('terminal:closed', ({ terminalId }) => {});

// Error
socket.on('terminal:error', ({ terminalId, error }) => {});
```

### Collaboration Events (Futuro)

```javascript
// Edición de código en tiempo real
socket.emit('code:edit', { fileId, changes });
socket.on('code:update', ({ fileId, changes }) => {});

// Cursores de usuarios
socket.emit('cursor:move', { fileId, position });
socket.on('cursor:update', ({ userId, fileId, position }) => {});
```

## Servicios

### Code Execution (Sandbox)

Sistema de ejecución segura de código en contenedores Docker aislados.

**Características:**
- Timeout configurable
- Límite de memoria
- Aislamiento completo
- Soporte para múltiples lenguajes

**Lenguajes soportados:**
- JavaScript/Node.js
- TypeScript
- Python
- HTML/CSS

### JoxCoder AI Integration

Cliente para interactuar con el modelo JoxCoder.

**Funcionalidades:**
- Generación de código
- Refactorización
- Explicación de código
- Detección de errores
- Optimización

**Estado:** Endpoints preparados para integración futura del modelo.

### Deployment Services

Integración con plataformas de deployment.

**Plataformas soportadas:**
- Vercel
- Netlify
- Railway

**Proceso:**
1. Empaquetar proyecto
2. Subir a plataforma
3. Configurar build
4. Deploy
5. Retornar URL

### File System

Gestión de archivos y proyectos.

**Funcionalidades:**
- CRUD de archivos
- Archiving (ZIP/TAR)
- Upload/Download
- Límites de tamaño
- Validación de paths

## Middleware

### Auth Middleware

Valida tokens de Clerk y extrae información del usuario.

```typescript
import { requireAuth } from './middleware/auth.middleware';

router.get('/protected', requireAuth, (req, res) => {
  const userId = req.auth.userId;
  // ...
});
```

### Rate Limiting

Límites por endpoint y por usuario según plan.

**Free Plan:**
- 100 requests / 15 min

**Pro Plan:**
- 1000 requests / 15 min

**Enterprise Plan:**
- Ilimitado

### Error Handling

Manejo centralizado de errores con logging.

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}
```

## Logging

Winston logger con múltiples transports.

**Niveles:**
- error
- warn
- info
- http
- debug

**Archivos:**
- `logs/error.log` - Solo errores
- `logs/combined.log` - Todos los logs

## Testing

```bash
# Ejecutar todos los tests
npm test

# Tests específicos
npm test -- projects.test.ts

# Coverage
npm run test:coverage
```

**Estructura de tests:**
```
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
```

## Deployment (Railway)

### Configuración

1. **Crear proyecto en Railway:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init
```

2. **Configurar variables de entorno:**
   - Ir a Railway Dashboard
   - Settings → Variables
   - Agregar todas las variables del `.env.example`

3. **Configurar build:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

4. **Deploy:**
```bash
railway up
```

### Docker Setup (Producción)

Railway requiere acceso a Docker daemon para el sandbox.

**Opciones:**
1. Usar Railway con Docker-in-Docker (dind)
2. Usar servicio externo de ejecución de código
3. Serverless functions para ejecución

## Seguridad

### Buenas Prácticas

- ✅ Rate limiting implementado
- ✅ Helmet para headers de seguridad
- ✅ CORS configurado
- ✅ Input validation con Zod
- ✅ Sandbox aislado para código
- ✅ Logs sanitizados
- ✅ Secrets en variables de entorno
- ✅ Autenticación en todas las rutas

### Docker Security

- Contenedores con límites de memoria
- No privileged mode
- Network isolation
- Timeout en ejecuciones
- Cleanup automático

## Troubleshooting

### Error: Cannot connect to Docker daemon

```bash
# Windows/Mac: Verificar que Docker Desktop está corriendo
# Linux: Verificar permisos
sudo usermod -aG docker $USER
```

### Error: Port 8000 already in use

```bash
# Cambiar puerto en .env
PORT=8001
```

### Error: Clerk authentication failed

```bash
# Verificar variables de entorno
# Verificar que el token no está expirado
# Verificar formato: Authorization: Bearer <token>
```

## Monitoreo

### Health Check

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "uptime": 123.45,
  "memory": {
    "used": 100,
    "total": 512
  }
}
```

## Recursos

- [Express Documentation](https://expressjs.com)
- [Socket.io Documentation](https://socket.io/docs)
- [Docker Documentation](https://docs.docker.com)
- [Clerk Backend SDK](https://clerk.com/docs/references/backend/overview)
- [Railway Documentation](https://docs.railway.app)

## Soporte

Para reportar problemas:
- Email: support@joxai.org
- Web: https://joxai.org

---

**Desarrollado por JoxAI** 🚀
