# Decisiones de diseño

Este documento describe las decisiones técnicas y arquitectónicas del proyecto.

Para documentación operativa y de arquitectura más detallada, ver `docs/README.md`.

## 1. Arquitectura general

### Hexagonal ligera (Ports & Adapters)

Se adopta una variante ligera de arquitectura hexagonal para separar la lógica de negocio de la infraestructura.

- **Domain**: tipos y servicios con lógica pura. Sin dependencias de React, fetch o librerías externas.
- **Ports**: interfaces que definen contratos (ej: `AdoptionRepository`).
- **Adapters**: implementaciones concretas (ej: `AdoptionApiAdapter` para HTTP).

**Motivo**: Facilita tests unitarios del dominio, permite cambiar el origen de datos sin tocar lógica de negocio.

### Flujo de dependencias

```
UI (components, pages)
    ↓
Application (useAdoptionReport)
    ↓
Domain (adoptionMetrics) + Stores + Adapters
```

La UI solo consume el hook `useAdoptionReport`. No conoce la API ni el formato raw de datos.

---

## 2. Stack tecnológico

### Vite sobre Create React App

- Build más rápido y HMR más eficiente.
- Configuración más simple para proyectos modernos.
- CRA está en modo mantenimiento.

### Recharts sobre Chart.js

- Sintaxis declarativa con JSX, alineada con React.
- `ResponsiveContainer` para responsividad.
- Soporta stacked bar charts y gráficos horizontales sin configuración extra.
- SVG nativo, fácil de estilizar con variables CSS.

### Zustand sobre Context

- Estado global ligero, menos boilerplate que Context + useReducer.
- Evita re-renders innecesarios con selectores.
- No requiere Providers anidados.
- Suficiente para el volumen de estado de esta aplicación.

### Tailwind CSS

- Desarrollo rápido de estilos.
- Consistencia con utility-first.
- Compatible con variables CSS para temas.

---

## 3. Manejo de estado

### Store centralizado (adoptionStore)

Los datos de adopción viven en un store de Zustand. El hook `useAdoptionReport`:

1. Lee del store.
2. Dispara el fetch si no hay datos (evitando llamadas redundantes en múltiples montajes).
3. Deriva métricas usando el servicio de dominio.

### Evitar refetches innecesarios

- **Fetch inicial**: Solo cuando `data` es `null` y no hay `loading` en curso.
- **Cache**: El store mantiene `lastFetchedAt`. Se puede extender con TTL para refetch automático (actualmente no implementado en el primer montaje).
- Los componentes que usan `useAdoptionReport` reciben datos del mismo store; no se realizan múltiples fetches.

---

## 4. Componentización

### Criterios

- **ExecutiveSummary**: Presentacional. Recibe `metrics` y `loading`, sin lógica de negocio.
- **EvolutionChart**: Reutilizable para Coding y General Tools. Misma estructura, datos distintos.
- **UsageByToolChart**: Específico para visualización C (barras horizontales).

### Responsabilidad única

Cada componente se encarga de una vista concreta. La orquestación y el fetch están en el hook.

### Atomic Design aplicado (UI)

Se adoptó Atomic Design para toda la capa de componentes:

- **Atoms**
  - `BaseBarChart`: wrapper base de Recharts con ejes/grid/tooltip/legend configurables.
- **Molecules**
  - `ChartCard`: contenedor estándar de título, descripción, estados de loading/empty y contenido.
- **Organisms**
  - `EvolutionChart`: composición para evolución mensual por niveles.
  - `UsageByToolChart`: composición para uso por herramienta en último mes.
  - `ExecutiveSummary`: bloque de métricas clave del último mes.
- **Templates**
  - `AppLayout`: estructura principal de página y header dinámico por ruta.

---

## 5. Naming Rules

Se estandariza naming para consistencia entre capas y escalabilidad:

### Reglas generales

- **Componentes React**: `PascalCase`
- **Hooks**: `camelCase` con prefijo `use`
- **Funciones/variables**: `camelCase`
- **Tipos/interfaces**: `PascalCase`
- **Constantes inmutables**: `UPPER_SNAKE_CASE`
- **Carpetas**: minúsculas semánticas

### Reglas por capa

