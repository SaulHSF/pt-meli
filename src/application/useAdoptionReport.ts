/**
 * Application layer - useAdoptionReport hook
 * Orchestrates: fetch (via store), domain metrics, exposes derived data.
 * Single source of consumption for UI components.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useAdoptionStore } from '@/stores/adoptionStore';
import { AdoptionApiAdapter } from '@/adapters/api/adoptionApiAdapter';
import {
  computeSummary,
  getLastNMonths,
  getEvolutionCodingTools,
  getEvolutionGeneralTools,
  getUsageByTool,
} from '@/domain/services/adoptionMetrics';
import type {
  SummaryMetrics,
  EvolutionDataPoint,
  UsageByToolDataPoint,
} from '@/domain/types/adoption';

const adapter = new AdoptionApiAdapter();

export interface UseAdoptionReportReturn {
  summary: SummaryMetrics | null;
  evolutionCodingTools: EvolutionDataPoint[];
  evolutionGeneralTools: EvolutionDataPoint[];
  usageByTool: UsageByToolDataPoint[];
  lastMonth: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAdoptionReport(): UseAdoptionReportReturn {
  const { data, loading, error, setData, setLoading, setError } =
    useAdoptionStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adapter.getAdoptionData();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, [setData, setLoading, setError]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    const { data: d, loading: l } = useAdoptionStore.getState();
    if (!d && !l) fetchData();
  }, [fetchData]);

  const derived = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        summary: null,
        evolutionCodingTools: [] as EvolutionDataPoint[],
        evolutionGeneralTools: [] as EvolutionDataPoint[],
        usageByTool: [] as UsageByToolDataPoint[],
        lastMonth: null as string | null,
      };
    }

    const months = getLastNMonths(data, 6);
    const lastMonth = months[months.length - 1] ?? null;
    const lastMonthRecords = data.filter((r) => r.month === lastMonth);

    return {
      summary: computeSummary(lastMonthRecords),
      evolutionCodingTools: getEvolutionCodingTools(data, months),
      evolutionGeneralTools: getEvolutionGeneralTools(data, months),
      usageByTool: getUsageByTool(lastMonthRecords),
      lastMonth,
    };
  }, [data]);

  return {
    ...derived,
    loading,
    error,
    refetch,
  };
}
