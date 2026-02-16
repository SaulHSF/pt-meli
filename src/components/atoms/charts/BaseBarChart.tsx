import { Children, cloneElement, isValidElement, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartLayout = 'horizontal' | 'vertical';
type AxisType = 'number' | 'category';
type ChartHeight = number | `${number}%`;
type ChartChildProps = {
  dataKey?: unknown;
  children?: ReactNode;
};

interface AxisConfig {
  dataKey?: string;
  type?: AxisType;
  width?: number;
  fontSize?: number;
}

interface MarginConfig {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface BaseBarChartProps {
  data: Record<string, unknown>[];
  children: ReactNode;
  layout?: ChartLayout;
  height?: ChartHeight;
  margin?: MarginConfig;
  showLegend?: boolean;
  legendToggle?: boolean;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
}

export function BaseBarChart({
  data,
  children,
  layout = 'horizontal',
  height = 320,
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  showLegend = false,
  legendToggle = true,
  xAxis,
  yAxis,
}: Readonly<BaseBarChartProps>) {
  const seriesKeys = useMemo(() => extractSeriesKeys(children), [children]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});

  const hasLegendToggle = showLegend && legendToggle && seriesKeys.length > 0;

  const toggleSeriesVisibility = (entry: unknown) => {
    if (!hasLegendToggle) return;
    const dataKey = getLegendDataKey(entry);
    if (!dataKey) return;

    setHiddenSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const chartChildren = useMemo(
    () => applySeriesVisibility(children, hiddenSeries),
    [children, hiddenSeries]
  );

  const legendFormatter = (value: string, entry: unknown) => {
    const dataKey = getLegendDataKey(entry);
    const isHidden = dataKey ? Boolean(hiddenSeries[dataKey]) : false;
    return <span className={isHidden ? 'opacity-40 line-through' : ''}>{value}</span>;
  };

  const resolvedXAxisType: AxisType = xAxis?.type ?? (layout === 'vertical' ? 'number' : 'category');
  const resolvedYAxisType: AxisType = yAxis?.type ?? (layout === 'vertical' ? 'category' : 'number');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout}
        margin={margin}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          {...(xAxis?.dataKey ? { dataKey: xAxis.dataKey } : {})}
          type={resolvedXAxisType}
          stroke="var(--color-text-secondary)"
          fontSize={xAxis?.fontSize ?? 12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          {...(yAxis?.dataKey ? { dataKey: yAxis.dataKey } : {})}
          type={resolvedYAxisType}
          {...(typeof yAxis?.width === 'number' ? { width: yAxis.width } : {})}
          stroke="var(--color-text-secondary)"
          fontSize={yAxis?.fontSize ?? 12}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'var(--color-bg-secondary)', opacity: 0.35 }}
          contentStyle={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          }}
          labelStyle={{
            color: 'var(--color-text-primary)',
            fontWeight: 600,
          }}
        />
        {showLegend && (
          <Legend
            onClick={hasLegendToggle ? toggleSeriesVisibility : undefined}
            formatter={hasLegendToggle ? legendFormatter : undefined}
            wrapperStyle={{
              cursor: hasLegendToggle ? 'pointer' : undefined,
              paddingTop: 8,
            }}
          />
        )}
        {chartChildren}
      </BarChart>
    </ResponsiveContainer>
  );
}

function extractSeriesKeys(children: ReactNode): string[] {
  const keys = new Set<string>();

  Children.forEach(children, (child) => {
    if (!isValidElement<ChartChildProps>(child)) return;

    const dataKey = child.props?.dataKey;
    if (typeof dataKey === 'string') {
      keys.add(dataKey);
    }

    if (child.props?.children) {
      extractSeriesKeys(child.props.children).forEach((key) => keys.add(key));
    }
  });

  return [...keys];
}

function applySeriesVisibility(
  children: ReactNode,
  hiddenSeries: Record<string, boolean>
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement<ChartChildProps>(child)) return child;

    const dataKey = child.props?.dataKey;
    const shouldHide = typeof dataKey === 'string' ? Boolean(hiddenSeries[dataKey]) : false;

    if (child.props?.children) {
      const nestedChildren = applySeriesVisibility(child.props.children, hiddenSeries);
      return cloneElement(child as ReactElement<Record<string, unknown>>, { children: nestedChildren });
    }

    if (typeof dataKey === 'string') {
      return cloneElement(child as ReactElement<Record<string, unknown>>, { hide: shouldHide });
    }

    return child;
  });
}

function getLegendDataKey(entry: unknown): string | null {
  if (!entry || typeof entry !== 'object') return null;
  const maybeDataKey = (entry as { dataKey?: unknown }).dataKey;
  return typeof maybeDataKey === 'string' ? maybeDataKey : null;
}
