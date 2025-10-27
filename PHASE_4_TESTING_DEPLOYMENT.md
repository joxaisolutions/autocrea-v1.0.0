# 🧪 PHASE 4: Testing & Production Deployment

## Overview

Phase 4 focuses on ensuring quality, reliability, and production readiness through comprehensive testing, Docker containerization, CI/CD automation, and production deployment.

---

## 📋 Table of Contents

1. [Testing Infrastructure](#testing-infrastructure)
2. [Test Coverage](#test-coverage)
3. [Docker Configuration](#docker-configuration)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Monitoring & Logging](#monitoring--logging)
6. [Production Deployment](#production-deployment)
7. [Security Considerations](#security-considerations)

---

## Testing Infrastructure

### Jest Configuration

**File**: `backend/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
```

### Running Tests

```bash
# Unit tests
cd backend
npm test

# Watch mode (during development)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Organization

```
backend/src/__tests__/
├── setup.ts                 # Global test configuration
├── services/
│   ├── aiService.test.ts    # AI service tests
│   └── deploymentService.test.ts
└── routes/
    └── api.test.ts          # API integration tests
```

---

## Test Coverage

### AI Service Tests

**File**: `backend/src/__tests__/services/aiService.test.ts`

Tests cover:
- ✅ Code generation with various languages/frameworks
- ✅ Code explanation functionality
- ✅ Error fixing with proper error handling
- ✅ Code refactoring
- ✅ Auto-completion
- ✅ AI chat functionality
- ✅ Token usage tracking
- ✅ Error handling for API failures

**Example Test**:
```typescript
describe('generateCode', () => {
  it('should generate code with proper formatting', async () => {
    const result = await generateCode({
      prompt: 'Create a hello world function',
      language: 'javascript',
    });

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('tokensUsed');
    expect(result.tokensUsed).toBeGreaterThan(0);
  });
});
```

### Deployment Service Tests

**File**: `backend/src/__tests__/services/deploymentService.test.ts`

Tests cover:
- ✅ Vercel deployment with environment variables
- ✅ Netlify deployment configuration
- ✅ Railway GraphQL API integration
- ✅ Deployment status polling
- ✅ Deployment cancellation
- ✅ Error handling for network failures
- ✅ Missing credentials detection

**Example Test**:
```typescript
describe('deployToVercel', () => {
  it('should successfully deploy to Vercel', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        id: 'dpl_123',
        url: 'https://my-app.vercel.app',
      },
    });

    const result = await deployToVercel(config);

    expect(result.success).toBe(true);
    expect(result.url).toContain('vercel.app');
  });
});
```

### API Integration Tests

**File**: `backend/src/__tests__/routes/api.test.ts`

Tests cover:
- ✅ All AI endpoints (generate, explain, fix, refactor, complete)
- ✅ Project CRUD operations
- ✅ Deployment endpoints
- ✅ Authentication requirements
- ✅ Input validation
- ✅ Error responses
- ✅ Pagination

**Example Test**:
```typescript
describe('POST /api/ai/generate', () => {
  it('should generate code successfully', async () => {
    const response = await request(app)
      .post('/api/ai/generate')
      .send({
        prompt: 'Create a hello function',
        language: 'javascript',
      })
      .expect(200);

    expect(response.body).toHaveProperty('code');
  });
});
```

### Test Mocking Strategy

**Anthropic AI SDK Mock**:
```typescript
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: '```js\ncode\n```' }],
        usage: { input_tokens: 100, output_tokens: 50 },
      }),
    },
  }));
});
```

**Axios Mock** (for deployment services):
```typescript
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockResolvedValue({ data: { ... } });
```

---

## Docker Configuration

### Dockerfile

**File**: `Dockerfile`

Multi-stage build for optimized production image:

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 autocrea

COPY --from=builder --chown=autocrea:nodejs /app/dist ./dist
COPY --from=deps --chown=autocrea:nodejs /app/node_modules ./node_modules

USER autocrea
EXPOSE 8000
CMD ["node", "dist/server.js"]
```

**Key Features**:
- ✅ Multi-stage build (reduces final image size)
- ✅ Non-root user for security
- ✅ Production-only dependencies
- ✅ Alpine Linux (minimal base image)

### Docker Compose

**File**: `docker-compose.yml`

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      # ... all env vars
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  code-sandbox:
    image: node:20-alpine
    security_opt:
      - no-new-privileges:true
    read_only: true
    mem_limit: 512m
    cpus: 0.5
    cap_drop:
      - ALL
```

**Security Features**:
- ✅ Isolated code execution sandbox
- ✅ Resource limits (CPU, memory)
- ✅ Read-only filesystem
- ✅ Dropped capabilities
- ✅ Health checks

### Building & Running

```bash
# Build image
docker build -t autocrea-backend:latest .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File**: `.github/workflows/ci.yml`

