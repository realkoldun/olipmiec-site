import type {
  SearchIndexItem,
  SearchQuery,
  SearchResult,
  SearchResponse,
  SearchService,
  SearchIndexStats,
} from '@/types/search';

/**
 * Сервис для индексации и поиска
 *
 * В будущем можно заменить на вызов API бэкенда:
 * - Изменить на вызов /api/search
 * - Индексация будет на стороне сервера
 */
export class SearchIndexService implements SearchService {
  private index: Map<string, SearchIndexItem> = new Map();

  /**
   * Индексировать элемент
   */
  index(item: SearchIndexItem): void {
    const key = `${item.type}:${item.id}`;
    this.index.set(key, item);
  }

  /**
   * Индексировать множество элементов
   */
  indexMany(items: SearchIndexItem[]): void {
    items.forEach((item) => {
      const key = `${item.type}:${item.id}`;
      this.index.set(key, item);
    });
  }

  /**
   * Выполнить поиск
   */
  search(query: SearchQuery): SearchResponse {
    const startTime = performance.now();

    if (!query.query.trim()) {
      return this.createEmptyResponse(query);
    }

    // Нормализуем запрос
    const normalizedQuery = normalizeText(query.query);
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

    // Фильтруем по типу
    let items = Array.from(this.index.values());
    if (query.type && query.type !== 'all') {
      items = items.filter((item) => item.type === query.type);
    }

    // Применяем фильтры
    if (query.filters) {
      items = applyFilters(items, query.filters);
    }

    // Ищем совпадения
    const results: SearchResult[] = items
      .map((item) => this.calculateRelevance(item, queryWords))
      .filter((result): result is SearchResult & { relevance: number } => 
        result.relevance > 0
      )
      .sort((a, b) => b.relevance - a.relevance);

    // Пагинация
    const limit = query.limit || 20;
    const page = query.page || 1;
    const total = results.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedResults = results.slice(
      (page - 1) * limit,
      page * limit
    );

    const endTime = performance.now();

    return {
      results: paginatedResults,
      total,
      page,
      totalPages,
      query: query.query,
      processingTime: Math.round(endTime - startTime),
    };
  }

  /**
   * Очистить индекс
   */
  clear(): void {
    this.index.clear();
  }

  /**
   * Получить статистику индекса
   */
  getStats(): SearchIndexStats {
    const stats: SearchIndexStats = {
      total: this.index.size,
      byType: {
        news: 0,
        section: 0,
        trainer: 0,
        document: 0,
        all: 0,
      },
    };

    this.index.forEach((item) => {
      if (item.type !== 'all') {
        stats.byType[item.type]++;
      }
    });

    stats.byType.all = stats.total;

    return stats;
  }

  /**
   * Создать пустой ответ
   */
  private createEmptyResponse(query: SearchQuery): SearchResponse {
    return {
      results: [],
      total: 0,
      page: query.page || 1,
      totalPages: 0,
      query: query.query,
      processingTime: 0,
    };
  }

  /**
   * Рассчитать релевантность
   */
  private calculateRelevance(
    item: SearchIndexItem,
    queryWords: string[]
  ): SearchResult | { relevance: 0 } {
    const normalizedQuery = queryWords.join(' ');
    const normalizedTitle = normalizeText(item.title);
    const normalizedContent = normalizeText(item.content);
    const normalizedTags = item.tags.map(normalizeText);

    let relevance = 0;
    const matchedFields: string[] = [];

    // Проверка по заголовку (наибольший вес)
    for (const word of queryWords) {
      if (normalizedTitle.includes(word)) {
        relevance += 30;
        if (!matchedFields.includes('title')) {
          matchedFields.push('title');
        }
      }
    }

    // Проверка по содержимому
    for (const word of queryWords) {
      if (normalizedContent.includes(word)) {
        relevance += 10;
        if (!matchedFields.includes('content')) {
          matchedFields.push('content');
        }
      }
    }

    // Проверка по тегам
    for (const word of queryWords) {
      if (normalizedTags.some((tag) => tag.includes(word))) {
        relevance += 20;
        if (!matchedFields.includes('tags')) {
          matchedFields.push('tags');
        }
      }
    }

    // Точное совпадение фразы
    if (normalizedTitle.includes(normalizedQuery)) {
      relevance += 50;
    }

    if (relevance === 0) {
      return { relevance: 0 };
    }

    // Ограничиваем релевантность 100
    relevance = Math.min(100, relevance);

    // Создаем подсвеченный текст
    const highlighted = highlightMatches(item.excerpt || item.content, queryWords);

    return {
      item,
      relevance,
      highlighted,
      matchedFields,
    };
  }
}

/**
 * Нормализация текста для поиска
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Применение фильтров
 */
function applyFilters(
  items: SearchIndexItem[],
  filters: SearchQuery['filters']
): SearchIndexItem[] {
  return items.filter((item) => {
    // Фильтр по дате
    if (filters?.dateFrom && item.createdAt) {
      if (new Date(item.createdAt) < new Date(filters.dateFrom)) {
        return false;
      }
    }

    if (filters?.dateTo && item.createdAt) {
      if (new Date(item.createdAt) > new Date(filters.dateTo)) {
        return false;
      }
    }

    // Фильтр по секции
    if (filters?.section) {
      if (item.type !== 'section' && item.type !== 'trainer') {
        return false;
      }
    }

    // Фильтр по тегам
    if (filters?.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) =>
        item.tags.some((itemTag) =>
          normalizeText(itemTag) === normalizeText(tag)
        )
      );
      if (!hasTag) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Подсветка совпадений в тексте
 */
export function highlightMatches(text: string, words: string[]): string {
  if (!text || words.length === 0) return text;

  const maxLength = 200; // Ограничиваем длину

  // Находим часть текста с совпадениями
  const normalizedText = normalizeText(text);
  let startIndex = 0;

  for (const word of words) {
    const index = normalizedText.indexOf(word);
    if (index !== -1 && (startIndex === 0 || index < startIndex)) {
      startIndex = index;
    }
  }

  // Вырезаем контекст вокруг первого совпадения
  const contextStart = Math.max(0, startIndex - 50);
  const contextEnd = Math.min(text.length, startIndex + maxLength);
  let context = text.slice(contextStart, contextEnd);

  if (contextStart > 0) {
    context = '...' + context;
  }
  if (contextEnd < text.length) {
    context = context + '...';
  }

  // Подсвечиваем совпадения
  for (const word of words) {
    const regex = new RegExp(`(${escapeRegex(word)})`, 'gi');
    context = context.replace(regex, '<mark>$1</mark>');
  }

  return context;
}

/**
 * Экранирование специальных символов для regex
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Экспорт экземпляра сервиса по умолчанию
 */
export const searchIndexService = new SearchIndexService();
