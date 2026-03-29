import type { SearchQuery, SearchResponse } from '@/types/search';
import apiClient from './api-client';

/**
 * SearchService - сервис для работы с поиском через API
 */
export const searchApi = {
  /**
   * Выполнить поиск
   */
  async search(params: SearchQuery): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>('/api/search', {
      params: {
        q: params.query,
        type: params.type,
        page: params.page,
        limit: params.limit,
      },
    });
    return response.data;
  },
};
