# 🚀 AUTOCREA - Guía de Deployment en Netlify

**Última actualización**: 27 de Octubre, 2025
**Versión**: v1.0.0
**Frontend**: Next.js 14.2.33

---

## 📋 Pre-requisitos

Antes de hacer el deployment, asegúrate de tener:

- ✅ Cuenta en [Netlify](https://www.netlify.com/)
- ✅ Repositorio Git (GitHub, GitLab, o Bitbucket)
- ✅ Clerk API keys (para autenticación)
- ✅ Convex deployment URL (cuando esté listo el backend)
- ✅ Frontend compilando sin errores localmente

---

## 🔧 Paso 1: Preparar el Proyecto

### 1.1 Crear archivo de configuración de Netlify

El archivo `netlify.toml` ya está incluido en el proyecto, pero verifica que tenga esta configuración:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 1.2 Verificar que el build funciona localmente

```bash
cd frontend
npm run build
```

**Esperado**: Build exitoso sin errores.

---

## 🌐 Paso 2: Configurar Variables de Entorno en Netlify

### 2.1 Variables Requeridas

En Netlify Dashboard → Site settings → Environment variables, agrega:

#### **Variables de Clerk (Autenticación)**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# URLs de Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### **Variables de Convex (Base de Datos)**

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=prod:xxxxxxxxxxxxxxxxxxxxx
```

#### **Variables de Producción**

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://autocrea.netlify.app
```

### 2.2 Obtener las API Keys

#### Clerk Keys:
1. Ve a [Clerk Dashboard](https://dashboard.clerk.com/)
2. Selecciona tu aplicación
3. Ve a "API Keys"
4. Copia las keys de **Production**

#### Convex URL:
1. Ve a [Convex Dashboard](https://dashboard.convex.dev/)
2. Selecciona tu proyecto
3. Copia la Production URL
4. Genera un Deploy Key para Netlify

---

## 📦 Paso 3: Deployment desde Git

### Opción A: Desde GitHub (Recomendado)

1. **Push tu código a GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Conectar con Netlify**:
   - Ve a [Netlify](https://app.netlify.com/)
   - Click en "Add new site" → "Import an existing project"
   - Selecciona "GitHub" y autoriza
   - Selecciona el repositorio `autocrea-v1.0.0`

3. **Configurar Build Settings**:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/.next
   ```

4. **Deploy**:
   - Click en "Deploy site"
   - Netlify automáticamente hará build y deploy

### Opción B: Deployment Manual (CLI)

1. **Instalar Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login en Netlify**:
   ```bash
   netlify login
   ```

3. **Inicializar el sitio**:
   ```bash
   cd frontend
   netlify init
   ```
   - Selecciona "Create & configure a new site"
   - Elige tu team
   - Nombre del sitio: `autocrea-v1`

4. **Build y Deploy**:
   ```bash
   npm run build
   netlify deploy --prod
   ```

---

## ⚙️ Paso 4: Configuración Post-Deployment

### 4.1 Configurar Dominio Personalizado (Opcional)

1. En Netlify Dashboard → Domain settings
2. Click en "Add custom domain"
3. Ingresa tu dominio: `autocrea.com`
4. Sigue las instrucciones para configurar DNS

### 4.2 Habilitar HTTPS

Netlify habilita HTTPS automáticamente con Let's Encrypt.
Verifica en: Site settings → Domain management → HTTPS

### 4.3 Configurar Redirects para Next.js

Ya está incluido en `netlify.toml`, pero verifica que funcione:
- Todas las rutas deben servir la app de Next.js
- Las rutas dinámicas (`/editor/[id]`) deben funcionar

---

## 🔍 Paso 5: Verificación

### 5.1 Checklist de Verificación

- [ ] El sitio carga en la URL de Netlify
- [ ] Landing page (`/`) funciona correctamente
- [ ] Sign In (`/sign-in`) y Sign Up (`/sign-up`) funcionan
- [ ] Dashboard (`/dashboard`) carga después del login
- [ ] Editor (`/editor/demo`) funciona con Monaco y Terminal
- [ ] Settings (`/settings`) carga todos los formularios
- [ ] Billing (`/billing`) muestra los planes correctos
- [ ] No hay errores en la consola del navegador
- [ ] Las imágenes y assets cargan correctamente
- [ ] El CSS y Tailwind funcionan

### 5.2 Testing de Rutas

Prueba estas URLs en producción:

```
https://your-site.netlify.app/
https://your-site.netlify.app/sign-in
https://your-site.netlify.app/dashboard
https://your-site.netlify.app/projects
https://your-site.netlify.app/editor/demo
https://your-site.netlify.app/settings
https://your-site.netlify.app/billing
```

---

## 🐛 Troubleshooting

### Error: "Module not found"

**Causa**: Dependencias no instaladas en Netlify.

**Solución**:
```bash
# Verifica que package.json incluya todas las dependencias
npm install
npm run build  # Verifica que compile localmente
```

### Error: "Environment variables not found"

**Causa**: Variables de entorno no configuradas en Netlify.

**Solución**:
1. Ve a Site settings → Environment variables
2. Agrega TODAS las variables requeridas
3. Redeploy: Deploys → Trigger deploy → Deploy site

### Error: "404 on page refresh"

**Causa**: Falta configuración de redirects.

**Solución**: Verifica que `netlify.toml` tenga:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Error: "Build failed"

**Causa**: Error de compilación de TypeScript o ESLint.

**Solución**:
```bash
# Prueba el build localmente
cd frontend
npm run build

# Si hay errores, corrígelos antes de deploy
npm run lint
```

### Error: Clerk "Invalid publishable key"

**Causa**: Keys de desarrollo en producción.

**Solución**:
1. Usa las keys de **Production** de Clerk, no las de test
2. Verifica que `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` empiece con `pk_live_`
3. Redeploy después de cambiar las keys

---

## 🔄 Continuous Deployment

### Auto-deploy desde Git

Netlify automáticamente hace deploy cuando haces push a la rama principal:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Netlify detecta el push y automáticamente:
1. Hace pull del código
2. Ejecuta `npm install`
3. Ejecuta `npm run build`
4. Publica el nuevo build

### Deploy Previews

Para cada Pull Request, Netlify crea un preview deployment:
- URL única para testing: `deploy-preview-X--autocrea.netlify.app`
- Testing aislado antes de merge a main
- Comentarios automáticos en el PR con la URL

---

## 📊 Performance Optimization

### 1. Configurar Build Plugins

En `netlify.toml`, agrega plugins:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"

[[plugins]]
  package = "netlify-plugin-cache-nextjs"
```

### 2. Configurar Headers para Cache

```toml
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"
```

### 3. Optimizar Build Time

```bash
# En package.json, agrega script de build optimizado
"scripts": {
  "build": "next build",
  "build:netlify": "NODE_ENV=production next build"
}
```

---

## 🔐 Seguridad

### 1. Variables de Entorno Seguras

- ⚠️ **NUNCA** hagas commit de `.env.local` o `.env.production`
- ✅ Usa las Environment Variables de Netlify
- ✅ Usa prefijo `NEXT_PUBLIC_` solo para variables del cliente
- ✅ Keys secretas (como `CLERK_SECRET_KEY`) sin el prefijo

### 2. Configurar Security Headers

Ya incluido en `netlify.toml`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 3. Configurar CSP (Content Security Policy)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.autocrea.com; style-src 'self' 'unsafe-inline';"
```

---

## 📈 Monitoring

### 1. Netlify Analytics

Activa en: Site settings → Analytics → Enable

Métricas disponibles:
- Pageviews
- Unique visitors
- Top pages
- Bandwidth usage

### 2. Logs

Ver logs de build y deploy:
- Deploys → Click en un deploy → Build logs
- Útil para debugging de errores

### 3. Forms (si usas Netlify Forms)

Netlify puede capturar form submissions sin backend:
```html
<form name="contact" method="POST" data-netlify="true">
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</form>
```

---

## 💰 Pricing

### Free Tier (Suficiente para empezar)
- 100GB bandwidth/mes
- 300 build minutos/mes
- Deploy ilimitados
- HTTPS incluido

### Pro Tier ($19/mes)
- 400GB bandwidth/mes
- 1000 build minutos/mes
- Analytics
- Password protection
- Role-based access

---

## 🚀 Comandos Rápidos

```bash
# Build local
cd frontend && npm run build

# Deploy manual
netlify deploy --prod

# Ver logs
netlify logs

# Abrir dashboard
netlify open

# Ver status
netlify status

# Link a un sitio existente
netlify link
```

---

## 📞 Soporte

### Recursos Útiles

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify Community](https://answers.netlify.com/)
- [Status Page](https://www.netlifystatus.com/)

### Contacto

- Discord de Netlify
- Twitter: @Netlify
- Support tickets (Pro tier)

---

## ✅ Checklist Final

Antes de hacer el deployment a producción:

### Código
- [ ] Todo el código está en Git
- [ ] Build funciona sin errores localmente
- [ ] No hay console.errors críticos
- [ ] TypeScript sin errores
- [ ] ESLint passing

### Configuración
- [ ] `netlify.toml` configurado correctamente
- [ ] Variables de entorno en Netlify
- [ ] Clerk keys de producción configuradas
- [ ] Convex URL de producción configurada

### Testing
- [ ] Landing page funciona
- [ ] Autenticación funciona (Sign In/Sign Up)
- [ ] Dashboard carga correctamente
- [ ] Editor funciona con Monaco y Terminal
- [ ] Todas las rutas dinámicas funcionan
- [ ] Mobile responsive

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

### Seguridad
- [ ] HTTPS habilitado
- [ ] Security headers configurados
- [ ] Variables sensibles no expuestas
- [ ] No hay vulnerabilidades críticas (npm audit)

---

## 🎉 Deployment Exitoso

Una vez completados todos los pasos, tu aplicación estará disponible en:

**URL de Netlify**: `https://autocrea-v1.netlify.app`
**Custom Domain** (opcional): `https://autocrea.com`

¡Felicidades! 🚀 Tu frontend de AUTOCREA está en producción.

---

**Desarrollado con ❤️ por JoxAI**
**HP Windows 11 - Claude Code**
