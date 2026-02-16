/**
 * Domain service - Adoption metrics calculation
 * Pure business logic. No side effects, no I/O.
 */

import type {
  AdoptionRecord,
  LevelCounts,
  SummaryMetrics,
  EvolutionDataPoint,
  UsageByToolDataPoint,
  ToolName,
  UsageLevel,
} from '../types/adoption';
import {
  CODING_TOOLS,
  GENERAL_TOOLS,
  ALL_TOOLS,
} from '../types/adoption';

/** Count users per level for a set of records */
function countByLevel(records: AdoptionRecord[], toolNames: ToolName[]): LevelCounts {
  const counts: LevelCounts = {
    noUse: 0,
    low: 0,
    frequent: 0,
    daily: 0,
  };

  for (const record of records) {
    for (const tool of toolNames) {
      const level = record.tools[tool] ?? 'No Use';
      switch (level) {
        case 'No Use':
          counts.noUse++;
          break;
        case 'Low':
          counts.low++;
          break;
        case 'Frequent':
          counts.frequent++;
          break;
        case 'Daily':
          counts.daily++;
          break;
      }
    }
  }

  return counts;
}

/** Get unique users for a month (team size) */
export function getTeamSize(records: AdoptionRecord[]): number {
  const users = new Set(records.map((r) => r.userId));
  return users.size;
}

/** Compute executive summary for a month */
export function computeSummary(
  records: AdoptionRecord[],
  toolNames: ToolName[] = ALL_TOOLS
): SummaryMetrics {
  const teamSize = getTeamSize(records);
  const counts = countByLevel(records, toolNames);

  const total = counts.noUse + counts.low + counts.frequent + counts.daily;
  const toPercent = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return {
    teamSize,
    dailyCount: counts.daily,
    dailyPercent: toPercent(counts.daily),
    noUseCount: counts.noUse,
    noUsePercent: toPercent(counts.noUse),
    lowCount: counts.low,
    lowPercent: toPercent(counts.low),
    frequentCount: counts.frequent,
    frequentPercent: toPercent(counts.frequent),
  };
}

/** Get last N months from records, sorted chronologically */
export function getLastNMonths(records: AdoptionRecord[], n: number): string[] {
  const months = [...new Set(records.map((r) => r.month))].sort();
  return months.slice(-n);
}

/** Expand records: one row per user per tool (for aggregation by month+tool) */
function expandRecords(records: AdoptionRecord[]): Array<{ userId: string; month: string; tool: ToolName; level: UsageLevel }> {
  const expanded: Array<{ userId: string; month: string; tool: ToolName; level: UsageLevel }> = [];

  for (const record of records) {
    for (const tool of ALL_TOOLS) {
      expanded.push({
        userId: record.userId,
        month: record.month,
        tool,
        level: (record.tools[tool] as UsageLevel) ?? 'No Use',
      });
    }
  }

  return expanded;
}

/** Evolution data for Coding Tools (last 6 months) */
export function getEvolutionCodingTools(
  records: AdoptionRecord[],
  months: string[]
): EvolutionDataPoint[] {
  const expanded = expandRecords(records);
  return months.map((month) => {
    const monthData = expanded.filter(
      (e) => e.month === month && CODING_TOOLS.includes(e.tool)
    );
    const counts = countByLevelFromExpanded(monthData);
    return { month: formatMonthLabel(month), ...counts };
  });
}

/** Evolution data for General Tools (last 6 months) */
export function getEvolutionGeneralTools(
  records: AdoptionRecord[],
  months: string[]
): EvolutionDataPoint[] {
  const expanded = expandRecords(records);
  return months.map((month) => {
    const monthData = expanded.filter(
      (e) => e.month === month && GENERAL_TOOLS.includes(e.tool)
    );
    const counts = countByLevelFromExpanded(monthData);
    return { month: formatMonthLabel(month), ...counts };
  });
}

function countByLevelFromExpanded(
  expanded: Array<{ level: UsageLevel }>
): Omit<LevelCounts, never> {
  const counts: LevelCounts = {
    noUse: 0,
    low: 0,
    frequent: 0,
    daily: 0,
  };
  for (const e of expanded) {
    switch (e.level) {
      case 'No Use':
        counts.noUse++;
        break;
      case 'Low':
        counts.low++;
        break;
      case 'Frequent':
        counts.frequent++;
        break;
      case 'Daily':
        counts.daily++;
        break;
    }
  }
  return counts;
}

/** Usage by tool for last month - users who used each tool */
export function getUsageByTool(
  records: AdoptionRecord[],
  toolNames: ToolName[] = ALL_TOOLS
): UsageByToolDataPoint[] {
  const expanded = expandRecords(records);
  const lastMonth = getLastNMonths(records, 1)[0];
  if (!lastMonth) return [];

  const monthData = expanded.filter((e) => e.month === lastMonth);
  const uniqueUsers = new Set(monthData.map((e) => e.userId));

  return toolNames.map((tool) => {
    const toolData = monthData.filter((e) => e.tool === tool);
    const withUse = toolData.filter((e) => e.level !== 'No Use').length;
    const totalUsers = uniqueUsers.size;
    return {
      tool,
      totalUsers,
      withUse,
    };
  });
}

function formatMonthLabel(month: string): string {
  const [y, m] = month.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const idx = parseInt(m, 10) - 1;
  return `${months[idx] ?? m} ${y}`;
}
