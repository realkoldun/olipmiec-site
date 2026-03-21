'use client';

import type { NewsItem } from '@/types/news';
import { Calendar, User, Eye } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

export interface NewsCardProps {
  className?: string;
  /** Новость */
  news: NewsItem;
  /** Callback при клике на новость */
  onClick?: (id: string) => void;
  /** Показывать изображение */
  showImage?: boolean;
  /** Показывать мета-информацию */
  showMeta?: boolean;
  /** Показывать теги */
  showTags?: boolean;
  /** Размер карточки */
  size?: 'sm' | 'md' | 'lg';
  /** Показывать категорию */
  showCategory?: boolean;
  /** Показывать автора */
  showAuthor?: boolean;
  /** Показывать просмотры */
  showViews?: boolean;
}

/**
 * NewsCard — карточка новости
 *
 * Особенности:
 * - Отображение изображения
 * - Мета-информация (автор, дата, просмотры)
 * - Теги
 * - Адаптивный размер
 */
export function NewsCard({
  className,
  news,
  onClick,
  showImage = true,
  showMeta = true,
  showTags = false, // Скрыто по умолчанию
  showCategory = true,
  showAuthor = false, // Скрыто по умолчанию
  showViews = false, // Скрыто по умолчанию
  size = 'md',
}: NewsCardProps) {
  const handleClick = () => {
    onClick?.(news.id);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-background',
        'transition-all duration-200 hover:shadow-lg hover:border-primary/50',
        'cursor-pointer',
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Открыть новость: ${news.title}`}
    >
      {/* Изображение */}
      {showImage && news.image && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={news.image}
            alt={news.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            unoptimized
          />
          {/* Категория */}
          {showCategory && news.category && (
            <span className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              {getCategoryLabel(news.category)}
            </span>
          )}
        </div>
      )}

      {/* Контент */}
      <div className="flex flex-1 flex-col p-4">
        {/* Заголовок */}
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight group-hover:text-primary">
          {news.title}
        </h3>

        {/* Описание */}
        {news.excerpt && (
          <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
            {news.excerpt}
          </p>
        )}

        {/* Мета-информация */}
        {showMeta && (
          <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {/* Дата */}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(news.createdAt)}</span>
            </div>

            {/* Автор */}
            {showAuthor && news.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{news.author}</span>
              </div>
            )}

            {/* Просмотры */}
            {showViews && news.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{news.views}</span>
              </div>
            )}
          </div>
        )}

        {/* Теги (скрыто по умолчанию) */}
        {showTags && news.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {news.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
            {news.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{news.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
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
