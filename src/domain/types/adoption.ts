/**
 * Domain types - Adoption Report
 * No external dependencies. Pure business entities.
 */

export type UsageLevel = 'No Use' | 'Low' | 'Frequent' | 'Daily';

export type ToolName =
  | 'Windsurf'
  | 'Cursor'
  | 'Copilot'
  | 'ChatGPT'
  | 'Gemini'
  | 'Notebook';

export type ToolCategory = 'coding' | 'general';

/** Raw adoption record per user per month */
export interface AdoptionRecord {
  userId: string;
  month: string; // YYYY-MM
  tools: Partial<Record<ToolName, UsageLevel>>;
}

/** Aggregated counts per level for a given month */
export interface LevelCounts {
  noUse: number;
  low: number;
  frequent: number;
  daily: number;
}

/** Executive summary metrics for a month */
export interface SummaryMetrics {
  teamSize: number;
  dailyCount: number;
  dailyPercent: number;
  noUseCount: number;
  noUsePercent: number;
  lowCount: number;
  lowPercent: number;
  frequentCount: number;
  frequentPercent: number;
}

/** Evolution data point for charts (one month) */
export interface EvolutionDataPoint {
  month: string;
  noUse: number;
  low: number;
  frequent: number;
  daily: number;
}

/** Usage by tool for last month */
export interface UsageByToolDataPoint {
  tool: ToolName;
  totalUsers: number;
  withUse: number; // users that used it (not No Use)
}

export const CODING_TOOLS: ToolName[] = ['Windsurf', 'Cursor', 'Copilot'];
export const GENERAL_TOOLS: ToolName[] = ['ChatGPT', 'Gemini', 'Notebook'];
export const ALL_TOOLS: ToolName[] = [...CODING_TOOLS, ...GENERAL_TOOLS];
