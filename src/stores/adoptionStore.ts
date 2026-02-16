/**
 * Zustand store - Adoption data state
 * Centralized state to avoid unnecessary refetches.
 * Components that need data subscribe; we fetch once and cache.
 */

import { create } from 'zustand';
import type { AdoptionRecord } from '@/domain/types/adoption';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface AdoptionState {
  data: AdoptionRecord[] | null;
  loading: boolean;
  error: Error | null;
  lastFetchedAt: number | null;
  isStale: () => boolean;
}

interface AdoptionActions {
  setData: (data: AdoptionRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

const initialState: AdoptionState = {
  data: null,
  loading: false,
  error: null,
  lastFetchedAt: null,
  isStale: () => true,
};

export const useAdoptionStore = create<AdoptionState & AdoptionActions>((set, get) => ({
  ...initialState,
  isStale: () => {
    const last = get().lastFetchedAt;
    if (!last) return true;
    return Date.now() - last > CACHE_TTL_MS;
  },
  setData: (data) =>
    set({
      data,
      error: null,
      lastFetchedAt: Date.now(),
      loading: false,
    }),
  setLoading: (loading) => set({ loading }),
  setError: (error) =>
    set({
      error,
      loading: false,
    }),
  reset: () =>
    set({
      data: null,
      loading: false,
      error: null,
      lastFetchedAt: null,
    }),
}));
