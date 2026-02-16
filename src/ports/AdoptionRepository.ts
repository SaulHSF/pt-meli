/**
 * Port - Adoption data contract
 * Defines the interface for fetching adoption data.
 * Adapters implement this; domain/application depend on it.
 */

import type { AdoptionRecord } from '@/domain/types/adoption';

export interface AdoptionRepository {
  getAdoptionData(): Promise<AdoptionRecord[]>;
}
