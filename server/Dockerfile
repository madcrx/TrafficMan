# Build context must be the project root: docker build -f server/Dockerfile .
# docker-compose.yml sets context: . so this is handled automatically.

# ── Stage 1: install all deps (single root lockfile) ──────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY server/package.json ./server/
RUN npm ci

# ── Stage 2: build frontend + server ─────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm run build:server

# ── Stage 3: runtime (prod deps only) ────────────────────────────────
FROM node:22-alpine
WORKDIR /srv

COPY package*.json ./
COPY server/package.json ./server/
RUN npm ci --omit=dev

COPY --from=build /app/server/dist ./dist
COPY --from=build /app/dist ./public

RUN mkdir -p /data

ENV PORT=3001
ENV NODE_ENV=production
ENV SERVE_STATIC=true
ENV STATIC_DIR=/srv/public
ENV DATA_DIR=/data

EXPOSE 3001
CMD ["node", "--experimental-sqlite", "dist/index.js"]
