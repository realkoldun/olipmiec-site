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
 * Маппинг ответа бэкенда в тип NewsItem
 */
function mapNewsToClient(news: any): NewsItem {
  return {
    id: news.id,
    title: news.title,
    content: news.content,
    excerpt: news.excerpt || news.content?.substring(0, 200) + '...',
    image: news.imageUrl || news.image,
    author: news.author,
    createdAt: news.createdAt || news.postDate,
    updatedAt: news.updatedAt,
    tags: news.tags || [],
    category: news.category,
    published: news.published ?? true,
    views: news.views,
  };
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
    return {
      ...response.data,
      data: response.data.data.map(mapNewsToClient),
    };
  },

  /**
   * Получить последние новости
   */
  async getLatestNews(limit = 5): Promise<NewsItem[]> {
    const response = await apiClient.get<any[]>('/api/news/latest', {
      params: { limit },
    });
    return response.data.map(mapNewsToClient);
  },

  /**
   * Получить новость по ID
   */
  async getNewsById(id: string): Promise<NewsItem> {
    try {
      const response = await apiClient.get<any>(`/api/news/${id}`);
      return mapNewsToClient(response.data);
    } catch (error: any) {
      // Пробрасываем ошибку дальше для обработки в странице
      if (error.response?.status === 404) {
        throw new Error('News not found');
      }
      throw error;
    }
  },
};
