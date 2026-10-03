import { apiClient } from '../../../api/client';
import type { SearchResult } from '../types';

export const searchApi = {
  search: (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return Promise.resolve([]);
    return apiClient.get<SearchResult[]>(`/search?query=${encodeURIComponent(query.trim())}`);
  },
};