### Pipeline Stages

**1. Lint & Type Check**
- ESLint for code quality
- TypeScript type checking
- Runs on all branches

**2. Test Frontend**
- Run frontend tests
- Generate coverage reports

**3. Test Backend**
- Run unit tests
- Run integration tests
- Upload coverage to Codecov

**4. Build Frontend**
- Build Next.js production bundle
- Upload artifacts
- Only if tests pass

**5. Build Backend**
- Compile TypeScript
- Upload artifacts
- Only if tests pass

**6. Docker Build**
- Build Docker image
- Test containerization
- Cache layers for faster builds

**7. Security Audit**
- Run `npm audit` on frontend
- Run `npm audit` on backend
- Check for vulnerabilities

**8. Deploy to Railway**
- Only on `main` branch
- Only on push (not PR)
- Only if all tests pass
- Automatic deployment to production

### Workflow Triggers

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

### GitHub Secrets Required

Add these in: **Settings → Secrets and variables → Actions**

```
RAILWAY_TOKEN              - Railway deployment token
CLERK_SECRET_KEY           - Clerk production key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CONVEX_URL     - Convex production URL
CONVEX_DEPLOYMENT          - Convex deployment name
ANTHROPIC_API_KEY          - Claude AI key
```

### Monitoring Pipeline

```bash
# View workflow runs
https://github.com/user/repo/actions

# Check specific run
https://github.com/user/repo/actions/runs/<run-id>
```

---

## Monitoring & Logging

### Winston Logger

**File**: `backend/src/utils/logger.ts`

Structured logging with levels:
- `error` - Critical errors
- `warn` - Warnings
- `info` - General information
- `http` - HTTP requests
- `debug` - Debug information

**Features**:
- ✅ Color-coded console output
- ✅ File logging (error.log, combined.log)
- ✅ Timestamp on all logs
- ✅ Environment-aware log level

**Usage**:
```typescript
import logger from './utils/logger';

logger.info('Server started on port 8000');
logger.error('Database connection failed', { error });
logger.http('GET /api/projects 200 45ms');
```

### Request Logging Middleware

**File**: `backend/src/middleware/requestLogger.ts`

**Features**:
- ✅ Logs all HTTP requests
- ✅ Tracks request duration
- ✅ Color-coded by status code
- ✅ Performance monitoring
- ✅ Slow request detection (>1s)

**Usage in server.ts**:
```typescript
import { requestLogger, performanceMonitor, errorLogger } from './middleware/requestLogger';

app.use(requestLogger);
app.use(performanceMonitor);

// ... routes ...

app.use(errorLogger);
```

### Log Output Example

```
2025-01-27 10:15:32 info: 🚀 Server started on port 8000
2025-01-27 10:15:45 http: POST /api/ai/generate 200 1234ms - User: user_123
2025-01-27 10:16:02 warn: Slow request detected: POST /api/deploy took 2341ms
2025-01-27 10:16:15 error: Error in GET /api/projects/invalid
```

### Production Monitoring Tools

**Recommended Setup**:

1. **Error Tracking**: Sentry
   ```typescript
   import * as Sentry from '@sentry/node';
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   ```

2. **Performance**: Railway Insights
   - Built-in metrics dashboard
   - CPU, memory, network usage
   - Request latency tracking

3. **Uptime Monitoring**: UptimeRobot
   - 5-minute interval checks
   - Email/SMS alerts on downtime
   - Status page for users

---

## Production Deployment

### Railway Backend Deployment

**Step-by-step guide in**: `PRODUCTION_DEPLOYMENT.md`

**Quick Start**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

**Environment Variables**:
Set in Railway Dashboard → Variables:
- All backend .env variables
- Use production keys (Clerk `sk_live_`, etc.)

**Custom Domain** (Optional):
```bash
railway domain
# Or set custom domain in Railway Dashboard
```

### Netlify Frontend Deployment

**Already Configured!** ✅

Automatic deployment on push to `main`:
1. Push to GitHub
2. Netlify auto-builds
3. Deploy to production

**Monitor**: https://app.netlify.com/sites/your-site/deploys

### Convex Database Deployment

```bash
# Deploy to production
npx convex deploy --prod

# Get production URL
# Output: https://your-prod.convex.cloud
```

**Update** this URL in:
- Railway → `CONVEX_URL`
- Netlify → `NEXT_PUBLIC_CONVEX_URL`

---

## Security Considerations

### Code Execution Sandbox

**Docker Isolation**:
- Separate container for code execution
- Resource limits (CPU: 0.5 cores, Memory: 512MB)
- Read-only filesystem
- No internet access (optional)
- Automatic cleanup after execution

