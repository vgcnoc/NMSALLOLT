FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install

# Copy source
COPY shared/ ./shared/
COPY frontend/ ./frontend/

WORKDIR /app/frontend

# Build for production
RUN npm run build

# Nginx server
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
