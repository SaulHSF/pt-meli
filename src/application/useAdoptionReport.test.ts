import { act, renderHook, waitFor } from '@testing-library/react';
import { useAdoptionReport } from '@/application/useAdoptionReport';
import { AdoptionApiAdapter } from '@/adapters/api/adoptionApiAdapter';
import { useAdoptionStore } from '@/stores/adoptionStore';
import type { AdoptionRecord } from '@/domain/types/adoption';

const reportData: AdoptionRecord[] = [
  {
    userId: 'u1',
    month: '2024-01',
    tools: {
      Windsurf: 'No Use',
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
      Windsurf: 'Daily',
      Cursor: 'Frequent',
      Copilot: 'Low',
      ChatGPT: 'No Use',
      Gemini: 'Daily',
      Notebook: 'No Use',
    },
  },
];

describe('useAdoptionReport', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAdoptionStore.getState().reset();
  });

  it('fetches data on first mount when store is empty', async () => {
    const getAdoptionDataSpy = vi
      .spyOn(AdoptionApiAdapter.prototype, 'getAdoptionData')
      .mockResolvedValue(reportData);

    const { result } = renderHook(() => useAdoptionReport());

    await waitFor(() => {
      expect(getAdoptionDataSpy).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.summary).not.toBeNull();
      expect(result.current.lastMonth).toBe('2024-02');
    });
  });

  it('does not fetch again when data already exists in store', async () => {
    useAdoptionStore.getState().setData(reportData);
    const getAdoptionDataSpy = vi
      .spyOn(AdoptionApiAdapter.prototype, 'getAdoptionData')
      .mockResolvedValue([]);

    const { result } = renderHook(() => useAdoptionReport());

    await waitFor(() => {
      expect(result.current.lastMonth).toBe('2024-02');
    });

    expect(getAdoptionDataSpy).not.toHaveBeenCalled();
  });

  it('returns empty derived data when store has no adoption records', async () => {
    useAdoptionStore.getState().setData([]);

    const { result } = renderHook(() => useAdoptionReport());

    await waitFor(() => {
      expect(result.current.summary).toBeNull();
      expect(result.current.evolutionCodingTools).toEqual([]);
      expect(result.current.evolutionGeneralTools).toEqual([]);
      expect(result.current.usageByTool).toEqual([]);
      expect(result.current.lastMonth).toBeNull();
    });
  });

  it('sets error when refetch fails', async () => {
    useAdoptionStore.getState().setData(reportData);
    const getAdoptionDataSpy = vi
      .spyOn(AdoptionApiAdapter.prototype, 'getAdoptionData')
      .mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useAdoptionReport());

    await act(async () => {
      await result.current.refetch();
    });

    expect(getAdoptionDataSpy).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('network error');
  });
});
