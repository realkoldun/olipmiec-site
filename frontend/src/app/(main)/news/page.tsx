import { Suspense } from 'react';
import { NewsPageClient } from '@/components/news/news-page-client';
import { newsApi } from '@/services/api/news.api';
import type { NewsItem } from '@/types/news';

/**
 * Страница новостей — серверный компонент с пагинацией через URL
 */
export interface NewsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
  }>;
}

// Адаптация данных с бэкенда к типу NewsItem
function adaptNews(data: any): NewsItem[] {
  return data.data.map((item: any) => ({
    ...item,
    image: item.imageUrl || item.image,
    excerpt: item.excerpt || item.content?.substring(0, 200) + '...',
    tags: item.tags || [],
    published: item.published ?? true,
  }));
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page = '1', limit = '3' } = await searchParams;
  const category = (await searchParams).category;

  // Получаем новости на сервере
  const data = await newsApi.getNews({
    page: parseInt(page),
    limit: parseInt(limit),
  });

  // Адаптируем данные
  const adaptedNews = adaptNews(data);

  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <NewsPageClient
        news={adaptedNews}
        page={data.page}
        total={data.total}
        totalPages={data.totalPages}
        category={category}
      />
    </Suspense>
  );
}
