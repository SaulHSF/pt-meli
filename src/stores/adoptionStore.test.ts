import { useAdoptionStore } from '@/stores/adoptionStore';
import type { AdoptionRecord } from '@/domain/types/adoption';

const sampleData: AdoptionRecord[] = [
  {
    userId: 'u1',
    month: '2024-02',
    tools: {
      Windsurf: 'Daily',
    },
  },
];

describe('adoptionStore', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAdoptionStore.getState().reset();
  });

  it('setData stores records and clears loading/error', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
    useAdoptionStore.getState().setLoading(true);
    useAdoptionStore.getState().setError(new Error('old error'));

    useAdoptionStore.getState().setData(sampleData);
    const state = useAdoptionStore.getState();

    expect(state.data).toEqual(sampleData);
    expect(state.error).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.lastFetchedAt).toBe(1_000);
  });

  it('setError stores error and stops loading', () => {
    useAdoptionStore.getState().setLoading(true);

    useAdoptionStore.getState().setError(new Error('boom'));
    const state = useAdoptionStore.getState();

    expect(state.error?.message).toBe('boom');
    expect(state.loading).toBe(false);
  });

  it('isStale returns true when cache is old or empty', () => {
    vi.spyOn(Date, 'now').mockReturnValue(100_000);
    expect(useAdoptionStore.getState().isStale()).toBe(true);

    useAdoptionStore.setState({ lastFetchedAt: 100_000 - (5 * 60 * 1000 + 1) });
    expect(useAdoptionStore.getState().isStale()).toBe(true);
  });

  it('isStale returns false when cache is still fresh', () => {
    vi.spyOn(Date, 'now').mockReturnValue(100_000);
    useAdoptionStore.setState({ lastFetchedAt: 100_000 - 1_000 });

    expect(useAdoptionStore.getState().isStale()).toBe(false);
  });

  it('reset restores initial state', () => {
    useAdoptionStore.getState().setLoading(true);
    useAdoptionStore.getState().setError(new Error('boom'));
    useAdoptionStore.getState().setData(sampleData);

    useAdoptionStore.getState().reset();
    const state = useAdoptionStore.getState();

    expect(state.data).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.lastFetchedAt).toBeNull();
  });
});
