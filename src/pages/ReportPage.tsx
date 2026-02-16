import { useAdoptionReport } from '@/application/useAdoptionReport';
import { EvolutionChart } from '@/components/organisms/charts/EvolutionChart';
import { UsageByToolChart } from '@/components/organisms/charts/UsageByToolChart';
import { ExecutiveSummary } from '@/components/organisms/summary/ExecutiveSummary';

export function ReportPage() {
  const {
    summary,
    evolutionCodingTools,
    evolutionGeneralTools,
    usageByTool,
    loading,
    error,
    refetch,
  } = useAdoptionReport();

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        <p className="font-semibold">Error al cargar los datos</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <ExecutiveSummary metrics={summary} loading={loading} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <EvolutionChart
          data={evolutionCodingTools}
          title="Evolución - Coding Tools (Windsurf, Cursor, Copilot)"
          loading={loading}
        />

        <EvolutionChart
          data={evolutionGeneralTools}
          title="Evolución - General Tools (ChatGPT, Gemini, Notebook)"
          loading={loading}
        />
      </div>

      <UsageByToolChart
        data={usageByTool}
        title="Último mes — Uso por herramienta"
        loading={loading}
      />
    </div>
  );
}
