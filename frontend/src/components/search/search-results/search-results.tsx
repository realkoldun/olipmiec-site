'use client';

import { useSearch } from '@/hooks/use-search';
import { FileText, Folder, User, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button/button';
import type { SearchItemType } from '@/types/search';
import type { JSX } from 'react';

export interface SearchResultsProps {
  className?: string;
  /** Callback при клике на результат */
  onItemClick?: (url: string) => void;
}

interface SearchResultItem {
  item: {
    id: string;
    type: SearchItemType;
    title: string;
    url: string;
    createdAt?: string;
  };
  relevance: number;
  highlighted: string;
  matchedFields: string[];
}

interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  page: number;
  totalPages: number;
  processingTime: number;
}

/**
 * SearchResults — результаты поиска
 */
export function SearchResults({ className, onItemClick }: SearchResultsProps) {
  const { results, status, error, selectedType, setSelectedType } = useSearch();

  // Типы для фильтра
  const types = [
    { value: 'all' as SearchItemType, label: 'Все', icon: FileText },
    { value: 'news' as SearchItemType, label: 'Новости', icon: FileText },
    { value: 'section' as SearchItemType, label: 'Секции', icon: Folder },
    { value: 'trainer' as SearchItemType, label: 'Тренеры', icon: User },
    { value: 'document' as SearchItemType, label: 'Документы', icon: FileText },
  ];

  // Загрузка
  if (status === 'searching') {
    return (
      <div className={cn('space-y-4', className)}>
        <SearchResultsSkeleton />
      </div>
    );
  }

  // Ошибка
  if (status === 'error') {
    return (
      <div className={cn('p-8 text-center', className)}>
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">Ошибка поиска</h3>
        <p className="mt-2 text-muted-foreground">{error}</p>
      </div>
    );
  }

  const searchResults = results as SearchResponse | null;

  // Пустой результат
  if (!searchResults || searchResults.total === 0) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Ничего не найдено</h3>
        <p className="mt-2 text-muted-foreground">
          Попробуйте изменить поисковый запрос
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Фильтры по типу */}
      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const Icon = type.icon;
          const isActive = selectedType === type.value;

          return (
            <Button
              key={type.value}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {type.label}
            </Button>
          );
        })}
      </div>

      {/* Статистика */}
      <div className="text-sm text-muted-foreground">
        Найдено: {searchResults.total} результатов за {searchResults.processingTime} мс
      </div>

      {/* Результаты */}
      <div className="space-y-3">
        {searchResults.results.map((result) => (
          <SearchResultItem
            key={result.item.id}
            result={result}
            onClick={() => onItemClick?.(result.item.url)}
          />
        ))}
      </div>

      {/* Пагинация */}
      {searchResults.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={searchResults.page === 1}
          >
            Предыдущая
          </Button>
          <span className="flex items-center px-4 text-sm">
            Страница {searchResults.page} из {searchResults.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={searchResults.page === searchResults.totalPages}
          >
            Следующая
          </Button>
        </div>
      )}
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResultItem;
  onClick: () => void;
}

function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  const { item, relevance } = result;

  const typeIcons: Record<string, JSX.ElementType> = {
    news: FileText,
    section: Folder,
    trainer: User,
    document: FileText,
  };

  const Icon = typeIcons[item.type] || FileText;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border',
        'hover:bg-accent hover:border-accent-foreground/20',
        'transition-all duration-200'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold truncate">{item.title}</h4>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
              {getTypeLabel(item.type)}
            </span>
          </div>

          {result.highlighted && (
            <p
              className="text-sm text-muted-foreground line-clamp-2"
              dangerouslySetInnerHTML={{ __html: result.highlighted }}
            />
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Релевантность: {relevance}%</span>
            {item.createdAt && (
              <span>{formatDate(item.createdAt)}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function getTypeLabel(type: SearchItemType): string {
  const labels: Record<string, string> = {
    news: 'Новость',
    section: 'Секция',
    trainer: 'Тренер',
    document: 'Документ',
    all: 'Все',
  };
  return labels[type] || type;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 bg-muted rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
