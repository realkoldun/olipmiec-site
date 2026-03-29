import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { NewsService } from '../news/news.service';

/**
 * Результат поиска (возвращается напрямую, без обёртки item)
 */
interface SearchResult {
  id: string;
  type: 'news' | 'section' | 'trainer' | 'document';
  title: string;
  content: string;
  excerpt: string;
  url: string;
  image?: string;
  createdAt?: string;
  tags: string[];
  relevance: number;
  highlighted?: string;
  matchedFields?: string[];
}

/**
 * Ответ API поиска
 */
interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
  query: string;
  processingTime: number;
}

@Controller('api/search')
export class SearchController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ): Promise<SearchResponse> {
    const startTime = performance.now();

    if (!query?.trim()) {
      return {
        results: [],
        total: 0,
        page,
        totalPages: 0,
        query: query || '',
        processingTime: 0,
      };
    }

    const normalizedQuery = query.toLowerCase().replace(/ё/g, 'е');
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

    // Получаем все новости
    const allNews = await this.newsService.findAll(1, 1000);
    
    // Фильтруем по типу если указан
    let items = allNews.data;
    if (type && type !== 'all') {
      // В будущем можно добавить фильтрацию по другим типам
      if (type === 'news') {
        // Уже новости
      } else {
        // Для других типов пока пустой массив
        items = [];
      }
    }

    // Рассчитываем релевантность и формируем результаты
    const results = items
      .map((news) => {
        const title = news.title.toLowerCase().replace(/ё/g, 'е');
        const content = news.content.toLowerCase().replace(/ё/g, 'е');
        const tags = news.tags.map(t => t.toLowerCase().replace(/ё/g, 'е'));

        let relevance = 0;
        const matchedFields: string[] = [];

        // Проверка по заголовку
        for (const word of queryWords) {
          if (title.includes(word)) {
            relevance += 30;
            if (!matchedFields.includes('title')) {
              matchedFields.push('title');
            }
          }
        }

        // Проверка по содержимому
        for (const word of queryWords) {
          if (content.includes(word)) {
            relevance += 10;
            if (!matchedFields.includes('content')) {
              matchedFields.push('content');
            }
          }
        }

        // Проверка по тегам
        for (const word of queryWords) {
          if (tags.some(tag => tag.includes(word))) {
            relevance += 20;
            if (!matchedFields.includes('tags')) {
              matchedFields.push('tags');
            }
          }
        }

        // Точное совпадение
        if (title.includes(normalizedQuery)) {
          relevance += 50;
        }

        // Создаем highlighted текст
        const excerpt = news.content.substring(0, 200) + '...';
        const highlighted = highlightMatches(excerpt, queryWords);

        return {
          id: news.id,
          type: 'news' as const,
          title: news.title,
          content: news.content,
          excerpt,
          url: `/news/${news.id}`,
          image: news.imageUrl || undefined,
          createdAt: news.createdAt.toISOString(),
          tags: news.tags,
          relevance: Math.min(100, relevance),
          highlighted,
          matchedFields,
        };
      })
      .filter((r) => r.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);

    // Пагинация
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedResults = results.slice(
      (page - 1) * limit,
      page * limit,
    );

    const endTime = performance.now();

    return {
      results: paginatedResults,
      total,
      page,
      totalPages,
      query,
      processingTime: Math.round(endTime - startTime),
    };
  }
}

/**
 * Подсветка совпадений в тексте
 */
function highlightMatches(text: string, words: string[]): string {
  if (!text || words.length === 0) return text;

  const normalizedText = text.toLowerCase().replace(/ё/g, 'е');
  let context = text;

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
