'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import { getNewsById } from '@/mocks/news.mock';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/utils/cn';

/**
 * Детальная страница новости
 *
 * Особенности:
 * - Полное содержимое новости
 * - Мета-информация
 * - Навигация назад
 * - Теги
 */
export default function NewsDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Получаем ID из params или из pathname (для Storybook)
  const newsId = params?.id || pathname?.split('/').pop() || '';

  // Получение новости
  const news = getNewsById(newsId);

  // Если новость не найдена
  if (!news) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-[1400px]">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-2">Новость не найдена</h1>
          <p className="text-muted-foreground mb-4">
            К сожалению, такая новость не найдена
          </p>
          <Button onClick={() => router.push('/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к новостям
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-[1400px]">
      {/* Навигация назад */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад
      </Button>

      {/* Контент новости */}
      <article className="mx-auto max-w-3xl">
        {/* Заголовок */}
        <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
          {news.title}
        </h1>

        {/* Мета-информация */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {/* Дата */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(news.createdAt)}</span>
          </div>

          {/* Автор */}
          {news.author && (
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{news.author}</span>
            </div>
          )}

          {/* Просмотры */}
          {news.views !== undefined && (
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{news.views} просмотров</span>
            </div>
          )}
        </div>

        {/* Изображение */}
        {news.image && (
          <figure className="mb-8">
            <img
              src={news.image}
              alt={news.title}
              className="w-full rounded-lg object-cover"
              style={{ aspectRatio: '16/9' }}
            />
            {news.excerpt && (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                {news.excerpt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Содержимое */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {news.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Теги */}
        {news.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
            {news.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Категория */}
        {news.category && (
          <div className={cn(
            'mt-4 inline-flex items-center rounded bg-primary px-3 py-1 text-sm font-medium text-primary-foreground',
            news.category === 'sport' && 'bg-blue-600',
            news.category === 'announcement' && 'bg-orange-600',
            news.category === 'event' && 'bg-green-600',
            news.category === 'news' && 'bg-slate-600',
          )}>
            {getCategoryLabel(news.category)}
          </div>
        )}
      </article>
    </div>
  );
}

/**
 * Получить название категории
 */
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    sport: 'Спорт',
    announcement: 'Объявление',
    event: 'Мероприятие',
    news: 'Новости',
  };
  return labels[category] || category;
}

/**
 * Форматировать дату
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
