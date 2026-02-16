# Data Flow

## Flujo principal de datos

La UI consume un unico punto de entrada: `useAdoptionReport`.

```mermaid
sequenceDiagram
  participant User
  participant Page as ReportPage
  participant Hook as useAdoptionReport
  participant Store as adoptionStore
  participant Adapter as AdoptionApiAdapter
  participant API as json_server

  User->>Page: Abre dashboard
  Page->>Hook: Invoca hook
  Hook->>Store: Lee data/loading/error
  alt Sin data y no loading
    Hook->>Store: setLoading(true)
    Hook->>Adapter: getAdoptionData()
    Adapter->>API: GET /adoption
    API-->>Adapter: adoption[]
    Adapter-->>Hook: adoption[]
    Hook->>Store: setData(adoption[])
  end
  Hook->>Hook: Deriva summary/evolution/usage
  Hook-->>Page: Datos listos para UI
```

## Transformaciones de negocio

- `computeSummary`: resumen ejecutivo del ultimo mes.
- `getEvolutionCodingTools`: evolucion de herramientas coding.
- `getEvolutionGeneralTools`: evolucion de herramientas general.
- `getUsageByTool`: uso por herramienta en ultimo mes.

## Estados de error

- El adapter encapsula errores HTTP y transforma a `Error`.
- El hook captura errores y los expone para la vista.
- La pagina muestra bloque de error y accion de reintento.
