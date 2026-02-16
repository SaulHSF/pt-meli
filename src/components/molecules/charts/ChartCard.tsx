import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  description: string;
  chartId: string;
  helperText?: string;
  onDismissHelperText?: () => void;
  loading?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  description,
  chartId,
  helperText,
  onDismissHelperText,
  loading = false,
  isEmpty = false,
  emptyText = 'No hay datos disponibles',
  children,
}: Readonly<ChartCardProps>) {
  if (loading) {
    return (
      <section className="flex h-full flex-col rounded-xl border border-stroke-default bg-surface-card p-6 shadow-sm">
        <div className="mb-4 h-4 w-1/3 animate-pulse rounded bg-surface-secondary" />
        <div className="h-full min-h-[280px] animate-pulse rounded-lg bg-surface-secondary" />
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="flex h-full flex-col rounded-xl border border-stroke-default bg-surface-card p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-content-secondary">{emptyText}</p>
      </section>
    );
  }

  return (
    <section
      className="flex h-full flex-col rounded-xl border border-stroke-default bg-surface-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
      aria-labelledby={`${chartId}-title`}
      aria-describedby={`${chartId}-desc`}
    >
      <h3 id={`${chartId}-title`} className="mb-2 text-lg font-semibold leading-tight">
        {title}
      </h3>
      <p id={`${chartId}-desc`} className="mb-4 text-sm text-content-secondary">
        {description}
      </p>
      {helperText && (
        <div className="mb-3 flex items-start justify-between gap-3 rounded-md bg-surface-secondary px-3 py-2 text-xs text-content-secondary">
          <p>{helperText}</p>
          {onDismissHelperText && (
            <button
              type="button"
              onClick={onDismissHelperText}
              className="rounded px-2 py-0.5 text-xs font-medium text-content-secondary transition-colors hover:bg-stroke-default"
              aria-label="Cerrar ayuda"
            >
              Entendido
            </button>
          )}
        </div>
      )}
      <div className="h-full min-h-[280px] flex-1">{children}</div>
    </section>
  );
}
