# AUTOCREA Backend - Production Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Development dependencies for building
FROM base AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 autocrea

# Copy built application
COPY --from=builder --chown=autocrea:nodejs /app/dist ./dist
COPY --from=deps --chown=autocrea:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=autocrea:nodejs /app/package.json ./package.json

USER autocrea

EXPOSE 8000

ENV PORT=8000

CMD ["node", "dist/server.js"]
