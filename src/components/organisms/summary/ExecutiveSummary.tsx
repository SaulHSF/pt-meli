import type { SummaryMetrics } from '@/domain/types/adoption';

interface ExecutiveSummaryProps {
  metrics: SummaryMetrics | null;
  loading?: boolean;
}

const METRIC_CARDS = [
  { key: 'teamSize', label: 'Tamaño del equipo', value: (m: SummaryMetrics) => m.teamSize, accent: 'border-l-slate-400' },
  { key: 'daily', label: 'Usuarios Daily', value: (m: SummaryMetrics) => `${m.dailyCount} (${m.dailyPercent}%)`, accent: 'border-l-emerald-500' },
  { key: 'noUse', label: 'Usuarios No Use', value: (m: SummaryMetrics) => `${m.noUseCount} (${m.noUsePercent}%)`, accent: 'border-l-zinc-500' },
  { key: 'low', label: 'Usuarios Low', value: (m: SummaryMetrics) => `${m.lowCount} (${m.lowPercent}%)`, accent: 'border-l-amber-500' },
  { key: 'frequent', label: 'Usuarios Frequent', value: (m: SummaryMetrics) => `${m.frequentCount} (${m.frequentPercent}%)`, accent: 'border-l-sky-500' },
] as const;

export function ExecutiveSummary({ metrics, loading }: Readonly<ExecutiveSummaryProps>) {
  if (loading) {
    return (
      <section
        className="rounded-xl border border-stroke-default bg-surface-card p-6 shadow-sm"
        aria-label="Resumen ejecutivo"
      >
        <h2 className="mb-4 text-lg font-semibold">Resumen ejecutivo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-surface-secondary" />
          ))}
        </div>
      </section>
    );
  }

  if (!metrics) return null;

  return (
    <section
      className="rounded-xl border border-stroke-default bg-surface-card p-6 shadow-sm"
      aria-labelledby="summary-heading"
      aria-describedby="summary-desc"
    >
      <h2 id="summary-heading" className="mb-2 text-lg font-semibold">
        Resumen ejecutivo
      </h2>
      <p id="summary-desc" className="mb-4 text-sm text-content-secondary">
        Métricas clave del último mes
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {METRIC_CARDS.map(({ key, label, value, accent }) => (
          <div
            key={key}
            className={`rounded-lg border border-stroke-default border-l-4 p-3 ${accent} transition-transform duration-150 hover:-translate-y-0.5`}
          >
            <p className="text-xs text-content-secondary">{label}</p>
            <p className="text-lg font-semibold leading-tight">{value(metrics)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
