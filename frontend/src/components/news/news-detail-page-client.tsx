'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import type { NewsItem } from '@/types/news';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/utils/cn';
import { Breadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs';
import { SiteLayout } from '@/components/layout/site-layout';

export interface NewsDetailPageClientProps {
  news: NewsItem & {
    // Поля с бэкенда
    imageUrl?: string;
    telegramId?: number;
    hasMedia?: boolean;
    postDate?: string;
  };
}

/**
 * NewsDetailPageClient — клиентский компонент детальной страницы новости
 */
export function NewsDetailPageClient({ news }: NewsDetailPageClientProps) {
  const router = useRouter();

  // Адаптируем данные с бэкенда
  const adaptedNews = {
    ...news,
    image: news.imageUrl || news.image,
    excerpt: news.excerpt || news.content?.substring(0, 200) + '...',
    tags: news.tags || [],
    category: news.category || undefined,
    published: news.published ?? true,
  };

  // Хлебные крошки
  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Новости', href: '/news' },
    { label: adaptedNews.title, href: `/news/${adaptedNews.id}` },
  ];

  return (
    <SiteLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-[1400px]">
        {/* Хлебные крошки */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Кнопка назад */}
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
            {adaptedNews.title}
          </h1>

          {/* Мета-информация */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {/* Дата */}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(adaptedNews.postDate || adaptedNews.createdAt)}</span>
            </div>

            {/* Просмотры */}
            {adaptedNews.views !== undefined && (
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{adaptedNews.views} просмотров</span>
              </div>
            )}
          </div>

          {/* Изображение */}
          {adaptedNews.image && (
            <figure className="mb-8">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={adaptedNews.image}
                  alt={adaptedNews.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  className="rounded-lg object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </figure>
          )}

          {/* Содержимое */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {adaptedNews.content?.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Теги */}
          {adaptedNews.tags && adaptedNews.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
              {adaptedNews.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </SiteLayout>
  );
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
