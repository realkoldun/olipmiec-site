import { NewsPageClient } from '@/components/news/news-page-client';
import { getNews } from '@/mocks/news.mock';

/**
 * Страница новостей — серверный компонент
 * Данные загружаются на сервере, клиентская часть только для интерактивности
 */
export interface NewsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category;

  const itemsPerPage = 6;

  // Получение новостей на сервере
  const {
    items: news,
    total,
    totalPages,
  } = getNews({
    page,
    limit: itemsPerPage,
    category,
  });

  return (
    <NewsPageClient
      initialNews={news}
      total={total}
      totalPages={totalPages}
      initialPage={page}
      initialCategory={category}
    />
  );
}
