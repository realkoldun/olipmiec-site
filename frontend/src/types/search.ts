/**
 * Типы для системы поиска
 */

/**
 * Типы элементов для поиска
 */
export type SearchItemType =
  | 'news'
  | 'section'
  | 'trainer'
  | 'document'
  | 'all';

/**
 * Элемент поискового индекса
 */
export interface SearchIndexItem {
  /** Уникальный идентификатор */
  id: string;
  /** Тип элемента */
  type: SearchItemType;
  /** Заголовок */
  title: string;
  /** Содержимое для поиска */
  content: string;
  /** Теги для поиска */
  tags: string[];
  /** URL для перехода */
  url: string;
  /** Дата создания (для сортировки) */
  createdAt?: string;
  /** Изображение (опционально) */
  image?: string;
  /** Дополнительная информация */
  excerpt?: string;
}

/**
 * Результат поиска
 */
export interface SearchResult {
  /** Элемент из индекса */
  item: SearchIndexItem;
  /** Релевантность (0-100) */
  relevance: number;
  /** Подсвеченный текст */
  highlighted: string;
  /** Совпавшие поля */
  matchedFields: string[];
}

/**
 * Параметры поиска
 */
export interface SearchQuery {
  /** Поисковый запрос */
  query: string;
  /** Тип элементов */
  type?: SearchItemType;
  /** Фильтры */
  filters?: SearchFilters;
  /** Номер страницы */
  page?: number;
  /** Количество результатов на странице */
  limit?: number;
}

/**
 * Фильтры поиска
 */
export interface SearchFilters {
  /** Дата от */
  dateFrom?: string;
  /** Дата до */
  dateTo?: string;
  /** Секция */
  section?: string;
  /** Теги */
  tags?: string[];
}

/**
 * Результат выполнения поиска
 */
export interface SearchResponse {
  /** Результаты поиска */
  results: SearchResult[];
  /** Общее количество результатов */
  total: number;
  /** Текущая страница */
  page: number;
  /** Количество страниц */
  totalPages: number;
  /** Поисковый запрос */
  query: string;
  /** Время выполнения (мс) */
  processingTime: number;
}

/**
 * История поиска
 */
export interface SearchHistoryItem {
  /** Запрос */
  query: string;
  /** Время поиска */
  timestamp: number;
  /** Количество результатов */
  resultsCount: number;
}

/**
 * Интерфейс сервиса поиска
 */
export interface SearchService {
  /**
   * Индексировать элемент
   */
  index(item: SearchIndexItem): void;

  /**
   * Индексировать множество элементов
   */
  indexMany(items: SearchIndexItem[]): void;

  /**
   * Выполнить поиск
   */
  search(query: SearchQuery): SearchResponse;

  /**
   * Очистить индекс
   */
  clear(): void;

  /**
   * Получить статистику индекса
   */
  getStats(): SearchIndexStats;
}

/**
 * Статистика индекса
 */
export interface SearchIndexStats {
  /** Общее количество элементов */
  total: number;
  /** Количество по типам */
  byType: Record<SearchItemType, number>;
}
