# 🚀 AUTOCREA v1.0.0 - Production Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables Setup](#environment-variables)
3. [Railway Backend Deployment](#railway-deployment)
4. [Netlify Frontend Deployment](#netlify-deployment)
5. [Convex Production Setup](#convex-production)
6. [GitHub Secrets Configuration](#github-secrets)
7. [Post-Deployment Verification](#verification)
8. [Monitoring & Logging](#monitoring)

---

## Prerequisites

Before deploying to production, ensure:

- ✅ All tests passing locally
- ✅ Environment variables configured
- ✅ Clerk in production mode
- ✅ Stripe in live mode
- ✅ Anthropic API key with credits
- ✅ Railway, Netlify, Convex accounts created
- ✅ GitHub repository set up

---

## Environment Variables

### Backend (Railway)

```bash
# Server
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-app.netlify.app

# Authentication (Clerk - Production Keys)
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

# Database (Convex - Production)
CONVEX_URL=https://your-prod.convex.cloud
CONVEX_DEPLOY_KEY=prod:xxxxxxxxxxxxx

# AI Service (Anthropic)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
AI_MODEL=claude-3-5-sonnet-20241022

# Deployment Providers (Optional)
VERCEL_TOKEN=xxxxxxxxxxxxx
NETLIFY_TOKEN=xxxxxxxxxxxxx
RAILWAY_TOKEN=xxxxxxxxxxxxx

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Frontend (Netlify)

```bash
# Clerk Authentication (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex (Production)
NEXT_PUBLIC_CONVEX_URL=https://your-prod.convex.cloud

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
NODE_ENV=production
```

### GitHub Secrets

Add these secrets to your GitHub repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

**Required Secrets:**
- `RAILWAY_TOKEN` - Railway deployment token
- `CLERK_SECRET_KEY` - Clerk production secret
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `NEXT_PUBLIC_CONVEX_URL` - Convex production URL
- `CONVEX_DEPLOYMENT` - Convex deployment name
- `ANTHROPIC_API_KEY` - Claude AI API key

---

## Railway Backend Deployment

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

### Step 3: Initialize Project

```bash
cd backend
railway init
```

Select:
- **Create new project** → "autocrea-backend"
- **Environment** → "production"

### Step 4: Set Environment Variables

```bash
# Set all backend env vars
railway variables set NODE_ENV=production
railway variables set PORT=8000
railway variables set CLERK_SECRET_KEY=sk_live_xxxxx
railway variables set CONVEX_URL=https://your-prod.convex.cloud
railway variables set ANTHROPIC_API_KEY=sk-ant-xxxxx
railway variables set AI_MODEL=claude-3-5-sonnet-20241022
railway variables set FRONTEND_URL=https://your-app.netlify.app

# ... set all other variables
```

Or use Railway Dashboard:
1. Go to https://railway.app/dashboard
2. Select your project
3. Go to **Variables** tab
4. Add all environment variables

### Step 5: Deploy

```bash
# Deploy from local
railway up

# Or connect to GitHub for auto-deploy
# Railway Dashboard → Settings → Connect GitHub Repository
```

### Step 6: Get Deployment URL

After deployment:
```bash
railway domain
```

This gives you: `https://autocrea-backend-production.up.railway.app`

**Important**: Add this URL to:
- Clerk Dashboard → Allowed origins
- Netlify environment variable `NEXT_PUBLIC_API_URL`

---

## Netlify Frontend Deployment

### Already Configured! ✅

Your frontend is already set up to auto-deploy from GitHub.

### Update Environment Variables

1. Go to https://app.netlify.com
2. Select your site
3. **Site settings → Environment variables**
4. Update to production values:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_xxxxx
CLERK_SECRET_KEY = sk_live_xxxxx
NEXT_PUBLIC_CONVEX_URL = https://your-prod.convex.cloud
NEXT_PUBLIC_APP_URL = https://your-app.netlify.app
NODE_ENV = production
```

### Trigger Deployment

```bash
# Push to main branch
git push origin main

# Netlify will auto-deploy
# Monitor at: https://app.netlify.com/sites/your-site/deploys
```

---

## Convex Production Setup

### Step 1: Deploy to Production

```bash
# From project root
npx convex deploy --prod
```

This:
1. Creates production deployment
2. Deploys all schemas
3. Generates production URL

### Step 2: Get Production URL

After deployment, you'll see:
```
✔ Deployment URL: https://your-prod-name.convex.cloud
```

### Step 3: Update Environment Variables

Update this URL in:
- **Railway** → Backend `CONVEX_URL`
- **Netlify** → Frontend `NEXT_PUBLIC_CONVEX_URL`

### Step 4: Configure Webhooks

In Convex Dashboard:
```
Settings → Webhooks → Add Webhook

URL: https://autocrea-backend-production.up.railway.app/api/webhooks/convex
Events: All
```

---

## GitHub Secrets Configuration

### Step 1: Generate Railway Token

```bash
# Login to Railway
railway login

# Generate token
railway tokens create autocrea-ci-cd
```

Copy the token.

### Step 2: Add to GitHub Secrets

1. Go to GitHub repository
2. **Settings → Secrets and variables → Actions**
3. **New repository secret**

Add these secrets:

```
Name: RAILWAY_TOKEN
Secret: your_railway_token_here

Name: CLERK_SECRET_KEY
Secret: sk_live_xxxxx

Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Secret: pk_live_xxxxx

Name: NEXT_PUBLIC_CONVEX_URL
Secret: https://your-prod.convex.cloud

Name: CONVEX_DEPLOYMENT
Secret: prod:your-deployment-name

Name: ANTHROPIC_API_KEY
Secret: sk-ant-xxxxx
```

### Step 3: Test CI/CD

```bash
# Make a small change
git commit -am "test: CI/CD pipeline"
git push origin main

# Monitor at: https://github.com/user/repo/actions
```

The pipeline will:
1. ✅ Run tests
2. ✅ Build frontend & backend
3. ✅ Build Docker image
4. ✅ Run security audit
5. ✅ Deploy to Railway (if on main branch)

---

## Post-Deployment Verification

### 1. Backend Health Check

```bash
curl https://autocrea-backend-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T...",
  "uptime": 123.45
}
```

### 2. Frontend Accessibility

Visit: `https://your-app.netlify.app`

Verify:
- ✅ Landing page loads
- ✅ Sign in works
- ✅ Dashboard accessible
- ✅ Editor loads
- ✅ AI assistant responds

### 3. Database Connection

Check Convex Dashboard:
```
https://dashboard.convex.dev
```

Verify:
- ✅ Tables created (users, projects, files, etc.)
- ✅ Data syncing
- ✅ Queries executing

### 4. Authentication Flow

Test complete flow:
1. Sign up new user
2. Verify email
3. Access dashboard
4. Create project
5. Use AI assistant
6. Deploy project

### 5. API Endpoints

Test critical endpoints:
```bash
# Get auth token from Clerk
TOKEN="your_clerk_token"

# Test AI endpoint
curl -X POST https://your-backend.railway.app/api/ai/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a React button component",
    "language": "typescript"
  }'

# Expected: 200 OK with code response
```

---

## Monitoring & Logging

### Railway Monitoring

Railway Dashboard provides:
- **Metrics** → CPU, Memory, Network usage
- **Logs** → Real-time application logs
- **Deployments** → Deployment history

Access logs:
```bash
railway logs
```

### Netlify Monitoring

Netlify Dashboard shows:
- **Deploy logs** → Build output
- **Function logs** → Serverless function logs
- **Analytics** → Traffic, performance

### Convex Monitoring

Convex Dashboard provides:
- **Function logs** → Query/mutation execution
- **Performance** → Query timing
- **Usage** → Database operations

### Set Up Alerts

**Railway:**
```
Project Settings → Notifications
- Enable deployment notifications
- Enable error alerts
```

**Netlify:**
```
Site Settings → Build & deploy → Deploy notifications
- Email on deploy failed
- Slack/Discord webhooks
```

### Recommended Tools

**Error Tracking:**
```bash
# Install Sentry
npm install @sentry/node @sentry/nextjs

# Configure in backend/src/server.ts and frontend
```

**Performance Monitoring:**
- Vercel Analytics (for frontend)
- Railway Insights (for backend)
- Convex Dashboard (for database)

**Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## Troubleshooting

### Backend Not Starting

1. Check Railway logs:
   ```bash
   railway logs
   ```

2. Verify environment variables:
   ```bash
   railway variables
   ```

3. Check build output in Railway Dashboard

### Frontend Build Failed

1. Check Netlify deploy logs
2. Verify all environment variables set
3. Test build locally:
   ```bash
   cd frontend
   npm run build
   ```

### Database Not Connecting

1. Verify Convex URL is correct
2. Check Convex deployment status
3. Verify deploy key in backend env vars

### AI Requests Failing

1. Verify Anthropic API key
2. Check API key has credits
3. Verify rate limits not exceeded

---

## Security Checklist

- [ ] All API keys in environment variables (not code)
- [ ] Clerk in production mode
- [ ] HTTPS enabled on all endpoints
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Regular security audits (`npm audit`)
- [ ] Dependencies up to date
- [ ] Backup strategy in place

---

## Performance Optimization

### Backend (Railway)

```bash
# Optimize for production
NODE_ENV=production  # Enables optimizations
LOG_LEVEL=warn       # Reduce log verbosity
```

### Frontend (Netlify)

- Image optimization enabled
- Code splitting configured
- Lazy loading for routes
- CDN caching configured

### Database (Convex)

- Indexes on frequently queried fields
- Pagination for large datasets
- Cleanup jobs for old data

---

## Rollback Procedure

### Backend (Railway)

```bash
# List deployments
railway deployments

# Rollback to previous
railway rollback <deployment-id>
```

Or in Railway Dashboard:
1. Go to **Deployments**
2. Find working deployment
3. Click **Redeploy**

### Frontend (Netlify)

Netlify Dashboard:
1. **Deploys** tab
2. Find working deploy
3. **Publish deploy**

---

## Cost Estimation

### Monthly Costs (Estimated)

| Service | Plan | Cost |
|---------|------|------|
| Railway (Backend) | Hobby | $5-10 |
| Netlify (Frontend) | Free/Pro | $0-19 |
| Convex (Database) | Free/Pro | $0-25 |
| Clerk (Auth) | Free/Pro | $0-25 |
| Anthropic (AI) | Pay-as-you-go | $10-50 |
| **Total** | | **$15-129/month** |

### Free Tier Limits

- **Railway**: $5 free credits/month
- **Netlify**: 100GB bandwidth, 300 build minutes
- **Convex**: 1M function calls, 1GB storage
- **Clerk**: 10k MAU (Monthly Active Users)
- **Anthropic**: Pay per token (no free tier)

---

## Support & Resources

- **Documentation**: [README.md](./README.md)
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Phase 3 Explained**: [PHASE_3_EXPLAINED.md](./PHASE_3_EXPLAINED.md)
- **Railway Docs**: https://docs.railway.app
- **Netlify Docs**: https://docs.netlify.com
- **Convex Docs**: https://docs.convex.dev

---

**Last Updated**: 2025-01-27
**Version**: 1.0.0
**Status**: Production Ready ✅
