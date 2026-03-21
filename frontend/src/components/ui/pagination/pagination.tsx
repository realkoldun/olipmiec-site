'use client';

import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button/button';

export interface PaginationProps {
  className?: string;
  /** Текущая страница */
  currentPage: number;
  /** Общее количество страниц */
  totalPages: number;
  /** Базовый путь для навигации */
  basePath?: string;
  /** Дополнительные параметры URL */
  params?: Record<string, string | number | undefined>;
  /** Callback при изменении страницы */
  onPageChange?: (page: number) => void;
}

/**
 * Pagination — универсальный компонент пагинации
 * 
 * @example
 * // Простое использование
 * <Pagination currentPage={1} totalPages={5} />
 * 
 * @example
 * // С кастомным basePath
 * <Pagination currentPage={2} totalPages={10} basePath="/news" />
 * 
 * @example
 * // С дополнительными параметрами
 * <Pagination 
 *   currentPage={1} 
 *   totalPages={5} 
 *   basePath="/news"
 *   params={{ category: 'sport', filter: 'latest' }}
 * />
 */
export function Pagination({
  className,
  currentPage,
  totalPages,
  basePath,
  params = {},
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Если страниц меньше или равно 1, не показываем пагинацию
  if (totalPages <= 1) {
    return null;
  }

  // Построение URL с параметрами
  const buildUrl = (page: number): string => {
    const searchParams = new URLSearchParams();
    searchParams.set('page', page.toString());

    // Добавляем дополнительные параметры
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    
    // Если указан basePath, используем его, иначе текущий путь
    const base = basePath || pathname;
    return queryString ? `${base}?${queryString}` : base;
  };

  // Обработчик клика на страницу
  const handlePageClick = (page: number) => {
    // Если есть callback, используем его
    if (onPageChange) {
      onPageChange(page);
      return;
    }

    // Иначе переходим по URL
    const url = buildUrl(page);
    router.push(url);
  };

  // Генерация номеров страниц для отображения
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className={cn('flex items-center justify-center gap-2', className)}
      aria-label="Пагинация"
    >
      {/* Предыдущая страница */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
      >
        ←
      </Button>

      {/* Номера страниц */}
      {pageNumbers.map((page) =>
        page === 'ellipsis' ? (
          <span
            key="ellipsis"
            className="flex h-9 w-9 items-center justify-center text-muted-foreground"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handlePageClick(page)}
            aria-label={`Страница ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      {/* Следующая страница */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageClick(currentPage + 1)}
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
 * Показывает максимум 7 кнопок
 */
function getPageNumbers(
  current: number,
  total: number
): (number | 'ellipsis')[] {
  // Если страниц мало, показываем все
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Первая страница + эллипсис + последние 3
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', total];
  }

  // Первые 2 + эллипсис + последние 3
  if (current >= total - 3) {
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  }

  // Первая + эллипсис + текущая ±1 + эллипсис + последняя
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}
