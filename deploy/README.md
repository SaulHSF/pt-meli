# Despliegue con Docker

## Requisitos

- Docker
- Docker Compose

## Configuración

1. Copiar el archivo de entorno:
   ```bash
   cp .env.example .env
   ```

2. Editar `.env` según el entorno:
   - `FRONTEND_URL`: Origen permitido por CORS (debe coincidir con la URL del frontend)
   - `VITE_API_URL`: URL pública del API (el navegador la usará para fetch)
   - `API_PORT`, `FRONTEND_PORT`: Puertos expuestos (3010/3011 por defecto para evitar conflictos con dev)

## Ejecución

Desde la carpeta `deploy`:

```bash
docker compose up -d
```

- Frontend: http://localhost:3010
- API: http://localhost:3011

## CORS

El API solo acepta peticiones desde los orígenes definidos en `FRONTEND_URL`. Para varios dominios, separar por coma:

```
FRONTEND_URL=http://localhost:3000,https://app.ejemplo.com
```
