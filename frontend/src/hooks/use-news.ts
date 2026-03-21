'use client';

import { useQuery } from '@tanstack/react-query';
import { newsApi } from '@/services/api';

/**
 * Хук для получения новостей
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useNews({ page: 1, limit: 6 });
 * ```
 */
export function useNews(page = 1, limit = 6) {
  return useQuery({
    queryKey: ['news', { page, limit }],
    queryFn: () => newsApi.getNews({ page, limit }),
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 30,   // 30 минут
  });
}

/**
 * Хук для получения последних новостей
 * 
 * @example
 * ```tsx
 * const { data: latestNews } = useLatestNews(5);
 * ```
 */
export function useLatestNews(limit = 5) {
  return useQuery({
    queryKey: ['news', 'latest', { limit }],
    queryFn: () => newsApi.getLatestNews(limit),
    staleTime: 1000 * 60 * 5, // 5 минут
  });
}

/**
 * Хук для получения новости по ID
 * 
 * @example
 * ```tsx
 * const { data: news } = useNewsById('uuid');
 * ```
 */
export function useNewsById(id: string) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsApi.getNewsById(id),
    enabled: !!id, // Запрос только если есть ID
    staleTime: 1000 * 60 * 5, // 5 минут
  });
}
