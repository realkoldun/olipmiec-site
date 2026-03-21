'use client';

import { useNews } from '@/hooks/use-news';
import { NewsPageContent } from '@/components/news/news-page-content';
import { SiteLayout } from '@/components/layout/site-layout';

/**
 * Страница новостей — клиентский компонент с React Query
 */
export default function NewsPage() {
  const { data, isLoading, error } = useNews(1, 6);

  if (isLoading) {
    return (
      <SiteLayout>
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
      </SiteLayout>
    );
  }

  if (error) {
    return (
      <SiteLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center text-destructive">
            <h1 className="text-2xl font-bold mb-2">Ошибка загрузки</h1>
            <p>Не удалось загрузить новости. Попробуйте позже.</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return <NewsPageContent initialData={data} />;
}
