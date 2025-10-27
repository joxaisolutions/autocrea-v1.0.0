# 🔑 Configuración de Clerk y Convex - Guía Paso a Paso

Esta guía te ayudará a configurar la autenticación (Clerk) y la base de datos (Convex) para AUTOCREA.

---

## 📋 Parte 1: Configurar Clerk (Autenticación)

### Paso 1: Crear Cuenta en Clerk

1. Ve a https://clerk.com
2. Haz clic en "Start building for free"
3. Regístrate con tu email o GitHub
4. Verifica tu email

### Paso 2: Crear una Aplicación

1. Una vez dentro del dashboard, haz clic en "+ Create application"
2. Configura la aplicación:
   - **Application name**: `AUTOCREA` (o el nombre que prefieras)
   - **How will your users sign in?**:
     - ✅ Email address
     - ✅ Username (opcional)
     - ✅ Google (recomendado para facilidad)
     - ✅ GitHub (recomendado para desarrolladores)

3. Haz clic en "Create application"

### Paso 3: Obtener las API Keys

Después de crear la app, serás redirigido a la página de API keys.

**IMPORTANTE**: Copia estos valores:

```bash
# Clerk API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXX
CLERK_SECRET_KEY=sk_test_YYYYYYYYYYYY
```

### Paso 4: Configurar el Frontend

1. Crea el archivo de entorno en el frontend:
   ```bash
   # En la raíz del proyecto
   cd frontend
   ```

2. Crea/edita `frontend/.env.local`:
   ```bash
   # Clerk Keys (copia tus keys reales aquí)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXX
   CLERK_SECRET_KEY=sk_test_YYYYYYYYYYYY

   # Clerk URLs (ya configurados, no cambiar)
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

### Paso 5: Configurar Dominios Permitidos en Clerk

1. En el Clerk Dashboard, ve a **"Configure" → "Settings"**
2. Busca **"Allowed origins"** o **"CORS"**
3. Agrega estos dominios:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://localhost:3002`
   - (Más tarde agregarás tu dominio de producción)

### Paso 6: Verificar que Clerk Funciona

1. Asegúrate de que el frontend esté corriendo:
   ```bash
   cd frontend
   npm run dev
   ```

2. Abre tu navegador en http://localhost:3002 (o el puerto que muestre)

3. Haz clic en "Get Started" o "Sign Up"

4. Deberías ver el modal de Clerk para registro

5. **Crea tu primera cuenta de prueba**:
   - Usa tu email
   - Crea un password
   - Verifica el email que te llegue
   - Deberías ser redirigido al dashboard

**✅ Si ves el dashboard después de iniciar sesión, Clerk está funcionando correctamente!**

---

## 📊 Parte 2: Configurar Convex (Base de Datos)

### Paso 1: Instalar Convex CLI

```bash
# En la raíz del proyecto
npm install -g convex
```

### Paso 2: Inicializar Convex en el Proyecto

```bash
# Desde la raíz del proyecto autocrea-v1.0.0
npx convex dev
```

Esto abrirá tu navegador automáticamente para iniciar sesión.

### Paso 3: Crear Cuenta/Proyecto en Convex

Si es tu primera vez usando Convex:

1. El navegador se abrirá en https://dashboard.convex.dev
2. Inicia sesión con GitHub o Google
3. El CLI detectará automáticamente tu login

Convex te preguntará:

```
? Configure a new Convex project in this directory? (Y/n)
```
Responde: **Y** (yes)

```
? Project name:
```
Escribe: **autocrea** (o el nombre que prefieras)

```
? What would you like to configure?
```
Selecciona: **create a new project**

### Paso 4: Desplegar Schemas a Convex

El comando `npx convex dev` automáticamente:

1. ✅ Leerá todos los archivos en `/convex`
2. ✅ Desplegará los schemas (users, projects, files, etc.)
3. ✅ Generará los archivos de tipos TypeScript
4. ✅ Te dará la URL de deployment

Verás algo como:

```
✓ Deployed schema to https://your-project-name.convex.cloud
✓ Generated types in convex/_generated
✓ Convex dev server running on port 3210
```

### Paso 5: Copiar la URL de Convex

Después del deployment, Convex te mostrará tu URL:

```
Deployment URL: https://amazing-butterfly-123.convex.cloud
```

**COPIA ESTA URL** - la necesitarás en el siguiente paso.

### Paso 6: Configurar Variables de Entorno

#### Frontend (.env.local)

Actualiza `frontend/.env.local` agregando:

```bash
# Clerk Keys (ya deberías tenerlas del Paso 4)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXX
CLERK_SECRET_KEY=sk_test_YYYYYYYYYYYY

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex (NUEVA - pega tu URL aquí)
NEXT_PUBLIC_CONVEX_URL=https://tu-proyecto.convex.cloud

# Backend URL (para desarrollo local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)

Crea `backend/.env`:

```bash
# Server
PORT=8000
NODE_ENV=development

# Clerk (usa las mismas keys)
CLERK_SECRET_KEY=sk_test_YYYYYYYYYYYY

# Convex (usa la misma URL)
CONVEX_URL=https://tu-proyecto.convex.cloud

# Frontend URL
FRONTEND_URL=http://localhost:3002

# Anthropic AI (dejaremos esto para después)
ANTHROPIC_API_KEY=sk-ant-ZZZZZZZZZ
AI_MODEL=claude-3-5-sonnet-20241022
```

### Paso 7: Mantener Convex Dev Corriendo

**IMPORTANTE**: Necesitas mantener `npx convex dev` corriendo en una terminal separada.

Abre **3 terminales**:

```bash
# Terminal 1: Convex (déjala corriendo)
cd c:/Users/HP/Desktop/autocrea/autocrea-v1.0.0
npx convex dev

