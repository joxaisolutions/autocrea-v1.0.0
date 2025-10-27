# 🚀 AUTOCREA v1.0.0 - Guía de Configuración Completa

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
3. [Configuración de Convex](#configuración-de-convex)
4. [Configuración de Clerk](#configuración-de-clerk)
5. [Configuración de Stripe](#configuración-de-stripe)
6. [Configuración de Claude AI](#configuración-de-claude-ai)
7. [Configuración de Providers de Deployment](#configuración-de-providers)
8. [Iniciar el Proyecto Localmente](#iniciar-localmente)
9. [Deployment a Producción](#deployment-producción)

---

## 1. Requisitos Previos

### Software Necesario

```bash
✓ Node.js 20.x o superior
✓ npm 10.x o superior
✓ Git
✓ Un editor de código (VS Code recomendado)
```

### Verificar Instalaciones

```bash
node --version  # v20.19.5 o superior
npm --version   # 10.8.2 o superior
git --version   # cualquier versión reciente
```

### Cuentas Necesarias

1. **Clerk** (Autenticación) - https://clerk.com
   - Plan: Free tier disponible
   - Costo: $0 - $25/mes

2. **Convex** (Database) - https://convex.dev
   - Plan: Free tier generoso
   - Costo: $0 - $25/mes

3. **Anthropic** (Claude AI) - https://anthropic.com
   - Plan: Pay-as-you-go
   - Costo: ~$0.003 por 1K tokens

4. **Stripe** (Pagos) - https://stripe.com
   - Plan: Pay-as-you-go
   - Costo: 2.9% + $0.30 por transacción

5. **Netlify** (Frontend Hosting) - https://netlify.com
   - Plan: Free tier disponible
   - Costo: $0 - $19/mes

6. **Railway** (Backend Hosting) - https://railway.app
   - Plan: $5 crédito gratis
   - Costo: ~$5-10/mes

---

## 2. Configuración de Variables de Entorno

### A. Frontend (`frontend/.env.local`)

Crea el archivo `frontend/.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### B. Backend (`backend/.env`)

Crea el archivo `backend/.env`:

```bash
# Server Configuration
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_secret_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Convex Database
CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=prod:your_deploy_key_here

# AI Service (JoxCoder / Claude)
ANTHROPIC_API_KEY=sk-ant-your_key_here
AI_MODEL=claude-3-5-sonnet-20241022

# Deployment Services (Opcional - para deployments automáticos)
VERCEL_TOKEN=your_vercel_token
NETLIFY_TOKEN=your_netlify_token
RAILWAY_TOKEN=your_railway_token

# Docker Configuration (Futuro - para code execution)
DOCKER_HOST=unix:///var/run/docker.sock
CODE_EXECUTION_TIMEOUT=30000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### C. Root (`.env`)

Crea el archivo `.env` en la raíz (para Convex):

```bash
# Convex
CONVEX_DEPLOYMENT=dev:your_deployment_name
```

---

## 3. Configuración de Convex

### Paso 1: Instalar Convex CLI

```bash
npm install -g convex
```

### Paso 2: Login a Convex

```bash
npx convex login
```

Esto abrirá tu navegador para autenticarte.

### Paso 3: Inicializar Proyecto

```bash
# Desde la raíz del proyecto
npx convex dev
```

Esto:
1. Crea un nuevo proyecto en Convex
2. Genera `convex/_generated/` con tipos
3. Despliega tus schemas
4. Te da la URL de Convex

### Paso 4: Copiar URL de Convex

Después de `npx convex dev`, verás:

```
✔ Deployment URL: https://happy-animal-123.convex.cloud
```

Copia esta URL y agrégala a:
- `frontend/.env.local` → `NEXT_PUBLIC_CONVEX_URL`
- `backend/.env` → `CONVEX_URL`

### Paso 5: Verificar Schemas

```bash
# El comando convex dev ya deployó los schemas
# Verifica en https://dashboard.convex.dev
```

Deberías ver 6 tablas:
- ✅ users
- ✅ projects
- ✅ files
- ✅ aiRequests
- ✅ deployments
- ✅ collaborators

---

## 4. Configuración de Clerk

### Paso 1: Crear Proyecto

1. Ve a https://clerk.com
2. Clic en "Add application"
3. Nombre: "AUTOCREA"
4. Selecciona: Email, Google, GitHub (opcional)

### Paso 2: Obtener API Keys

En el Dashboard de Clerk:

```
Settings → API Keys
```

Copia:
- **Publishable key** (empieza con `pk_test_`)
- **Secret key** (empieza con `sk_test_`)

### Paso 3: Configurar URLs

En Clerk Dashboard:

```
Settings → Paths
```

Configura:
- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in: `/dashboard`
- After sign-up: `/dashboard`

### Paso 4: Configurar Webhooks (Opcional)

Para sincronizar usuarios con Convex:

```
Webhooks → Add Endpoint

URL: https://your-backend.railway.app/api/webhooks/clerk
Events: user.created, user.updated, user.deleted
```

---

## 5. Configuración de Stripe

### Paso 1: Crear Cuenta

1. Ve a https://stripe.com
2. Crea cuenta
3. Activa modo test

### Paso 2: Crear Productos

En Stripe Dashboard → Products → Add Product:

**Producto 1: Free Trial**
```
Name: Free Trial
Price: $0/month
Features: 3 projects, 100 AI requests, 500MB storage
```

**Producto 2: Creator**
```
Name: Creator
Price: $29/month
Features: 10 projects, 500 AI requests, 5GB storage
```

**Producto 3: Pro**
```
Name: Pro
Price: $79/month
Features: Unlimited projects, 2000 AI requests, 20GB storage
```

**Producto 4: Enterprise**
```
Name: Enterprise
Price: Custom
Features: Todo incluido + soporte prioritario
```

### Paso 3: Integrar con Clerk

En Clerk Dashboard:

```
Integrations → Stripe → Connect

Test Mode: Enabled
```

Esto sincroniza automáticamente suscripciones entre Clerk y Stripe.

---

## 6. Configuración de Claude AI

### Paso 1: Obtener API Key

1. Ve a https://console.anthropic.com
2. Crea una cuenta
3. Ve a "API Keys"
4. Clic en "Create Key"
5. Copia la key (empieza con `sk-ant-`)

### Paso 2: Configurar

Agrega a `backend/.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
AI_MODEL=claude-3-5-sonnet-20241022
```

### Paso 3: Probar

```bash
cd backend
npm run dev

# En otro terminal
curl http://localhost:8000/api/ai/generate \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "generate",
    "prompt": "Create a React button component"
  }'
```

---

## 7. Configuración de Providers de Deployment

### A. Vercel (Opcional)

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Obtener token
vercel tokens create autocrea
```

Agrega a `backend/.env`:
```bash
VERCEL_TOKEN=your_token_here
```

### B. Netlify (Ya configurado para frontend)

Para deployments automáticos desde AUTOCREA:

1. Ve a https://app.netlify.com
2. User settings → Applications → Personal access tokens
3. "New access token"
4. Nombre: "AUTOCREA Backend"
5. Copia el token

Agrega a `backend/.env`:
```bash
NETLIFY_TOKEN=your_token_here
```

### C. Railway (Para backend en producción)

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Obtener token
railway tokens
```

Agrega a `backend/.env`:
```bash
RAILWAY_TOKEN=your_token_here
```

---

## 8. Iniciar el Proyecto Localmente

### Paso 1: Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm install

# Esto instalará deps de frontend, backend y root
```

### Paso 2: Iniciar Convex

```bash
# Terminal 1
npx convex dev
```

Deja este terminal abierto. Convex necesita estar corriendo.

### Paso 3: Iniciar Backend

```bash
# Terminal 2
cd backend
npm run dev
```

Deberías ver:
```
🚀 AUTOCREA Backend Server running on port 8000
📡 Environment: development
🔗 API: http://localhost:8000/api
💚 Health: http://localhost:8000/health
🔌 WebSocket: ws://localhost:8000
```

### Paso 4: Iniciar Frontend

```bash
# Terminal 3
cd frontend
npm run dev
```

Deberías ver:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
✓ Ready in 5s
```

### Paso 5: Verificar

Abre http://localhost:3000

Deberías ver:
- ✅ Landing page de AUTOCREA
- ✅ Botones de Sign In / Sign Up funcionales
- ✅ Dashboard accesible después de login
- ✅ Editor de código con terminal
- ✅ AI assistant funcionando

---

## 9. Deployment a Producción

### A. Frontend (Netlify)

#### Opción 1: Desde GitHub (Recomendado)

Ya está configurado! Solo:

1. Push a GitHub → Netlify auto-deploya
2. Configura variables de entorno en Netlify:

```
Netlify Dashboard → Site Settings → Environment Variables

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CONVEX_URL=https://your-prod.convex.cloud
NEXT_PUBLIC_APP_URL=https://autocrea.netlify.app
NODE_ENV=production
```

#### Opción 2: Manual

```bash
cd frontend
npm run build
netlify deploy --prod
```

### B. Backend (Railway)

#### Paso 1: Crear Proyecto

```bash
railway login
railway init
```

#### Paso 2: Configurar Variables

En Railway Dashboard → Variables:

```
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.netlify.app
CLERK_SECRET_KEY=sk_live_...
CONVEX_URL=https://your-prod.convex.cloud
ANTHROPIC_API_KEY=sk-ant-...
```

#### Paso 3: Deploy

```bash
cd backend
git push railway main
```

O desde la raíz:

```bash
railway up
```

### C. Convex (Producción)

```bash
# Deploy a producción
npx convex deploy --prod

# Obtener URL de producción
# La verás en el output: https://your-prod-name.convex.cloud
```

Actualiza las URLs en:
- Frontend env vars (Netlify)
- Backend env vars (Railway)

---

## ✅ Checklist de Verificación

### Desarrollo Local

- [ ] Node.js 20+ instalado
- [ ] Todas las cuentas creadas (Clerk, Convex, Anthropic, Stripe)
- [ ] Variables de entorno configuradas
- [ ] `npx convex dev` corriendo
- [ ] Backend corriendo en :8000
- [ ] Frontend corriendo en :3000
- [ ] Puedes hacer login
- [ ] Dashboard carga correctamente
- [ ] Editor funciona
- [ ] Terminal funciona
- [ ] AI assistant responde

### Producción

- [ ] Netlify deployado y funcionando
- [ ] Railway deployado y funcionando
- [ ] Convex en modo producción
- [ ] Clerk en modo producción (keys `pk_live_`, `sk_live_`)
- [ ] Stripe en modo live
- [ ] URLs de producción configuradas
- [ ] Webhooks configurados
- [ ] SSL/HTTPS funcionando
- [ ] Monitoring configurado (Sentry, LogRocket, etc.)

---

## 🆘 Troubleshooting

### Error: "Convex not connected"

```bash
# Verifica que convex dev esté corriendo
ps aux | grep convex

# Reinicia
npx convex dev
```

### Error: "Unauthorized" en API calls

Verifica que:
1. Clerk esté configurado correctamente
2. El token se envíe en headers: `Authorization: Bearer <token>`
3. Las API keys sean correctas

### Error: "AI request failed"

Verifica:
1. `ANTHROPIC_API_KEY` esté configurada
2. Tengas créditos en Anthropic
3. El modelo esté correcto: `claude-3-5-sonnet-20241022`

### Frontend no conecta con Backend

Verifica:
1. `NEXT_PUBLIC_APP_URL` apunte al frontend correcto
2. `FRONTEND_URL` en backend apunte al frontend
3. CORS esté configurado correctamente
4. Ambos usen HTTPS en producción

---

## 📚 Recursos Adicionales

- [Documentación Completa](./README.md)
- [Guía de Fase 3](./PHASE_3_EXPLAINED.md)
- [Arquitectura Backend](./PHASE_3_BACKEND.md)
- [Guía de Deployment](./NETLIFY_DEPLOYMENT_GUIDE.md)

---

**Actualizado:** 2025-01-27
**Versión:** 1.0.0
**Mantenido por:** AUTOCREA Team