- **domain/**: naming orientado a negocio (sin términos de transporte/UI).
- **ports/**: contratos en `PascalCase` (ej: `AdoptionRepository`).
- **adapters/**: naming por tecnología + propósito (ej: `adoptionApiAdapter`).
- **application/**: hooks/casos de uso explícitos (ej: `useAdoptionReport`).
- **components/**: naming alineado a atomic (`atoms`, `molecules`, `organisms`).

### Motivo

- Reduce ambigüedad.
- Facilita onboarding y code review.
- Evita imports frágiles al crecer el proyecto.
- Permite migraciones graduales sin romper APIs internas.

---

## 6. Temas y accesibilidad

### Tokens CSS

Variables en `themes/tokens.css` para colores, bordes y focus. Permite temas (light, dark, high-contrast) cambiando `data-theme` en el contenedor.

### ARIA

- `role="region"` en bloques semánticos cuando aplica.
- `aria-labelledby` y `aria-describedby` para lectores de pantalla.
- Labels descriptivos en gráficos.

---

## 7. Modelo de datos

### AdoptionRecord

```ts
{ userId, month, tools: { Windsurf?, Cursor?, ... } }
```

- Un registro por usuario por mes.
- `tools` es un mapa herramienta → nivel de uso.

### Herramientas

- **Coding**: Windsurf, Cursor, Copilot.
- **General**: ChatGPT, Gemini, Notebook.

### Niveles

`No Use` | `Low` | `Frequent` | `Daily`

---

## 8. API

### Mock con json-server

- Archivo `public/db.json` con clave `adoption` (array).
- json-server expone `GET /adoption`.
- Proxy de Vite: `/api` → `localhost:3001`.

### Adapter

`AdoptionApiAdapter` implementa `AdoptionRepository`. Para conectar una API real, se crea otro adapter que implemente la misma interface y se inyecta o se reemplaza en el hook.

---

## 9. Escalabilidad futura

- **Nuevas visualizaciones**: Nuevos componentes que consumen `useAdoptionReport` o hooks derivados.
- **Nuevas fuentes de datos**: Nuevos adapters que implementen los ports.
- **Temas**: Ampliar `tokens.css` y lógica de `data-theme`.
- **Tests**: Domain y application son candidatos prioritarios para unit tests.

---

## 10. Estrategia de testing

### Decisión: Vitest + Testing Library

Se adopta Vitest por compatibilidad nativa con Vite y velocidad de ejecución en local/CI.  
Testing Library se usa para validar comportamiento observable en hooks y componentes.

### Decisión: `happy-dom` como entorno de pruebas

Se utiliza `happy-dom` en lugar de `jsdom` para estabilizar la ejecución en entornos donde `jsdom` puede fallar por incompatibilidades ESM/CJS de dependencias transitivas.

**Motivo**:

- Menor fricción en runners basados en workers/forks.
- Menor riesgo de fallos de bootstrap del pool de Vitest.
- Mantiene APIs DOM suficientes para las pruebas unitarias del proyecto.

### Convención de pruebas

- Se aceptan `*.test.ts(x)` y `*.spec.ts(x)`.
- Para UI (`components/atoms`, `molecules`, `organisms`, `templates`) se usa preferentemente `*.spec.tsx`.
- Para servicios/hooks/stores/adapters se usan unit tests junto al archivo (co-locación).

### Alcance y prioridades de cobertura

Se prioriza cobertura en capas con lógica y orquestación:

- `domain/services`: cálculos de negocio puros.
- `application`: hooks de orquestación (`useAdoptionReport`).
- `adapters`: manejo de errores y mapeo de respuesta HTTP.
- `stores`: estado y reglas de cache (`isStale`, `reset`, etc.).

Umbrales activos:

- Global: lines/functions/statements >= 75, branches >= 70.
- `src/domain/services`: >= 90 (branches >= 80).
- `src/application`: >= 80 (branches >= 70).

### Decisión de CI para calidad

Se ejecuta pipeline de calidad en GitHub Actions:

1. `pnpm ci`
2. `pnpm run lint`
3. `pnpm run test:coverage:verify`

Esto evita merges con regresiones de lint, tests o cobertura en capas críticas.
