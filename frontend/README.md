# AUTOCREA Frontend

Frontend de AUTOCREA - Plataforma de desarrollo web con IA, construida con Next.js 14, TypeScript y Tailwind CSS.

## Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Editor:** Monaco Editor
- **Terminal:** Xterm.js
- **Estado:** Zustand + React Query
- **Auth:** Clerk
- **Database:** Convex

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rutas de autenticación
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (dashboard)/       # Dashboard principal
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── settings/
│   │   │   └── billing/
│   │   ├── (editor)/          # Editor de código
│   │   │   └── editor/[id]/
│   │   ├── api/               # API Routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/            # Componentes React
│   │   ├── ui/               # shadcn/ui components
│   │   ├── editor/           # Monaco Editor wrapper
│   │   ├── terminal/         # Terminal component
│   │   ├── dashboard/        # Dashboard components
│   │   ├── layout/           # Layout components
│   │   └── shared/           # Componentes compartidos
│   ├── lib/                  # Utilities y helpers
│   │   ├── utils.ts
│   │   ├── clerk.ts
│   │   ├── convex.ts
│   │   └── api.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── use-projects.ts
│   │   ├── use-editor.ts
│   │   └── use-terminal.ts
│   ├── stores/               # Zustand stores
│   │   ├── editor-store.ts
│   │   ├── terminal-store.ts
│   │   └── ui-store.ts
│   └── types/                # TypeScript types
│       ├── project.ts
│       ├── file.ts
│       └── user.ts
├── public/                    # Assets estáticos
└── package.json
```

## Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y configura tus credenciales:

```bash
cp .env.example .env.local
```

Configurar:
- Clerk keys (autenticación)
- Convex URL (base de datos)
- Stripe keys (billing)
- Backend API URL

### 3. Inicializar shadcn/ui

```bash
npx shadcn-ui@latest init
```

Configuración recomendada:
- Style: Default
- Base color: Slate
- CSS variables: Yes

### 4. Agregar Componentes shadcn/ui

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add command
npx shadcn-ui@latest add skeleton
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo (localhost:3000)

# Producción
npm run build            # Construye la aplicación para producción
npm start                # Inicia servidor de producción

# Calidad de código
npm run lint             # Ejecuta ESLint
npm run type-check       # Verifica tipos de TypeScript
npm run format           # Formatea código con Prettier
```

## Design System

### Paleta de Colores

```css
/* Principales */
--navy: #0A1628           /* Background principal */
--deep-black: #000000     /* Elementos de contraste */
--electric: #0066FF       /* Acciones primarias */
--cyber: #00D4FF          /* Acentos y hover */

/* Secundarios */
--dark-gray: #1A2C48      /* Cards */
--medium-gray: #2D3748    /* Borders */
--light-gray: #E2E8F0     /* Texto secundario */
```

### Componentes UI

- **Botones:** Primary, Secondary, Outline con efectos hover
- **Cards:** Glass-morphism effect con borders sutiles
- **Inputs:** Focus states destacados con glow effect
- **Modales:** Backdrop blur con animaciones suaves

## Rutas Principales

### Públicas
- `/` - Landing page
- `/sign-in` - Inicio de sesión
- `/sign-up` - Registro

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal
- `/projects` - Lista de proyectos
- `/editor/[id]` - Editor de código
- `/settings` - Configuración de usuario
- `/billing` - Planes y facturación

## Integraciones

### Clerk (Autenticación)
```typescript
import { ClerkProvider } from '@clerk/nextjs';

// Componentes de Clerk:
// - <SignIn />
// - <SignUp />
// - <UserButton />
// - <SignedIn />
// - <SignedOut />
```

### Convex (Base de Datos)
```typescript
import { ConvexProvider } from 'convex/react';
import { useQuery, useMutation } from 'convex/react';

// Queries
const projects = useQuery(api.projects.list);

// Mutations
const createProject = useMutation(api.projects.create);
```

### Monaco Editor
```typescript
import Editor from '@monaco-editor/react';

<Editor
  height="100vh"
  defaultLanguage="javascript"
  theme="vs-dark"
  value={code}
  onChange={handleChange}
/>
```

### Xterm.js (Terminal)
```typescript
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
```

## Features Implementadas

### Fase 1 (Fundación)
- [x] Estructura del proyecto
- [x] Configuración de TypeScript
- [x] Configuración de Tailwind CSS
- [x] Design System base
- [x] Variables de entorno

### Fase 2 (UI/UX - En Progreso)
- [ ] Landing page
- [ ] Autenticación con Clerk
- [ ] Dashboard principal
- [ ] Editor de código (Monaco)
- [ ] Terminal integrada (Xterm)
- [ ] Sistema de navegación
- [ ] Componentes UI base

### Fase 3+ (Futuro)
- [ ] Sistema de proyectos completo
- [ ] Integración con JoxCoder AI
- [ ] Auto-deployment
- [ ] Colaboración en tiempo real
- [ ] Testing y optimización

## Deployment (Netlify)

### Configuración en Netlify

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `20.x`

2. **Environment Variables:**
   Configurar todas las variables del `.env.example` en Netlify Dashboard

3. **Redirects:**
   Crear archivo `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Deploy con CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Troubleshooting

### Error: Monaco Editor no carga
```bash
# Verificar configuración de webpack en next.config.js
# Asegurarse que fallback está configurado para fs, net, tls
```

### Error: Clerk no encuentra las variables
```bash
# Verificar que las variables empiecen con NEXT_PUBLIC_
# Reiniciar el servidor de desarrollo
```

### Error: Convex connection failed
```bash
# Verificar NEXT_PUBLIC_CONVEX_URL
# Ejecutar: npx convex dev
```

## Recursos Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Clerk Documentation](https://clerk.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Monaco Editor](https://microsoft.github.io/monaco-editor)

## Soporte

Para reportar problemas o solicitar features:
- Email: support@joxai.org
- Web: https://joxai.org

---

**Desarrollado por JoxAI** 🚀
