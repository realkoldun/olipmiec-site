import { NewsPageClient } from '@/components/news/news-page-client';
import { getNews } from '@/mocks/news.mock';

/**
 * Страница новостей — серверный компонент
 * Пагинация и фильтрация на сервере через URL параметры
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

  // Получение новостей на сервере с пагинацией
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
      news={news}
      page={page}
      total={total}
      totalPages={totalPages}
      category={category}
    />
  );
}
