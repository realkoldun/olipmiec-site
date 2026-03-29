import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  SearchQuery,
  SearchResponse,
  SearchHistoryItem,
  SearchItemType,
} from '@/types/search';
import { searchApi } from '@/services/api/search.api';

/**
 * Статус поиска
 */
export type SearchStatus = 'idle' | 'searching' | 'success' | 'error';

/**
 * Состояние поиска
 */
export interface SearchState {
  /** Текущий запрос */
  query: string;
  /** Результаты поиска */
  results: SearchResponse | null;
  /** Статус выполнения */
  status: SearchStatus;
  /** Ошибка */
  error: string | null;
  /** Выбранный тип элемента */
  selectedType: SearchItemType;
  /** История поиска */
  history: SearchHistoryItem[];
  /** Открыто ли модальное окно поиска */
  isSearchOpen: boolean;

  // Actions
  /** Установить запрос */
  setQuery: (query: string) => void;
  /** Выполнить поиск */
  search: (query: string) => Promise<void>;
  /** Установить тип */
  setSelectedType: (type: SearchItemType) => void;
  /** Очистить результаты */
  clearResults: () => void;
  /** Добавить в историю */
  addToHistory: (query: string, resultsCount: number) => void;
  /** Очистить историю */
  clearHistory: () => void;
  /** Открыть поиск */
  openSearch: () => void;
  /** Закрыть поиск */
  closeSearch: () => void;
}

/**
 * Search Store
 * Хранит состояние поиска в localStorage
 */
export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      query: '',
      results: null,
      status: 'idle',
      error: null,
      selectedType: 'all',
      history: [],
      isSearchOpen: false,

      // Установить запрос
      setQuery: (query) => set({ query }),

      // Выполнить поиск
      search: async (query: string) => {
        if (!query.trim()) {
          set({ status: 'idle', results: null, query });
          return;
        }

        set({ status: 'searching', error: null, query });

        try {
          const searchQuery: SearchQuery = {
            query,
            type: get().selectedType !== 'all' ? get().selectedType : undefined,
            limit: 20,
          };

          const response = await searchApi.search(searchQuery);

          set({
            status: 'success',
            results: response,
            error: null,
          });

          // Добавляем в историю если есть результаты
          if (response.total > 0) {
            get().addToHistory(query, response.total);
          }
        } catch (error) {
          set({
            status: 'error',
            error: error instanceof Error ? error.message : 'Ошибка поиска',
          });
        }
      },

      // Установить тип
      setSelectedType: (type) => {
        set({ selectedType: type });
        // Перевыполняем поиск если есть запрос
        const { query } = get();
        if (query) {
          get().search(query);
        }
      },

      // Очистить результаты
      clearResults: () => {
        set({ results: null, status: 'idle', error: null });
      },

      // Добавить в историю
      addToHistory: (query, resultsCount) => {
        const { history } = get();
        const newItem: SearchHistoryItem = {
          query,
          timestamp: Date.now(),
          resultsCount,
        };

        // Удаляем дубликаты и добавляем новый в начало
        const filteredHistory = history.filter((item) => item.query !== query);
        const newHistory = [newItem, ...filteredHistory].slice(0, 10);

        set({ history: newHistory });
      },

      // Очистить историю
      clearHistory: () => {
        set({ history: [] });
      },

      // Открыть поиск
      openSearch: () => {
        set({ isSearchOpen: true });
      },

      // Закрыть поиск
      closeSearch: () => {
        set({ isSearchOpen: false });
      },
    }),
    {
      name: 'search-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        selectedType: state.selectedType,
      }),
    }
  )
);
