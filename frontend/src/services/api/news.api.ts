import type { NewsItem } from '@/types/news';
import apiClient from './api-client';

/**
 * Ответ от API с пагинацией
 */
export interface NewsApiResponse {
  data: NewsItem[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Параметры для получения новостей
 */
export interface GetNewsParams {
  page?: number;
  limit?: number;
  category?: string;
}

/**
 * NewsService - сервис для работы с новостями через API
 */
export const newsApi = {
  /**
   * Получить все новости с пагинацией
   */
  async getNews({ page = 1, limit = 10 }: GetNewsParams = {}): Promise<NewsApiResponse> {
    const response = await apiClient.get<NewsApiResponse>('/api/news', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Получить последние новости
   */
  async getLatestNews(limit = 5): Promise<NewsItem[]> {
    const response = await apiClient.get<NewsItem[]>('/api/news/latest', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Получить новость по ID
   */
  async getNewsById(id: string): Promise<NewsItem> {
    const response = await apiClient.get<NewsItem>(`/api/news/${id}`);
    return response.data;
  },
};
