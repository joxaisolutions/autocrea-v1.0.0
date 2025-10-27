# AUTOCREA Backend Dockerfile
# Node.js 20 Alpine para producción

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build the source code
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 autocrea

# Copy built application
COPY --from=builder --chown=autocrea:nodejs /app/dist ./dist
COPY --from=deps --chown=autocrea:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=autocrea:nodejs /app/package.json ./package.json

USER autocrea

EXPOSE 8000

ENV PORT 8000
ENV HOST 0.0.0.0

CMD ["npm", "start"]
