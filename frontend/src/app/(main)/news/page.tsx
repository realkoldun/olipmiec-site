import { NewsPageClient } from '@/components/news/news-page-client';
import { mockNews } from '@/mocks/news.mock';

/**
 * Страница новостей — серверный компонент
 * Передаём все новости на клиент для фильтрации и пагинации
 */
export default async function NewsPage() {
  // Получаем все новости на сервере
  const allNews = mockNews.filter((news) => news.published);

  return (
    <NewsPageClient
      allNews={allNews}
    />
  );
}
