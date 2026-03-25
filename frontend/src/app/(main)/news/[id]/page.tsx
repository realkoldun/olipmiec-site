import { notFound } from 'next/navigation';
import { NewsDetailPageClient } from '@/components/news/news-detail-page-client';
import { newsApi } from '@/services/api/news.api';

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

  // Получение новости на сервере через API
  let news;
  try {
    news = await newsApi.getNewsById(id);
  } catch (error) {
    // Если новость не найдена (404 от API)
    notFound();
  }

  // Если новость не найдена — 404
  if (!news) {
    notFound();
  }

  return <NewsDetailPageClient news={news} />;
}
