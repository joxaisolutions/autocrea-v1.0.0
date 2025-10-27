# AUTOCREA - Quick Start Guide

Esta guía te ayudará a configurar y ejecutar AUTOCREA v1.0.0 en tu entorno local (Windows 11 HP o macOS Tahoe Mac mini).

---

## Prerrequisitos

### Software Requerido

#### En Ambos Sistemas (Windows y macOS)

1. **Node.js 20+**
   ```bash
   # Verificar versión
   node --version  # debe ser >= 20.0.0
   npm --version   # debe ser >= 10.0.0
   ```

   Si no tienes Node.js instalado:
   - Descargar de: https://nodejs.org/

2. **Git**
   ```bash
   # Verificar instalación
   git --version
   ```

3. **IDE:**
   - **Windows:** Visual Studio Code
   - **macOS:** WebStorm

#### Solo para Backend (Sandbox de código)

4. **Docker Desktop**
   - **Windows:** https://www.docker.com/products/docker-desktop
   - **macOS:** https://www.docker.com/products/docker-desktop

   ```bash
   # Verificar instalación
   docker --version
   docker ps
   ```

### Cuentas y Servicios (Crear antes de empezar)

1. **Clerk** (Autenticación)
   - Registrarse en: https://clerk.com
   - Crear nueva aplicación
   - Obtener API keys

2. **Convex** (Base de Datos)
   - Registrarse en: https://convex.dev
   - Crear nuevo proyecto
   - Obtener deployment URL

3. **Stripe** (Pagos)
   - Registrarse en: https://stripe.com
   - Obtener API keys (test mode)
   - Configurar Clerk Billing: https://clerk.com/docs/billing

4. **Netlify** (Frontend Deployment)
   - Registrarse en: https://netlify.com
   - Instalar CLI: `npm install -g netlify-cli`

5. **Railway** (Backend Deployment)
   - Registrarse en: https://railway.app
   - Instalar CLI: `npm install -g @railway/cli`

---

## Instalación

### 1. Clonar el Repositorio

```bash
# Navegar a tu directorio de trabajo
cd /c/Users/HP/Desktop/autocrea  # Windows
cd ~/Desktop/autocrea              # macOS

# El proyecto ya está clonado en:
cd autocrea-v1.0.0
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias de todos los workspaces
npm run install:all
```

Este comando instalará:
- Dependencias raíz
- Dependencias del frontend
- Dependencias del backend

**Tiempo estimado:** 3-5 minutos

---

## Configuración

### 3. Configurar Clerk (Autenticación)

#### a. Crear Aplicación en Clerk

1. Ir a https://dashboard.clerk.com
2. Click en "Create application"
3. Nombre: "AUTOCREA"
4. Habilitar providers:
   - Email/Password
   - Google OAuth
   - GitHub OAuth

#### b. Obtener API Keys

En Clerk Dashboard → API Keys:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

#### c. Configurar URLs de Redirect

En Clerk Dashboard → Paths:
- Sign in URL: `/sign-in`
- Sign up URL: `/sign-up`
- After sign in: `/dashboard`
- After sign up: `/dashboard`

### 4. Configurar Convex (Base de Datos)

```bash
# Instalar Convex CLI globalmente
npm install -g convex

# Inicializar Convex en el proyecto
npx convex dev
```

Esto abrirá el navegador para:
1. Login en Convex
2. Crear nuevo proyecto: "autocrea"
3. Obtener deployment URL

**Guardar:** `NEXT_PUBLIC_CONVEX_URL`

### 5. Configurar Stripe (Billing)

1. Ir a https://dashboard.stripe.com
2. Obtener API keys en: Developers → API Keys
3. **Test Mode Keys:**
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (empieza con `pk_test_`)
   - `STRIPE_SECRET_KEY` (empieza con `sk_test_`)

4. Configurar Clerk Billing:
   - Clerk Dashboard → Billing
   - Connect Stripe Account
   - Seguir wizard de configuración

### 6. Variables de Entorno

#### Frontend (.env.local)

```bash
# Navegar a frontend
cd frontend

# Copiar ejemplo
cp .env.example .env.local

# Editar .env.local con tus valores
code .env.local  # Windows (VS Code)
open .env.local  # macOS (WebStorm)
```

**Contenido de `frontend/.env.local`:**

```env
# App
NEXT_PUBLIC_APP_NAME=AUTOCREA
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex
NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
CONVEX_DEPLOYMENT=prod:xxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Backend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Features
NEXT_PUBLIC_ENABLE_COLLABORATION=false
NEXT_PUBLIC_ENABLE_GIT_INTEGRATION=false
```

#### Backend (.env)

```bash
# Navegar a backend
cd ../backend

# Copiar ejemplo
cp .env.example .env

# Editar .env
code .env  # Windows
open .env  # macOS
```

**Contenido de `backend/.env`:**

