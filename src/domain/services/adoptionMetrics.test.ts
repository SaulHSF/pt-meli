import {
  computeSummary,
  getEvolutionCodingTools,
  getEvolutionGeneralTools,
  getLastNMonths,
  getTeamSize,
  getUsageByTool,
} from '@/domain/services/adoptionMetrics';
import type { AdoptionRecord } from '@/domain/types/adoption';

describe('adoptionMetrics', () => {
  describe('getTeamSize', () => {
    it('counts unique users even with repeated months', () => {
      const records: AdoptionRecord[] = [
        { userId: 'u1', month: '2024-01', tools: {} },
        { userId: 'u1', month: '2024-02', tools: {} },
        { userId: 'u2', month: '2024-01', tools: {} },
      ];

      expect(getTeamSize(records)).toBe(2);
    });

    it('returns 0 for empty input', () => {
      expect(getTeamSize([])).toBe(0);
    });
  });

  describe('computeSummary', () => {
    it('returns zero percentages when there is no data', () => {
      expect(computeSummary([])).toEqual({
        teamSize: 0,
        dailyCount: 0,
        dailyPercent: 0,
        noUseCount: 0,
        noUsePercent: 0,
        lowCount: 0,
        lowPercent: 0,
        frequentCount: 0,
        frequentPercent: 0,
      });
    });

    it('computes counts and percentages for selected tools', () => {
      const records: AdoptionRecord[] = [
        {
          userId: 'u1',
          month: '2024-01',
          tools: {
            Windsurf: 'Daily',
            Cursor: 'Low',
          },
        },
        {
          userId: 'u2',
          month: '2024-01',
          tools: {
            Windsurf: 'No Use',
            Cursor: 'Frequent',
          },
        },
      ];

      const summary = computeSummary(records, ['Windsurf', 'Cursor']);
      expect(summary).toEqual({
        teamSize: 2,
        dailyCount: 1,
        dailyPercent: 25,
        noUseCount: 1,
        noUsePercent: 25,
        lowCount: 1,
        lowPercent: 25,
        frequentCount: 1,
        frequentPercent: 25,
      });
    });
  });

  describe('getLastNMonths', () => {
    it('sorts months and keeps only the latest N', () => {
      const records: AdoptionRecord[] = [
        { userId: 'u1', month: '2024-03', tools: {} },
        { userId: 'u1', month: '2024-01', tools: {} },
        { userId: 'u1', month: '2024-02', tools: {} },
      ];

      expect(getLastNMonths(records, 2)).toEqual(['2024-02', '2024-03']);
    });

    it('returns all months if less than N', () => {
      const records: AdoptionRecord[] = [
        { userId: 'u1', month: '2024-01', tools: {} },
      ];

      expect(getLastNMonths(records, 6)).toEqual(['2024-01']);
    });
  });

  describe('evolution helpers', () => {
    const records: AdoptionRecord[] = [
      {
        userId: 'u1',
        month: '2024-01',
        tools: {
          Windsurf: 'Daily',
          Cursor: 'Low',
          Copilot: 'No Use',
          ChatGPT: 'Frequent',
          Gemini: 'No Use',
          Notebook: 'No Use',
        },
      },
      {
        userId: 'u1',
        month: '2024-02',
        tools: {
          Windsurf: 'No Use',
          Cursor: 'Frequent',
          Copilot: 'Daily',
          ChatGPT: 'No Use',
          Gemini: 'Daily',
          Notebook: 'Low',
        },
      },
    ];

    it('builds coding evolution grouped by month', () => {
      expect(getEvolutionCodingTools(records, ['2024-01', '2024-02'])).toEqual([
        { month: 'Ene 2024', noUse: 1, low: 1, frequent: 0, daily: 1 },
        { month: 'Feb 2024', noUse: 1, low: 0, frequent: 1, daily: 1 },
      ]);
    });

    it('builds general tools evolution grouped by month', () => {
      expect(getEvolutionGeneralTools(records, ['2024-01', '2024-02'])).toEqual([
        { month: 'Ene 2024', noUse: 2, low: 0, frequent: 1, daily: 0 },
        { month: 'Feb 2024', noUse: 1, low: 1, frequent: 0, daily: 1 },
      ]);
    });
  });

  describe('getUsageByTool', () => {
    it('returns usage only for the latest month', () => {
      const records: AdoptionRecord[] = [
        {
          userId: 'u1',
          month: '2024-01',
          tools: {
            Windsurf: 'No Use',
            Cursor: 'No Use',
            Gemini: 'No Use',
          },
        },
        {
          userId: 'u1',
          month: '2024-02',
          tools: {
            Windsurf: 'Daily',
            Cursor: 'No Use',
            Gemini: 'No Use',
          },
        },
        {
          userId: 'u2',
          month: '2024-02',
          tools: {
            Windsurf: 'No Use',
            Cursor: 'Frequent',
            Gemini: 'Daily',
          },
        },
      ];

      expect(getUsageByTool(records, ['Windsurf', 'Cursor', 'Gemini'])).toEqual([
        { tool: 'Windsurf', totalUsers: 2, withUse: 1 },
        { tool: 'Cursor', totalUsers: 2, withUse: 1 },
        { tool: 'Gemini', totalUsers: 2, withUse: 1 },
      ]);
    });

    it('returns empty array when there is no month available', () => {
      expect(getUsageByTool([])).toEqual([]);
    });
  });
});
