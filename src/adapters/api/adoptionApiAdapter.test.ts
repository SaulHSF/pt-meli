import { AdoptionApiAdapter } from '@/adapters/api/adoptionApiAdapter';
import type { AdoptionRecord } from '@/domain/types/adoption';

describe('AdoptionApiAdapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns adoption data when request is successful', async () => {
    const payload: AdoptionRecord[] = [
      {
        userId: 'u1',
        month: '2024-02',
        tools: { Windsurf: 'Daily' },
      },
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new AdoptionApiAdapter();
    const result = await adapter.getAdoptionData();

    expect(fetchMock).toHaveBeenCalledWith('/api/adoption');
    expect(result).toEqual(payload);
  });

  it('returns empty array when response body is not an array', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new AdoptionApiAdapter();
    const result = await adapter.getAdoptionData();

    expect(result).toEqual([]);
  });

  it('throws a descriptive error when response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new AdoptionApiAdapter();

    await expect(adapter.getAdoptionData()).rejects.toThrow(
      'Failed to fetch adoption data: 500'
    );
  });
});
