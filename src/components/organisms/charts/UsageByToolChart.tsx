import { Bar } from 'recharts';
import { useMemo } from 'react';
import { BaseBarChart } from '@/components/atoms/charts/BaseBarChart';
import { ChartCard } from '@/components/molecules/charts/ChartCard';
import type { UsageByToolDataPoint } from '@/domain/types/adoption';

interface UsageByToolChartProps {
  data: UsageByToolDataPoint[];
  title: string;
  loading?: boolean;
}

export function UsageByToolChart({ data, title, loading }: Readonly<UsageByToolChartProps>) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.tool,
        usuarios: d.withUse,
      })),
    [data]
  );

  return (
    <ChartCard
      title={title}
      description="Usuarios que usaron cada herramienta en el último mes"
      chartId="uso-por-herramienta"
      loading={loading}
      isEmpty={!data || data.length === 0}
    >
      <BaseBarChart
        data={chartData as unknown as Record<string, unknown>[]}
        layout="vertical"
        height={320}
        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        xAxis={{ type: 'number' }}
        yAxis={{ type: 'category', dataKey: 'name', width: 70 }}
      >
        <Bar dataKey="usuarios" fill="var(--color-accent)" name="Usuarios" radius={[0, 4, 4, 0]} />
      </BaseBarChart>
    </ChartCard>
  );
}
