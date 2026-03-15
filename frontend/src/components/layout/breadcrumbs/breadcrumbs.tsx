'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Показывать домашнюю иконку */
  showHome?: boolean;
  /** Разделитель */
  separator?: 'chevron' | 'slash' | 'dot';
  className?: string;
}

/**
 * Breadcrumbs — навигационные хлебные крошки
 */
export function Breadcrumbs({
  items,
  showHome = true,
  separator = 'chevron',
  className,
}: BreadcrumbsProps) {
  // Обработчик клика на ссылку
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  // Компонент разделителя
  const Separator = () => {
    if (separator === 'chevron') {
      return <ChevronRight className="h-4 w-4 text-muted-foreground" />;
    }
    if (separator === 'slash') {
      return <span className="text-muted-foreground px-1">/</span>;
    }
    return <span className="text-muted-foreground px-1">•</span>;
  };

  return (
    <nav className={cn('w-full', className)} aria-label="Хлебные крошки">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {/* Домашняя страница */}
        {showHome && (
          <li className="flex items-center gap-1">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="flex items-center justify-center p-1 text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Главная страница"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>
        )}

        {/* Элементы */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href || item.label} className="flex items-center gap-1">
              {/* Разделитель */}
              {index > 0 && (
                <span className="flex items-center text-muted-foreground">
                  <Separator />
                </span>
              )}

              {/* Ссылка или текст */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="font-medium text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
