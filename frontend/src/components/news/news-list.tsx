'use client';

import type { NewsItem } from '@/types/news';
import { NewsCard } from './news-card';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button/button';

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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Генерация страниц для отображения
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Пагинация">
      {/* Предыдущая */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
      >
        ←
      </Button>

      {/* Номера страниц */}
      {pages.map((page) =>
        page === 'ellipsis' ? (
          <span
            key="ellipsis"
            className="flex h-9 w-9 items-center justify-center text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-label={`Страница ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      {/* Следующая */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
      >
        →
      </Button>
    </nav>
  );
}

/**
 * Генерация номеров страниц для отображения
 */
function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', total];
  }

  if (current >= total - 3) {
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}
