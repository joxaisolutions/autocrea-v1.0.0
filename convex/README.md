# Convex Database Configuration

Este directorio contiene la configuración de la base de datos Convex para AUTOCREA.

## Estructura

- `schema.ts` - Define los esquemas de todas las tablas
- `users.ts` - Queries y mutations para usuarios
- `projects.ts` - Queries y mutations para proyectos
- `files.ts` - Queries y mutations para archivos
- `subscriptions.ts` - Queries y mutations para suscripciones y billing
- `logs.ts` - Queries y mutations para logs del sistema

## Setup

1. Instalar Convex CLI:
```bash
npm install -g convex
```

2. Inicializar Convex:
```bash
npx convex dev
```

3. Configurar variables de entorno en Convex Dashboard:
   - Clerk Publishable Key
   - Clerk Secret Key
   - Stripe Secret Key

## Schemas

### Users
- id: string (Clerk user ID)
- email: string
- name: string
- avatarUrl: string (opcional)
- plan: "free" | "pro" | "enterprise"
- createdAt: number
- updatedAt: number

### Projects
- id: string (auto)
- userId: string
- name: string
- description: string (opcional)
- template: string (opcional)
- framework: string
- language: string
- status: "active" | "archived" | "deleted"
- lastDeployedAt: number (opcional)
- createdAt: number
- updatedAt: number

### Files
- id: string (auto)
- projectId: string
- path: string
- content: string
- language: string
- size: number
- createdAt: number
- updatedAt: number

### Subscriptions
- id: string (auto)
- userId: string
- plan: "free" | "pro" | "enterprise"
- status: "active" | "cancelled" | "expired"
- stripeCustomerId: string (opcional)
- stripeSubscriptionId: string (opcional)
- currentPeriodEnd: number (opcional)
- createdAt: number
- updatedAt: number

### Logs
- id: string (auto)
- userId: string
- projectId: string (opcional)
- type: "error" | "warning" | "info" | "success"
- message: string
- metadata: object (opcional)
- createdAt: number

## Queries y Mutations

Todas las queries y mutations están protegidas con autenticación de Clerk.

Ver archivos individuales para documentación detallada de cada función.
