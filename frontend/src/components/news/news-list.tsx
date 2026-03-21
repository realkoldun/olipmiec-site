'use client';

import type { NewsItem } from '@/types/news';
import { NewsCard } from './news-card';
import { cn } from '@/utils/cn';
import { Pagination } from '@/components/ui/pagination';

export interface NewsListProps {
  className?: string;
  /** Новости */
  news: NewsItem[];
  /** Callback при клике на новость */
  onNewsClick?: (id: string) => void;
  /** Текущая страница */
  page?: number;
  /** Общее количество страниц */
  totalPages?: number;
  /** Callback изменения страницы */
  onPageChange?: (page: number) => void;
  /** Показывать пагинацию */
  showPagination?: boolean;
  /** Количество новостей на странице */
  itemsPerPage?: number;
}

/**
 * NewsList — список новостей с пагинацией
 */
export function NewsList({
  className,
  news,
  onNewsClick,
  page = 1,
  totalPages = 1,
  onPageChange,
  showPagination = true,
}: NewsListProps) {
  // Пустой список
  if (news.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12', className)}>
        <p className="text-lg text-muted-foreground">Новостей пока нет</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Сетка новостей */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            news={item}
            onClick={onNewsClick}
            size="md"
          />
        ))}
      </div>

      {/* Пагинация */}
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
