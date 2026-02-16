# AGENTS.md — Guía para asistentes IA

Este documento ayuda a asistentes de IA (Cursor, Copilot, etc.) a entender y modificar el proyecto correctamente.

## Descripción del proyecto

Frontend de un **Reporte Inteligente de Adopción** de herramientas. Muestra métricas de uso (No Use, Low, Frequent, Daily) para Coding Tools (Windsurf, Cursor, Copilot) y General Tools (ChatGPT, Gemini, Notebook).

## Stack técnico

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — estilos
- **Recharts** — gráficos
- **Zustand** — estado global
- **React Router** — rutas
- **json-server** — API mock

## Estructura de carpetas

```
src/
├── domain/           # Lógica de negocio (sin I/O, sin React)
│   ├── types/        # Entidades y tipos
│   └── services/    # Cálculos de métricas
├── ports/            # Interfaces (contratos) para infraestructura
├── adapters/         # Implementaciones (API HTTP)
├── stores/           # Estado global (Zustand)
├── application/      # Casos de uso (hooks que orquestan)
├── components/       # UI (Atomic Design)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── pages/            # Páginas/vistas
└── themes/           # Tokens CSS (variables de diseño)
```

## Reglas de dependencias

- ** domain**: no importa de `adapters`, `stores`, `components`, `pages`
- **adapters**: implementan `ports`, importan de `domain/types`
- **stores**: pueden usar `adapters` (indirectamente vía aplicación)
- **application**: usa `domain`, `stores`, `adapters`
- **components/pages**: usan solo `application` (hooks) y `domain/types` si necesitan tipar props

## Convenciones

1. **Componentes**: PascalCase, un componente por archivo
2. **Hooks**: prefijo `use`, en `application/` o `hooks/`
3. **Tipos**: en `domain/types/` o inline cuando son locales
4. **Paths**: usar alias `@/` para imports (ej: `@/domain/types/adoption`)
5. **CSS**: preferir variables CSS (`var(--color-*)`) para temas

## Naming Rules del proyecto

Estas reglas son obligatorias para mantener consistencia y escalabilidad.

### 1) Archivos y carpetas

- **Componentes React**: `PascalCase.tsx`
  - Ej: `BaseBarChart.tsx`, `ChartCard.tsx`, `EvolutionChart.tsx`
- **Hooks**: `camelCase.ts` con prefijo `use`
  - Ej: `useAdoptionReport.ts`
- **Servicios y utilidades de dominio**: `camelCase.ts`
  - Ej: `adoptionMetrics.ts`
- **Tipos/contratos**: `PascalCase.ts` cuando representan entidad/port principal
  - Ej: `AdoptionRepository.ts`
- **Carpetas**: minúsculas y semánticas
  - Ej: `components/atoms/charts`, `components/molecules/charts`, `components/organisms/charts`

### 2) Símbolos TypeScript

- **Componentes, interfaces, types, enums**: `PascalCase`
  - Ej: `RouteMeta`, `SummaryMetrics`
- **Funciones y variables**: `camelCase`
  - Ej: `getRouteMeta`, `computeSummary`
- **Constantes globales/inmutables**: `UPPER_SNAKE_CASE`
  - Ej: `DEFAULT_META`, `ROUTE_META`, `CODING_TOOLS`
- **Booleanos**: prefijo semántico (`is`, `has`, `can`, `should`)
  - Ej: `isEmpty`, `hasError`

### 3) Reglas de naming por capa

- **domain/**
  - Nombres orientados a negocio, no a UI/infra.
  - Evitar términos técnicos de transporte (ej: `fetch`, `http`) en esta capa.
- **ports/**
  - Nombre de contrato en `PascalCase` y sufijo opcional `Repository`/`Port` según aplique.
- **adapters/**
  - Nombre concreto por tecnología + propósito.
  - Ej: `adoptionApiAdapter.ts`.
- **application/**
  - Hooks/casos de uso con prefijo `use` si son hooks React.
- **components/**
  - Atomic design:
    - `atoms`: wrappers base o piezas mínimas (`BaseBarChart`)
    - `molecules`: composición simple reutilizable (`ChartCard`)
    - `organisms`: bloque de negocio visible (`EvolutionChart`, `UsageByToolChart`, `ExecutiveSummary`)
    - `templates`: estructura de página/layout (`AppLayout`)

### 4) Imports y exports

- Mantener `@/` para imports absolutos internos.
- Importar desde la capa atomic final (evitar rutas legacy).
  - Ej: `@/components/organisms/charts/EvolutionChart`.
- Evitar nombres ambiguos como `utils.ts`, `helpers.ts` sin contexto de dominio.

## Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Levantar API mock (terminal 1)
npm run api

# Levantar app (terminal 2)
npm run dev
```

La app corre en http://localhost:3000 y consume la API en http://localhost:3001 (proxy /api -> 3001).

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/domain/services/adoptionMetrics.ts` | Cálculos: summary, evolución, uso por herramienta |
| `src/ports/AdoptionRepository.ts` | Contrato para obtener datos |
| `src/adapters/api/adoptionApiAdapter.ts` | Implementación HTTP |
| `src/stores/adoptionStore.ts` | Estado centralizado, evita refetches |
| `src/application/useAdoptionReport.ts` | Hook principal que exponen los datos |
| `public/db.json` | Datos mock para json-server |

## Decisiones de arquitectura

Ver [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) para el razonamiento detallado de las decisiones técnicas.
