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
      <section className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-sm">
        <div className="mb-4 h-4 w-1/3 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
        <div className="h-full min-h-[280px] animate-pulse rounded-lg bg-[var(--color-bg-secondary)]" />
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-[var(--color-text-secondary)]">{emptyText}</p>
      </section>
    );
  }

  return (
    <section
      className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
      aria-labelledby={`${chartId}-title`}
      aria-describedby={`${chartId}-desc`}
    >
      <h3 id={`${chartId}-title`} className="mb-2 text-lg font-semibold leading-tight">
        {title}
      </h3>
      <p id={`${chartId}-desc`} className="mb-4 text-sm text-[var(--color-text-secondary)]">
        {description}
      </p>
      {helperText && (
        <div className="mb-3 flex items-start justify-between gap-3 rounded-md bg-[var(--color-bg-secondary)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
          <p>{helperText}</p>
          {onDismissHelperText && (
            <button
              type="button"
              onClick={onDismissHelperText}
              className="rounded px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-border)]"
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
