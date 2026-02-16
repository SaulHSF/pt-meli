# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL: URL que el navegador usará para llamar a la API (se inyecta en build)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
