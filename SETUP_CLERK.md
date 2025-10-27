# Configuración Rápida de Clerk para AUTOCREA

## Paso 1: Crear Cuenta en Clerk

1. Ve a: https://clerk.com
2. Click en "Start building for free"
3. Crea tu cuenta (puedes usar GitHub o email)

## Paso 2: Crear Aplicación

1. Una vez dentro del dashboard, click en "Create application"
2. Nombre de la aplicación: **AUTOCREA**
3. Habilitar providers de autenticación:
   - ✅ Email
   - ✅ Google (opcional)
   - ✅ GitHub (opcional)
4. Click en "Create application"

## Paso 3: Obtener API Keys

1. En el dashboard de tu aplicación, ve a la sección **"API Keys"** (menú lateral)
2. Verás dos keys importantes:

   - **Publishable key** (empieza con `pk_test_`)
   - **Secret key** (empieza con `sk_test_`)

3. Copia estas keys

## Paso 4: Configurar Variables de Entorno

1. Abre el archivo `frontend/.env.local` que ya creé
2. Pega tus keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_tu_key_aqui
CLERK_SECRET_KEY=sk_test_tu_key_aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuYXV0b2NyZWEuZGV2JA
CLERK_SECRET_KEY=sk_test_abcdefghijklmnopqrstuvwxyz123456
```

## Paso 5: Configurar URLs en Clerk Dashboard

1. En Clerk Dashboard, ve a **"Paths"** (menú lateral)
2. Configura las siguientes URLs:

   - **Sign-in URL:** `/sign-in`
   - **Sign-up URL:** `/sign-up`
   - **After sign-in URL:** `/dashboard`
   - **After sign-up URL:** `/dashboard`
   - **Home URL:** `/`

3. Guarda los cambios

## Paso 6: Reiniciar el Servidor de Desarrollo

1. Detén el servidor (Ctrl + C en la terminal)
2. Reinicia:

```bash
cd frontend
npm run dev
```

## Paso 7: Probar la Autenticación

1. Ve a: http://localhost:3000
2. Click en "Sign Up" o "Get Started"
3. Crea una cuenta de prueba
4. Deberías ser redirigido a `/dashboard`

## ¡Listo! 🎉

Ahora AUTOCREA funciona completamente con autenticación.

---

## Troubleshooting

### Error: "Missing publishableKey"
- Verifica que copiaste las keys correctamente en `.env.local`
- Asegúrate que las keys empiecen con `pk_test_` y `sk_test_`
- Reinicia el servidor después de agregar las keys

### Error: "Invalid key"
- Verifica que no haya espacios extra al inicio o final de las keys
- Copia de nuevo desde Clerk Dashboard

### Error: "Redirect loop"
- Verifica que las URLs en Clerk Dashboard coincidan:
  - Sign-in: `/sign-in`
  - Sign-up: `/sign-up`
  - After sign-in: `/dashboard`

---

## Alternativa: Modo de Prueba Sin Clerk

Si quieres ver el frontend sin configurar Clerk aún, puedes comentar temporalmente el middleware:

1. Abre `frontend/src/middleware.ts`
2. Comenta todo el contenido:

```typescript
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// ... resto del código comentado
export default function middleware() {
  // Temporalmente deshabilitado
}
```

3. Reinicia el servidor

**Nota:** Esto es solo para pruebas. Sin Clerk, no podrás acceder a rutas protegidas.

---

**Soporte:** Si tienes problemas, revisa https://clerk.com/docs
