import { matchPath } from 'react-router-dom';

export interface RouteMeta {
  title: string;
  subtitle: string;
}

interface RouteMetaConfig extends RouteMeta {
  path: string;
  end?: boolean;
}

const DEFAULT_META: RouteMeta = {
  title: 'Reporte de Adopción',
  subtitle: 'Dashboard de métricas',
};

const ROUTE_META: RouteMetaConfig[] = [
  {
    path: '/',
    end: true,
    title: 'Reporte de Adopción de Herramientas',
    subtitle: 'Métricas de uso por equipo',
  },
];

export function getRouteMeta(pathname: string): RouteMeta {
  const matched = ROUTE_META.find((route) =>
    matchPath({ path: route.path, end: route.end ?? false }, pathname)
  );

  if (!matched) return DEFAULT_META;
  return { title: matched.title, subtitle: matched.subtitle };
}
