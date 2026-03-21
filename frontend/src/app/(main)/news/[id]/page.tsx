import { notFound } from 'next/navigation';
import { NewsDetailPageClient } from '@/components/news/news-detail-page-client';
import { getNewsById } from '@/mocks/news.mock';

/**
 * Детальная страница новости — серверный компонент
 */
export interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;

  // Получение новости на сервере
  const news = getNewsById(id);

  // Если новость не найдена — 404
  if (!news) {
    notFound();
  }

  return <NewsDetailPageClient news={news} />;
}
