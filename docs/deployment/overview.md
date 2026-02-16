# Deployment Overview

## Contexto

El proyecto incluye soporte de despliegue con Docker Compose en `deploy/`.

## Componentes de despliegue

- Frontend (Vite build servido con Nginx)
- API mock (json-server)
- Variables de entorno desde `deploy/.env`

## Comando principal

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

## Variables relevantes

- `FRONTEND_URL`
- `VITE_API_URL`
- `API_PORT`
- `FRONTEND_PORT`

## Referencias

- [Deploy README (root)](../../deploy/README.md)
- [README principal](../../README.md)
