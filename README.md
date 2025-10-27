# AUTOCREA v1.0.0

**AI-Powered Web Development Platform by JoxAI**

AUTOCREA es una plataforma de desarrollo web asistida por IA que permite crear aplicaciones completas (0-100) sin escribir código. Potenciada por JoxCoder, nuestro modelo de IA especializado en generación de código.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

---

## Características Principales

- **Editor de Código Web** - Monaco Editor con resaltado de sintaxis
- **Generación de Código con IA** - Powered by JoxCoder
- **Terminal Integrada** - Xterm.js para ejecución de comandos
- **Sistema de Proyectos** - Gestión completa de proyectos
- **Auto-Deployment** - Deploy con un click a Vercel, Netlify, Railway
- **Sistema de Logs** - Tracking completo de ejecuciones
- **Testing Automatizado** - Unit y integration testing
- **Planes de Suscripción** - Free Trial, Pro, Enterprise

---

## Stack Tecnológico

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Monaco Editor
- Xterm.js
- Zustand + React Query
- Clerk (Auth)

### Backend
- Node.js 20+
- Express.js
- Socket.io
- Docker (sandbox)
- TypeScript

### Database
- Convex (real-time, serverless)

### Deployment
- Frontend: Netlify
- Backend: Railway
- Database: Convex Cloud

### AI
- JoxCoder v1.0.0 (modelo propietario)

---

## Estructura del Proyecto

```
autocrea-v1.0.0/
├── frontend/          # Next.js application
├── backend/           # Express API + WebSocket
├── convex/            # Convex database schemas
├── docs/              # Documentación
├── .github/           # GitHub Actions (CI/CD)
├── MASTER_PLAN.md     # Plan maestro de desarrollo
├── QUICK_START.md     # Guía de inicio rápido
└── README.md          # Este archivo
```

---

## Quick Start

Ver [QUICK_START.md](./QUICK_START.md) para instrucciones detalladas de setup.

### Instalación Rápida

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd autocrea-v1.0.0

# 2. Instalar dependencias
npm run install:all

# 3. Configurar variables de entorno
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# 4. Iniciar desarrollo
npm run dev
```

---

## Desarrollo

### Scripts Principales

```bash
# Desarrollo (frontend + backend)
npm run dev

# Solo frontend
npm run dev:frontend

# Solo backend
npm run dev:backend

# Build para producción
npm run build

# Linting
npm run lint

# Type checking
npm run type-check

# Formateo de código
npm run format
```

### URLs de Desarrollo

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend WS: ws://localhost:8000

---

## Fases de Desarrollo

### ✅ Fase 1: Fundación y Arquitectura (Completada)
- Estructura del proyecto
- Configuraciones base
- Design system
- README y documentación

### 🔄 Fase 2: Frontend - UI/UX (En Progreso)
- Landing page
- Autenticación con Clerk
- Dashboard principal
- Editor de código
- Terminal integrada

### ⏳ Fase 3: Backend - APIs
- REST API endpoints
- WebSocket handlers
- Code execution sandbox
- File system management

### ⏳ Fase 4: Base de Datos y Auth
- Convex schemas
- Clerk integration
- Stripe billing
- Plan management

### ⏳ Fase 5: AI Integration y Deployment
- JoxCoder integration
- Auto-deployment
- Testing completo
- Production deployment

---

## Design System

### Paleta de Colores

```css
/* Azul Marino + Negro Intenso */
--navy: #0A1628           /* Background principal */
--deep-black: #000000     /* Contraste */
--electric: #0066FF       /* Primario */
--cyber: #00D4FF          /* Acento */
```

### Tipografía

- **Display/Body:** Inter
- **Code:** JetBrains Mono

---

## Planes y Pricing

### Free Trial
- 3 proyectos
- 100 AI requests/mes
- 500MB storage
- Deployments básicos

### Pro ($19/mes)
- Proyectos ilimitados
- 1000 AI requests/mes
- 10GB storage
- Deployments avanzados
- Soporte prioritario

### Enterprise ($99/mes)
- Todo de Pro
- AI requests ilimitados
- 100GB storage
- Colaboración en tiempo real
- API access
- Soporte dedicado

---

## Documentación

### General
- [Master Plan](./MASTER_PLAN.md) - Plan maestro de desarrollo
- [Quick Start](./QUICK_START.md) - Guía de inicio rápido

### Por Componente
- [Frontend Guide](./frontend/README.md)
- [Backend Guide](./backend/README.md)
- [Convex Guide](./convex/README.md)

### Guías de Integración (docs/)
- JoxCoder Integration
- Deployment Guide
- API Reference

---

## Seguridad

- ✅ Autenticación con Clerk
- ✅ Rate limiting por plan
- ✅ Sandbox aislado (Docker)
- ✅ Input validation (Zod)
- ✅ CORS configurado
- ✅ Headers de seguridad (Helmet)
- ✅ Environment variables

---

## Testing

```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Coverage
npm run test:coverage
```

---

## Deployment

### Frontend (Netlify)

```bash
# Build
cd frontend && npm run build

# Deploy
netlify deploy --prod
```

### Backend (Railway)

```bash
# Build
cd backend && npm run build

# Deploy
railway up
```

### Database (Convex)

```bash
# Deploy schemas
npx convex deploy
```

Ver [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) para más detalles.

---

## Roadmap

### v1.0.0 (Actual)
- Core features
- JoxCoder integration
- Basic deployment

### v1.1.0
- Colaboración en tiempo real
- Git integration
- Debugging avanzado

### v1.2.0
- Marketplace de templates
- Extensiones y plugins
- Mobile app (React Native)

### v2.0.0
- VS Code extension
- Self-hosted option
- Enterprise features

---

## Contribución

Este es un proyecto propietario de JoxAI. Para contribuir:

1. Contactar a support@joxai.org
2. Firmar NDA
3. Seguir guidelines de desarrollo

---

## Licencia

**Proprietary License - JoxAI**

Este código es propiedad de JoxAI y está protegido por derechos de autor.
No se permite su uso, distribución o modificación sin autorización explícita.

---

## Soporte

### Contacto
- **Email:** support@joxai.org
- **Web:** https://joxai.org
- **Web (Alt):** https://joxai.site

### Reportar Issues
Para reportar bugs o solicitar features, contactar al equipo de desarrollo.

---

## Equipo

**Desarrollado por JoxAI**

Empresa especializada en soluciones de IA para desarrollo de software.

- Web: https://joxai.org
- Twitter: @joxai
- LinkedIn: /company/joxai

---

## Acknowledgments

- Inspirado en Replit
- Powered by JoxCoder AI
- Built with Next.js, Express, Convex
- Deployed on Netlify & Railway

---

**AUTOCREA v1.0.0** - Transformando ideas en aplicaciones con IA 🚀