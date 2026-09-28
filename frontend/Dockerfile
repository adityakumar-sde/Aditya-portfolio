# =========================================================
# STAGE 1: Build React 19 + Vite Production Artifacts
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package*.json ./
RUN npm ci || npm install

# Copy application source code
COPY . .

# Run TypeScript check and production Vite build
RUN npm run build

# =========================================================
# STAGE 2: High-Performance Production Nginx Runtime
# =========================================================
FROM nginx:alpine AS runner

# Remove default nginx configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom reverse proxy & caching configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production bundled assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure Nginx is serving
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