```env
# Server
NODE_ENV=development
PORT=8000
HOST=0.0.0.0

# CORS
CORS_ORIGIN=http://localhost:3000

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Convex
CONVEX_DEPLOYMENT=prod:xxxxx
CONVEX_DEPLOY_KEY=xxxxx

# JoxCoder AI (Dejar vacío por ahora - se configurará después)
JOXCODER_API_URL=https://api.joxai.org/v1/joxcoder
JOXCODER_API_KEY=
JOXCODER_MODEL_VERSION=v1.0.0

# Docker
DOCKER_HOST=unix:///var/run/docker.sock
DOCKER_IMAGE=node:20-alpine
DOCKER_MEMORY_LIMIT=512m
DOCKER_TIMEOUT=30000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Storage
MAX_FILE_SIZE=10485760
MAX_PROJECT_SIZE=104857600
STORAGE_PATH=/tmp/autocrea-projects

# Logging
LOG_LEVEL=info
LOG_FILE=logs/autocrea.log

# Features
ENABLE_CODE_EXECUTION=true
ENABLE_AI_GENERATION=false
ENABLE_AUTO_DEPLOYMENT=true
```

---

## Desarrollo Local

### 7. Iniciar Convex Dev

En una terminal separada:

```bash
# Desde la raíz del proyecto
npx convex dev
```

Mantener esta terminal abierta. Convex sincronizará automáticamente cambios.

### 8. Iniciar Docker Desktop

- **Windows:** Abrir Docker Desktop desde el menú inicio
- **macOS:** Abrir Docker Desktop desde Applications

Verificar que Docker está corriendo:

```bash
docker ps
```

### 9. Pull Docker Images

```bash
# Images necesarias para el sandbox
docker pull node:20-alpine
docker pull python:3.11-alpine
```

### 10. Iniciar Servidores de Desarrollo

#### Opción A: Iniciar Todo a la Vez

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- Frontend en `http://localhost:3000`
- Backend en `http://localhost:8000`

#### Opción B: Iniciar Por Separado

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Convex:**
```bash
npx convex dev
```

### 11. Verificar Instalación

#### Frontend
Abrir en navegador: http://localhost:3000

Deberías ver:
- Landing page de AUTOCREA
- Botones de Sign In / Sign Up funcionando

#### Backend
Verificar health check:

```bash
curl http://localhost:8000/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "uptime": 10.5
}
```

#### Convex
Verificar en Convex Dashboard: https://dashboard.convex.dev

- Ver logs en tiempo real
- Ver schemas deployados

---

## Testing en Desarrollo

### Crear Usuario de Prueba

1. Ir a http://localhost:3000
2. Click en "Sign Up"
3. Crear cuenta con email de prueba
4. Verificar email
5. Login

### Probar Features

1. **Dashboard:**
   - Ver proyectos (vacío al inicio)
   - Ver plan actual (Free Trial)

2. **Crear Proyecto:**
   - Click en "New Project"
   - Elegir template (React, Vue, etc.)
   - Crear

3. **Editor:**
   - Abrir proyecto
   - Editar código
   - Ver preview
   - Probar terminal

---

## Deployment a Producción

### Frontend → Netlify

#### 1. Build Local

```bash
cd frontend
npm run build
```

Verificar que build es exitoso.

#### 2. Deploy con Netlify CLI

```bash
# Login
netlify login

# Link al proyecto (primera vez)
netlify link

# Deploy a production
netlify deploy --prod
```

#### 3. Configurar Variables de Entorno en Netlify

Netlify Dashboard → Site Settings → Environment Variables

Copiar todas las variables de `.env.local` excepto las que dicen `localhost`.

Actualizar:
- `NEXT_PUBLIC_APP_URL` → Tu URL de Netlify
- `NEXT_PUBLIC_API_URL` → Tu URL de Railway

#### 4. Configurar Build Settings

Netlify Dashboard → Build & Deploy → Build Settings:

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** `20.x`

### Backend → Railway

#### 1. Build Local

```bash
cd backend
npm run build
```

#### 2. Deploy con Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto (primera vez)
railway init

# Link al proyecto
railway link

# Deploy
railway up
```

#### 3. Configurar Variables de Entorno en Railway

Railway Dashboard → Variables

Copiar todas las variables de `.env`.

**Importante para Docker en Railway:**

Railway no soporta Docker-in-Docker por defecto. Opciones:

**Opción 1: Deshabilitar Code Execution**
```env
ENABLE_CODE_EXECUTION=false
```

**Opción 2: Usar Servicio Externo**
- Judge0 API
- Piston API
- CodeX API

#### 4. Configurar Dominio

Railway Dashboard → Settings → Domains

- Usar dominio generado por Railway
- O configurar custom domain

### Convex → Production

```bash
# Deploy schemas a production
npx convex deploy --prod
```

Copiar nueva `CONVEX_URL` de producción y actualizar en:
- Netlify env vars
- Railway env vars

---

## Estructura Post-Setup

Después de completar el setup, tendrás:

```
AUTOCREA v1.0.0
│
├── Desarrollo Local:
│   ├── Frontend: http://localhost:3000
│   ├── Backend: http://localhost:8000
│   └── Convex: Running in background
│
├── Producción:
│   ├── Frontend: https://autocrea.netlify.app
│   ├── Backend: https://autocrea.up.railway.app
│   └── Database: Convex Cloud
│
└── Servicios:
    ├── Auth: Clerk
    ├── Billing: Stripe (via Clerk)
    ├── Database: Convex
    └── AI: JoxCoder (pendiente integración)
