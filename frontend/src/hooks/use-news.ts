'use client';

import { useQuery } from '@tanstack/react-query';
import { newsApi } from '@/services/api';
import { PAGINATION, CACHE_CONFIG } from '@/constants';

/**
 * Хук для получения новостей
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useNews({ page: 1, limit: 6 });
 * ```
 */
export function useNews(page = 1, limit = PAGINATION.defaultPageSize) {
  return useQuery({
    queryKey: ['news', { page, limit }],
    queryFn: () => newsApi.getNews({ page, limit }),
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
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
export function useLatestNews(limit = PAGINATION.latestNewsLimit) {
  return useQuery({
    queryKey: ['news', 'latest', { limit }],
    queryFn: () => newsApi.getLatestNews(limit),
    staleTime: CACHE_CONFIG.staleTime,
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
    staleTime: CACHE_CONFIG.staleTime,
  });
}