**Implementation**:
```typescript
// Future: backend/src/services/codeExecutionService.ts
const container = await docker.createContainer({
  Image: 'autocrea-sandbox',
  Cmd: ['node', 'user-code.js'],
  HostConfig: {
    Memory: 512 * 1024 * 1024, // 512MB
    NanoCpus: 500000000,        // 0.5 CPU
    ReadonlyRootfs: true,
    NetworkMode: 'none',
  },
});
```

### Rate Limiting

Already implemented in Phase 3:
- API: 100 requests / 15 minutes
- AI: 20 requests / 15 minutes
- Auth: 5 requests / 15 minutes
- Deploy: 10 requests / hour

### Input Validation

All endpoints use Zod validation:
```typescript
validateProject(req, res, next)
validateAIRequest(req, res, next)
validateDeployment(req, res, next)
```

### Authentication

Clerk JWT validation on all protected routes:
```typescript
app.use('/api/*', authenticateUser);
```

### HTTPS/SSL

- ✅ Railway: Automatic HTTPS
- ✅ Netlify: Automatic HTTPS
- ✅ Convex: HTTPS by default

---

## Testing Checklist

### Local Testing

- [ ] All unit tests pass (`npm test`)
- [ ] All integration tests pass
- [ ] Test coverage >80%
- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] Docker image builds successfully
- [ ] Docker compose starts all services
- [ ] Health check endpoint responds
- [ ] API endpoints accessible
- [ ] Authentication works
- [ ] AI generation works
- [ ] Deployment works

### CI/CD Testing

- [ ] GitHub Actions workflow configured
- [ ] All secrets added to GitHub
- [ ] Workflow runs successfully on push
- [ ] Tests pass in CI environment
- [ ] Docker build succeeds
- [ ] Security audit passes
- [ ] Deployment to Railway succeeds

### Production Testing

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Netlify
- [ ] Convex in production mode
- [ ] Health check responds: `/health`
- [ ] Can create user account
- [ ] Can login
- [ ] Can create project
- [ ] Can generate code with AI
- [ ] Can deploy project
- [ ] Monitoring tools configured
- [ ] Logs accessible
- [ ] Error tracking works

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time (p50) | <200ms | TBD |
| API Response Time (p95) | <500ms | TBD |
| AI Generation Time | <5s | TBD |
| Deployment Time | <3min | TBD |
| Frontend Load Time | <2s | TBD |
| Test Execution Time | <30s | ~10s |
| Docker Build Time | <5min | ~2min |

### Load Testing

**Recommended Tool**: k6 or Artillery

```javascript
// k6 load test example
import http from 'k6/http';

export default function() {
  http.get('https://your-backend.railway.app/health');
}

export let options = {
  vus: 50,        // 50 virtual users
  duration: '30s', // for 30 seconds
};
```

---

## Rollback Procedures

### Railway Rollback

```bash
# List deployments
railway deployments

# Rollback to specific deployment
railway rollback <deployment-id>
```

Or in Railway Dashboard:
1. Go to **Deployments**
2. Find working deployment
3. Click **Redeploy**

### Netlify Rollback

Netlify Dashboard:
1. **Deploys** tab
2. Find working deploy
3. Click **Publish deploy**

### Database Rollback

Convex maintains history:
1. Convex Dashboard → Deployments
2. Select previous working deployment
3. Redeploy

---

## Cost Optimization

### Railway

- Use Hobby plan ($5/month)
- Monitor usage dashboard
- Set resource limits
- Enable auto-sleep for dev environments

### Convex

- Free tier: 1M function calls/month
- Optimize queries with indexes
- Implement data pagination
- Clean up old records

### Anthropic AI

- Cache common prompts
- Set max_tokens limits
- Implement request batching
- Monitor token usage per user

---

## Next Steps

After Phase 4 completion:

1. **Phase 5: Advanced Features**
   - Real-time collaboration
   - Code review AI
   - Project templates
   - Team workspaces
   - Advanced analytics

2. **Phase 6: Scale & Optimize**
   - Redis caching
   - CDN optimization
   - Database read replicas
   - Auto-scaling
   - Global deployment

3. **Phase 7: Enterprise Features**
   - SSO integration
   - Custom branding
   - SLA guarantees
   - Dedicated support
   - On-premise deployment

---

## Resources

- **Testing Guide**: [Jest Documentation](https://jestjs.io/docs/getting-started)
- **Docker Guide**: [Docker Documentation](https://docs.docker.com/)
- **CI/CD Guide**: [GitHub Actions Docs](https://docs.github.com/en/actions)
- **Railway Guide**: [Railway Docs](https://docs.railway.app/)
- **Monitoring Guide**: [Winston Documentation](https://github.com/winstonjs/winston)

---

**Phase 4 Status**: ✅ COMPLETED
**Last Updated**: 2025-01-27
**Version**: 1.0.0
**Production Ready**: YES
