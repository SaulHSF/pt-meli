# ADR 0001: Arquitectura Hexagonal Ligera

- Estado: Accepted
- Fecha: 2026-02-16

## Contexto

Se requiere desacoplar logica de negocio de infraestructura y UI para facilitar mantenimiento y testing.

## Decision

Adoptar una variante ligera de Ports and Adapters:

- `domain` para logica pura
- `ports` para contratos
- `adapters` para implementaciones externas
- `application` para orquestacion
- `components/pages` para presentacion

## Consecuencias

### Positivas

- Mayor testabilidad del dominio.
- Facilidad para reemplazar API mock por API real.
- Menor acoplamiento entre UI y capa de datos.

### Negativas

- Mayor cantidad de archivos/capas.
- Requiere disciplina en reglas de importacion.

## Alternativas consideradas

- Arquitectura por features sin puertos explicitos.
- UI consumiendo API directamente sin capa de application.
