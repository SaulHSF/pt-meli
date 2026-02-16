# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL: URL que el navegador usará para llamar a la API (se inyecta en build)
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Config nginx para SPA (fallback a index.html)
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
