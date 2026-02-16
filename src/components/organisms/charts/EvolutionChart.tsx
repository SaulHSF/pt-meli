import { Bar } from 'recharts';
import { useEffect, useState } from 'react';
import { BaseBarChart } from '@/components/atoms/charts/BaseBarChart';
import { ChartCard } from '@/components/molecules/charts/ChartCard';
import type { EvolutionDataPoint } from '@/domain/types/adoption';

interface EvolutionChartProps {
  data: EvolutionDataPoint[];
  title: string;
  loading?: boolean;
}

const COLORS = {
  noUse: 'var(--color-no-use)',
  low: 'var(--color-low)',
  frequent: 'var(--color-frequent)',
  daily: 'var(--color-daily)',
};
const LEGEND_TIP_STORAGE_KEY = 'evolution-chart-legend-tip-dismissed';
const LEGEND_TIP_EVENT = 'evolution-chart-legend-tip-dismissed';

export function EvolutionChart({ data, title, loading }: Readonly<EvolutionChartProps>) {
  const chartId = title.split(' ').join('-').toLowerCase();
  const [showLegendTip, setShowLegendTip] = useState(false);

  useEffect(() => {
    try {
      const dismissed = globalThis.localStorage.getItem(LEGEND_TIP_STORAGE_KEY) === 'true';
      setShowLegendTip(!dismissed);
    } catch {
      setShowLegendTip(true);
    }
  }, []);

  useEffect(() => {
    const handleDismiss = () => setShowLegendTip(false);
    globalThis.addEventListener(LEGEND_TIP_EVENT, handleDismiss);
    return () => globalThis.removeEventListener(LEGEND_TIP_EVENT, handleDismiss);
  }, []);

  const dismissLegendTip = () => {
    try {
      globalThis.localStorage.setItem(LEGEND_TIP_STORAGE_KEY, 'true');
    } catch {
      // no-op if storage is not available
    }
    setShowLegendTip(false);
    globalThis.dispatchEvent(new Event(LEGEND_TIP_EVENT));
  };

  return (
    <ChartCard
      title={title}
      description="Evolución mes a mes (últimos 6 meses)"
      chartId={chartId}
      helperText={
        showLegendTip
          ? 'Tip: haz clic en la leyenda para ocultar o mostrar series.'
          : undefined
      }
      onDismissHelperText={showLegendTip ? dismissLegendTip : undefined}
      loading={loading}
      isEmpty={!data || data.length === 0}
    >
      <BaseBarChart
        data={data as unknown as Record<string, unknown>[]}
        showLegend
        height={320}
        xAxis={{ dataKey: 'month' }}
      >
        <Bar dataKey="noUse" stackId="a" fill={COLORS.noUse} name="No Use" />
        <Bar dataKey="low" stackId="a" fill={COLORS.low} name="Low" />
        <Bar dataKey="frequent" stackId="a" fill={COLORS.frequent} name="Frequent" />
        <Bar dataKey="daily" stackId="a" fill={COLORS.daily} name="Daily" />
      </BaseBarChart>
    </ChartCard>
  );
}
