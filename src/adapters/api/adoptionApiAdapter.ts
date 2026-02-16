/**
 * Adapter - HTTP implementation of AdoptionRepository
 * Fetches data from json-server. Replaceable without touching domain.
 */

import type { AdoptionRecord } from '@/domain/types/adoption';
import type { AdoptionRepository } from '@/ports/AdoptionRepository';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export class AdoptionApiAdapter implements AdoptionRepository {
  async getAdoptionData(): Promise<AdoptionRecord[]> {
    const res = await fetch(`${API_BASE}/adoption`);
    if (!res.ok) {
      throw new Error(`Failed to fetch adoption data: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
}
