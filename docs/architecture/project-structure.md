# Project Structure

## Estructura principal

```text
src/
├── domain/         # Logica de negocio pura
├── ports/          # Contratos de infraestructura
├── adapters/       # Implementaciones concretas (API)
├── stores/         # Estado global (Zustand)
├── application/    # Hooks/casos de uso
├── components/     # UI (atoms, molecules, organisms, templates)
├── pages/          # Vistas/paginas
├── routes/         # Meta de rutas
└── themes/         # Tokens CSS y temas
```

## Convenciones de naming

- Componentes React: `PascalCase.tsx`
- Hooks: `useXxx.ts`
- Servicios/utilidades de dominio: `camelCase.ts`
- Contratos/puertos: `PascalCase.ts`
- Tests de UI: `*.spec.tsx`
- Tests de dominio/aplicacion/infra: `*.test.ts` o `*.spec.ts`

## Reglas de dependencias

- `domain`: no importa de UI, stores ni adapters.
- `ports`: define interfaces/contratos.
- `adapters`: implementa puertos.
- `application`: orquesta domain + stores + adapters.
- `components/pages`: consumen hooks de `application`.

## Archivos clave

- `src/domain/services/adoptionMetrics.ts`
- `src/application/useAdoptionReport.ts`
- `src/stores/adoptionStore.ts`
- `src/adapters/api/adoptionApiAdapter.ts`
- `src/pages/ReportPage.tsx`
