# AUTOCREA Backend - Production Dockerfile
FROM node:20-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm install --production && npm cache clean --force

# Development dependencies for building
FROM base AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install && npm cache clean --force

COPY backend/ ./
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs autocrea

# Copy built application
COPY --from=builder --chown=autocrea:nodejs /app/dist ./dist
COPY --from=deps --chown=autocrea:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=autocrea:nodejs /app/package.json ./package.json

USER autocrea

EXPOSE 8000

CMD ["node", "dist/index.js"]
