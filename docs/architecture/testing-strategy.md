# Testing Strategy

## Objetivo

Asegurar calidad en logica de negocio, orquestacion y componentes UI con una estrategia unitaria incremental.

## Stack de pruebas

- Runner: `vitest`
- Entorno DOM: `happy-dom`
- Utilidades: `@testing-library/react`
- Matchers: `@testing-library/jest-dom`

## Convenciones

- UI (atoms/molecules/organisms/templates): `*.spec.tsx`
- Domain/Application/Adapters/Stores: `*.test.ts` o `*.spec.ts`
- Co-locacion: tests junto al modulo probado

## Priorizacion de cobertura

Carpetas con coverage objetivo y validacion automatizada:

- `src/domain/services`: >= 90% (branches >= 80%)
- `src/application`: >= 80% (branches >= 70%)
- Global: lines/functions/statements >= 75%, branches >= 70%

## Pipeline de calidad

CI ejecuta:

1. `npm ci`
2. `npm run lint`
3. `npm run test:coverage:verify`

## Cobertura por capas

- Domain: calculos puros, casos borde y reglas.
- Application hooks: fetch inicial, estados, derivados y errores.
- Adapters: mapeo HTTP y manejo de errores.
- Stores: transiciones de estado, cache y reset.
- Components: render condicional, interaccion y accesibilidad basica.
