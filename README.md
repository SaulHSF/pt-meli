# Reporte de Adopción de Herramientas

Frontend para un sistema de métricas de adopción de herramientas por equipo. Muestra resumen ejecutivo, evolución mensual (Coding y General Tools) y uso por herramienta.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
nvm use
pnpm install
```

## Ejecución

Se necesitan **dos terminales**:

### Terminal 1 — API mock (json-server)

```bash
pnpm run api
```

La API corre en http://localhost:3001. Expone `GET /adoption` con los datos de adopción.

### Terminal 2 — Aplicación

```bash
pnpm run dev
```

La app corre en http://localhost:3000. Las peticiones a `/api/*` se redirigen al servidor mock.

## Scripts

| Script | Descripción |
|--------|-------------|
| `pnpm run dev` | Servidor de desarrollo (Vite) |
| `pnpm run build` | Build de producción |
| `pnpm run preview` | Vista previa del build |
| `pnpm run api` | Levanta json-server con `public/db.json` |
| `pnpm run lint` | Ejecuta ESLint |
| `pnpm run test` | Ejecuta tests unitarios con Vitest |
| `pnpm run test:watch` | Ejecuta tests en modo watch |
| `pnpm run test:coverage` | Ejecuta tests y genera reporte de cobertura |
| `pnpm run test:coverage:verify` | Valida umbrales globales y por carpeta |

## Estructura del proyecto

```
src/
├── domain/         # Lógica de negocio
├── ports/          # Interfaces
├── adapters/       # Implementaciones (API)
├── stores/         # Estado (Zustand)
├── application/    # Hooks / casos de uso
├── components/     # Componentes UI
├── pages/          # Páginas
└── themes/         # Variables CSS
```

## Stack

- React 19+ TypeScript
- Vite
- Tailwind CSS
- Recharts
- Zustand
- React Router
- json-server (mock)

## Documentación

- [AGENTS.md](AGENTS.md) — Guía para asistentes IA
- [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) — Decisiones de arquitectura y diseño
- [docs/README.md](docs/README.md) — Índice de documentación técnica (arquitectura, ADRs, flujos y despliegue)
- [deploy/README.md](deploy/README.md) — Referencia histórica de despliegue

## Testing (Vitest)

El proyecto usa Vitest + Testing Library para pruebas unitarias.

Stack de pruebas:

- Runner: `vitest`
- Entorno DOM: `happy-dom`
- Matchers: `@testing-library/jest-dom`
- Render y eventos: `@testing-library/react`

Convención de archivos:

- Se aceptan `*.test.ts(x)` y `*.spec.ts(x)`.
- Para componentes UI (Atomic Design) se prioriza `*.spec.tsx`.
- Los tests se ubican junto al módulo probado (co-locación).

Cobertura que se reporta en CI:

- `src/domain/services/**/*.ts`
- `src/application/**/*.ts`
- `src/adapters/**/*.ts`
- `src/stores/**/*.ts`

Cobertura objetivo:

- `src/domain/services`: >= 90%
- `src/application`: >= 80%
- Global: >= 75%

Comandos recomendados:

```bash
# Suite rápida local
pnpm run test

# Desarrollo guiado por tests
pnpm run test:watch

# Cobertura y validación de umbrales
pnpm run test:coverage:verify
```

Integración continua:

- Workflow: `.github/workflows/ci.yml`
- Ejecuta: `npm ci`, `npm run lint`, `npm run test:coverage:verify`

## Despliegue con Docker

### Requisitos

- Docker
- Docker Compose

### Configuración

1. Copiar el archivo de entorno:
   ```bash
   cp deploy/.env.example deploy/.env
   ```

2. Editar `deploy/.env` según el entorno:
   - `FRONTEND_URL`: origen permitido por CORS (debe coincidir con la URL del frontend).
   - `VITE_API_URL`: URL pública del API (el navegador la usará para `fetch`).
   - `API_PORT`, `FRONTEND_PORT`: puertos expuestos (3010/3011 por defecto para evitar conflictos con dev local).

### Ejecución

Desde la raíz del proyecto:

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

URLs por defecto:

- Frontend: `http://localhost:3010`
- API: `http://localhost:3011`

### CORS

El API solo acepta peticiones desde los orígenes definidos en `FRONTEND_URL`. Para varios dominios, separar por coma:

```env
FRONTEND_URL=http://localhost:3000,https://app.ejemplo.com
```
