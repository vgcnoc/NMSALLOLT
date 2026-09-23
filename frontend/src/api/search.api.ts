import { api } from './client';
import type { SearchResult } from '@/types';

export const searchApi = {
  globalSearch: (query: string) =>
    api.get<SearchResult[]>('/search', { params: { q: query } }),
};