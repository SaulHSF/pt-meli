# ADR 0003: Testing con Vitest y happy-dom

- Estado: Accepted
- Fecha: 2026-02-16

## Contexto

Se requiere una estrategia unitaria integrada con Vite, con ejecucion rapida y estable en local y CI.

## Decision

- Usar Vitest como runner principal.
- Usar Testing Library para pruebas de UI y hooks.
- Configurar entorno DOM con `happy-dom`.
- Mantener convencion de tests `*.test.ts(x)` y `*.spec.ts(x)`.

## Consecuencias

### Positivas

- Integracion natural con Vite.
- Menor tiempo de feedback en desarrollo.
- Ejecucion estable ante incompatibilidades de algunas dependencias de `jsdom`.

### Negativas

- Algunas diferencias menores de APIs DOM respecto a `jsdom`.
- Necesidad de revisar tests si se cambia de entorno en el futuro.

## Alternativas consideradas

- Jest + jsdom.
- Vitest + jsdom.
