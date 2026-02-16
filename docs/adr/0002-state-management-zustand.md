# ADR 0002: Estado global con Zustand

- Estado: Accepted
- Fecha: 2026-02-16

## Contexto

La aplicacion necesita compartir datos de adopcion entre vistas y evitar fetches redundantes.

## Decision

Usar Zustand como store global para:

- `data`
- `loading`
- `error`
- `lastFetchedAt`
- acciones (`setData`, `setLoading`, `setError`, `reset`, `isStale`)

## Consecuencias

### Positivas

- Menor boilerplate que Context + reducer.
- API simple y directa para el hook de aplicacion.
- Buen rendimiento en estado global pequeno/mediano.

### Negativas

- Dependencia adicional externa.
- Requiere convenciones para mantener consistencia entre acciones.

## Alternativas consideradas

- Context API + `useReducer`.
- Estado local en pagina con lifting state.
