# Reporte de Adopción de Herramientas

Frontend para un sistema de métricas de adopción de herramientas por equipo. Muestra resumen ejecutivo, evolución mensual (Coding y General Tools) y uso por herramienta.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Ejecución

Se necesitan **dos terminales**:

### Terminal 1 — API mock (json-server)

```bash
npm run api
```

La API corre en http://localhost:3001. Expone `GET /adoption` con los datos de adopción.

### Terminal 2 — Aplicación

```bash
npm run dev
```

La app corre en http://localhost:3000. Las peticiones a `/api/*` se redirigen al servidor mock.

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run api` | Levanta json-server con `public/db.json` |
| `npm run lint` | Ejecuta ESLint |

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

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Zustand
- React Router
- json-server (mock)

## Documentación

- [AGENTS.md](AGENTS.md) — Guía para asistentes IA
- [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) — Decisiones de arquitectura y diseño
