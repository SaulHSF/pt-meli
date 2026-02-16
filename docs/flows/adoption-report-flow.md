# Adoption Report Flow

## Flujo funcional

```mermaid
flowchart TD
  loadPage[User_opens_report_page] --> invokeHook[useAdoptionReport]
  invokeHook --> checkStore{Store_has_data}
  checkStore -- no --> fetchApi[AdoptionApiAdapter_fetch]
  fetchApi --> updateStore[Store_setData]
  checkStore -- yes --> deriveData[Compute_metrics]
  updateStore --> deriveData
  deriveData --> renderSummary[Render_ExecutiveSummary]
  deriveData --> renderEvolution[Render_EvolutionCharts]
  deriveData --> renderUsage[Render_UsageByToolChart]
```

## Casos clave

- Carga inicial sin datos en store.
- Reuso de datos ya cargados.
- Estado de error con opcion de reintento.
- Render de estados `loading` y `empty`.
