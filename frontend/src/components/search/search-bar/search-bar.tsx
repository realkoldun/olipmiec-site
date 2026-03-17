'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearch } from '@/hooks/use-search';
import { Search, X, Loader2, Keyboard } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';

export interface SearchBarProps {
  className?: string;
  /** Показывать кнопку закрытия */
  showClose?: boolean;
  /** Автоматический поиск при вводе */
  autoSearch?: boolean;
  /** Задержка перед поиском (мс) */
  debounceMs?: number;
  /** Плейсхолдер */
  placeholder?: string;
  /** Размер */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SearchBar — строка поиска с автодополнением
 *
 * Особенности:
 * - Горячие клавиши Ctrl+K для открытия
 * - Закрытие по Escape
 * - Debounce для автопоиска
 * - Индикатор загрузки
 * - Кнопка очистки
 */
export function SearchBar({
  className,
  showClose = false,
  autoSearch = true,
  debounceMs = 300,
  placeholder = 'Поиск...',
  size = 'md',
}: SearchBarProps) {
  const {
    query,
    setQuery,
    search,
    clearResults,
    closeSearch,
    isSearching,
  } = useSearch();

  const [localValue, setLocalValue] = useState(query);

  // Debounce для автопоиска
  useEffect(() => {
    if (!autoSearch) return;

    const timeoutId = setTimeout(() => {
      if (localValue !== query) {
        search(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localValue, autoSearch, debounceMs, search, query]);

  // Синхронизация с store
  useEffect(() => {
    setLocalValue(query);
  }, [query]);

  // Обработчик изменения
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    setQuery(e.target.value);
  }, [setQuery]);

  // Обработчик отправки формы
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    search(localValue);
  }, [search, localValue]);

  // Обработчик очистки
  const handleClear = useCallback(() => {
    setLocalValue('');
    setQuery('');
    clearResults();
  }, [setQuery, clearResults]);

  // Обработчик закрытия
  const handleClose = useCallback(() => {
    closeSearch();
    handleClear();
  }, [closeSearch, handleClear]);

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex items-center gap-2', className)}
    >
      <div className="relative flex-1">
        <Search
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
            isSearching && 'animate-pulse'
          )}
        />

        <Input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            sizeClasses[size],
            'pl-10 pr-20',
            'bg-background',
            'focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label="Поиск"
        />

        {/* Индикатор загрузки */}
        {isSearching && (
          <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}

        {/* Кнопка очистки */}
        {localValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Горячие клавиши подсказка */}
        {!localValue && !isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
            <Keyboard className="h-3 w-3" />
            <span className="hidden sm:inline">Ctrl+K</span>
          </div>
        )}
      </div>

      {/* Кнопка закрытия */}
      {showClose && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClose}
          aria-label="Закрыть поиск"
        >
          Закрыть
        </Button>
      )}
    </form>
  );
}
