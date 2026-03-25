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
  tags?: string[];
}

/**
 * NewsService - сервис для работы с новостями через API
 */
export const newsApi = {
  /**
   * Получить все новости с пагинацией
   */
  async getNews({ page = 1, limit = 10, category, tags }: GetNewsParams = {}): Promise<NewsApiResponse> {
    const response = await apiClient.get<NewsApiResponse>('/api/news', {
      params: { page, limit, category, tags: tags?.join(',') },
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
    try {
      const response = await apiClient.get<NewsItem>(`/api/news/${id}`);
      return response.data;
    } catch (error: any) {
      // Пробрасываем ошибку дальше для обработки в странице
      if (error.response?.status === 404) {
        throw new Error('News not found');
      }
      throw error;
    }
  },
};