```

---

## Integración de JoxCoder (Próximo Paso)

JoxCoder es tu modelo de IA propietario. Cuando esté listo para integración:

### 1. Configurar API Endpoint

En `backend/.env`:
```env
JOXCODER_API_URL=https://api.joxai.org/v1/joxcoder
JOXCODER_API_KEY=tu_api_key_aqui
ENABLE_AI_GENERATION=true
```

### 2. Ver Guía de Integración

```bash
# Documentación completa en:
docs/JOXCODER_INTEGRATION.md
```

La guía incluye:
- Formato de requests
- Ejemplos de prompts
- Error handling
- Rate limiting
- Testing

---

## Comandos Útiles

### Desarrollo

```bash
# Reiniciar todo
npm run dev

# Solo frontend
cd frontend && npm run dev

# Solo backend
cd backend && npm run dev

# Convex
npx convex dev

# Ver logs de Convex
npx convex logs
```

### Build

```bash
# Build todo
npm run build

# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build
```

### Linting y Formateo

```bash
# Lint todo
npm run lint

# Format todo
npm run format

# Type check
npm run type-check
```

### Database (Convex)

```bash
# Ver datos en dashboard
npx convex dashboard

# Ejecutar función manualmente
npx convex run projects:list

# Clear database (cuidado!)
npx convex data clear
```

### Docker (Sandbox)

```bash
# Ver containers activos
docker ps

# Ver todos los containers
docker ps -a

# Limpiar containers detenidos
docker container prune

# Ver logs de container
docker logs <container_id>
```

---

## Troubleshooting

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
npm run clean
npm run install:all
```

### Error: "Port 3000 already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS
lsof -ti:3000 | xargs kill
```

### Error: "Clerk authentication failed"

1. Verificar que las keys son correctas
2. Verificar que no hay espacios extra en `.env`
3. Reiniciar servidor de desarrollo

### Error: "Convex connection failed"

```bash
# Re-autenticar
npx convex logout
npx convex dev
```

### Error: "Docker daemon not running"

1. Abrir Docker Desktop
2. Esperar que inicie completamente
3. Verificar con: `docker ps`

### Error: Build falla en Netlify

1. Verificar Node version: `20.x`
2. Verificar todas las env vars
3. Ver build logs en Netlify Dashboard

---

## Monitoring

### Development

- **Frontend:** http://localhost:3000
- **Backend Health:** http://localhost:8000/health
- **Convex Dashboard:** https://dashboard.convex.dev
- **Clerk Dashboard:** https://dashboard.clerk.com

### Production

- **Netlify Dashboard:** Ver deploys, logs, analytics
- **Railway Dashboard:** Ver deploys, logs, metrics
- **Convex Dashboard:** Ver queries, logs, data
- **Clerk Dashboard:** Ver users, sessions, analytics
- **Stripe Dashboard:** Ver subscriptions, payments

---

## Próximos Pasos

Una vez que tengas todo corriendo:

1. ✅ Completar **Fase 2:** Implementar UI/UX completo
2. ✅ Completar **Fase 3:** Implementar todas las APIs del backend
3. ✅ Completar **Fase 4:** Configurar billing completo con Stripe
4. ✅ Completar **Fase 5:** Integrar JoxCoder y optimizar para producción

Ver [MASTER_PLAN.md](./MASTER_PLAN.md) para roadmap completo.

---

## Soporte

Si encuentras problemas:

1. Revisar esta guía
2. Revisar README de componente específico:
   - [Frontend README](./frontend/README.md)
   - [Backend README](./backend/README.md)
   - [Convex README](./convex/README.md)
3. Contactar: support@joxai.org

---

## Checklist de Setup

```
☐ Node.js 20+ instalado
☐ Git instalado
☐ Docker Desktop instalado y corriendo
☐ Cuenta Clerk creada y configurada
☐ Cuenta Convex creada y proyecto inicializado
☐ Cuenta Stripe creada y keys obtenidas
☐ Dependencias instaladas (npm run install:all)
☐ Variables de entorno configuradas (frontend/.env.local)
☐ Variables de entorno configuradas (backend/.env)
☐ Convex dev corriendo (npx convex dev)
☐ Frontend corriendo (http://localhost:3000)
☐ Backend corriendo (http://localhost:8000)
☐ Clerk auth funcionando (sign up/sign in)
☐ Convex conectado (ver dashboard)
☐ Docker containers funcionando
☐ Netlify account creada
☐ Railway account creada
```

---

**¡Listo para desarrollar AUTOCREA!** 🚀

Desarrollado por **JoxAI** | https://joxai.org