# Terminal 2: Frontend (ya está corriendo)
cd c:/Users/HP/Desktop/autocrea/autocrea-v1.0.0/frontend
npm run dev

# Terminal 3: Backend (iniciaremos después)
cd c:/Users/HP/Desktop/autocrea/autocrea-v1.0.0/backend
npm run dev
```

### Paso 8: Verificar que Convex Funciona

1. Ve a http://localhost:3002/dashboard (debes estar logueado)

2. Abre las **DevTools del navegador** (F12)

3. Ve a la pestaña **Console**

4. Deberías ver logs de Convex conectándose:
   ```
   [Convex] Connected to https://tu-proyecto.convex.cloud
   ```

5. Si NO ves errores, Convex está funcionando! ✅

---

## 🧪 Parte 3: Probar la Integración Completa

### Prueba 1: Autenticación con Clerk

1. Ve a http://localhost:3002
2. Haz clic en "Get Started" o "Sign Up"
3. Registra una cuenta nueva
4. Verifica tu email
5. Inicia sesión
6. Deberías ver el dashboard ✅

### Prueba 2: Verificar Usuario en Convex

1. Ve al **Convex Dashboard**: https://dashboard.convex.dev
2. Selecciona tu proyecto "autocrea"
3. Ve a **Data** → **users** table
4. Deberías ver tu usuario recién creado ✅

Si no aparece automáticamente, es porque el código del frontend necesita crear usuarios. Esto lo configuraremos en el siguiente paso.

### Prueba 3: Crear un Proyecto de Prueba

1. En el dashboard de AUTOCREA, haz clic en "+ New Project"
2. Llena los datos:
   - **Name**: "Mi Primer Proyecto"
   - **Framework**: Next.js
   - **Description**: "Prueba de integración"
3. Haz clic en "Create Project"

4. Ve al Convex Dashboard → **Data** → **projects**
5. Deberías ver tu proyecto ✅

---

## ✅ Checklist de Configuración Completada

Marca cada item cuando lo completes:

### Clerk
- [ ] Cuenta en Clerk creada
- [ ] Aplicación "AUTOCREA" creada
- [ ] API Keys copiadas
- [ ] `frontend/.env.local` configurado con Clerk keys
- [ ] Dominios localhost agregados en Clerk Dashboard
- [ ] Puedo registrarme e iniciar sesión en http://localhost:3002

### Convex
- [ ] Convex CLI instalado (`npm install -g convex`)
- [ ] `npx convex dev` ejecutado exitosamente
- [ ] Proyecto en Convex creado
- [ ] Schemas desplegados (users, projects, files, etc.)
- [ ] URL de Convex copiada
- [ ] `frontend/.env.local` actualizado con Convex URL
- [ ] `backend/.env` creado con todas las variables
- [ ] `npx convex dev` corriendo en terminal separada
- [ ] Puedo ver "Connected to Convex" en DevTools

### Testing
- [ ] Puedo iniciar sesión sin errores
- [ ] El dashboard carga correctamente
- [ ] Puedo crear un proyecto (aparece en Convex Dashboard)

---

## 🐛 Troubleshooting

### Error: "Clerk is not loaded"

**Problema**: Las keys de Clerk no están configuradas correctamente.

**Solución**:
1. Verifica que `frontend/.env.local` existe y tiene las keys correctas
2. Reinicia el servidor del frontend (`npm run dev`)
3. Limpia el cache del navegador (Ctrl + Shift + R)

### Error: "Convex client not initialized"

**Problema**: La URL de Convex no está configurada.

**Solución**:
1. Verifica que `NEXT_PUBLIC_CONVEX_URL` esté en `frontend/.env.local`
2. Asegúrate de que `npx convex dev` esté corriendo
3. Reinicia el frontend

### Convex no sincroniza datos

**Problema**: `npx convex dev` no está corriendo o hay un error en los schemas.

**Solución**:
1. Ve a la terminal donde corre `npx convex dev`
2. Busca errores en rojo
3. Si hay errores de schema, revisa `/convex/schema.ts`
4. Reinicia `npx convex dev`

### No puedo crear proyectos

**Problema**: Puede que las mutations de Convex no estén desplegadas.

**Solución**:
1. En el Convex Dashboard, ve a **Functions**
2. Deberías ver funciones como:
   - `projects:create`
   - `projects:list`
   - `users:create`
3. Si no aparecen, reinicia `npx convex dev`

---

## 📚 Siguientes Pasos

Una vez que Clerk y Convex estén funcionando:

1. **Configurar Anthropic AI** (para generación de código)
2. **Iniciar el Backend** (para API y servicios)
3. **Probar el Editor de Código** con AI
4. **Probar el Terminal** integrado
5. **Probar Deployments** (Vercel/Netlify/Railway)

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Revisa los logs en las terminales
2. Abre DevTools (F12) y busca errores en Console
3. Verifica que todas las variables de entorno estén correctas
4. Asegúrate de que los 3 servicios estén corriendo:
   - Frontend (puerto 3002)
   - Convex (background)
   - Backend (puerto 8000, cuando lo inicies)

**¡Cuando completes esta configuración, tendrás autenticación y base de datos funcionando! 🎉**

---

**Última actualización**: 2025-01-27
**Estado**: Listo para configurar
