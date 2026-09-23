FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json and workspace configuration
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/

# Install all dependencies (including dev for building)
RUN npm install

# Copy source code
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build shared types
WORKDIR /app/shared
RUN npm run build || true # if build script exists

# Build backend
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/prisma ./backend/prisma

WORKDIR /app/backend

ENV NODE_ENV=production
ENV APP_PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
