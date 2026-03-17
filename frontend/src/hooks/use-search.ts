'use client';

import { useEffect } from 'react';
import { useSearchStore } from '@/stores/search-store';
import type { SearchItemType, SearchHistoryItem, SearchResponse } from '@/types/search';

/**
 * Результат работы хука
 */
export interface UseSearchResult {
  /** Текущий запрос */
  query: string;
  /** Результаты поиска */
  results: SearchResponse | null;
  /** Статус выполнения */
  status: 'idle' | 'searching' | 'success' | 'error';
  /** Ошибка */
  error: string | null;
  /** Выбранный тип элемента */
  selectedType: SearchItemType;
  /** История поиска */
  history: SearchHistoryItem[];
  /** Открыто ли модальное окно поиска */
  isSearchOpen: boolean;
  /** Выполняется ли поиск */
  isSearching: boolean;
  /** Начать поиск */
  search: (query: string) => Promise<void>;
  /** Установить запрос */
  setQuery: (query: string) => void;
  /** Установить тип */
  setSelectedType: (type: SearchItemType) => void;
  /** Очистить результаты */
  clearResults: () => void;
  /** Очистить историю */
  clearHistory: () => void;
  /** Открыть поиск */
  openSearch: () => void;
  /** Закрыть поиск */
  closeSearch: () => void;
}

/**
 * Хук для работы с поиском
 * 
 * @example
 * ```tsx
 * const { search, results, isSearching } = useSearch();
 * 
 * <input onChange={(e) => search(e.target.value)} />
 * ```
 */
export function useSearch(): UseSearchResult {
  const {
    query,
    results,
    status,
    error,
    selectedType,
    history,
    isSearchOpen,
    setQuery,
    search,
    setSelectedType,
    clearResults,
    clearHistory,
    openSearch,
    closeSearch,
  } = useSearchStore();

  // Поиск по Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, closeSearch, isSearchOpen]);

  const isSearching = status === 'searching';

  return {
    query,
    results,
    status,
    error,
    selectedType,
    history,
    isSearchOpen,
    isSearching,
    search,
    setQuery,
    setSelectedType,
    clearResults,
    clearHistory,
    openSearch,
    closeSearch,
  };
}
