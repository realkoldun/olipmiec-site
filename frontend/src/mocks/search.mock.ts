import { searchIndexService } from '@/services/search-index.service';
import type { SearchIndexItem } from '@/types/search';
import { mockNews as newsMock } from './news.mock';

/**
 * Конвертация новостей из news.mock в формат SearchIndexItem
 */
function convertNewsToSearchItems() {
  return newsMock.map((news) => ({
    id: news.id,
    type: 'news' as const,
    title: news.title,
    content: news.content,
    tags: news.tags,
    url: `/news/${news.id}`,
    createdAt: news.createdAt,
    excerpt: news.excerpt || news.content.slice(0, 100),
  }));
}

/**
 * Моковые данные для поиска
 * Пока только новости (остальные типы будут добавлены позже)
 */
export const mockNews = convertNewsToSearchItems();
export const mockSections: SearchIndexItem[] = [];
export const mockTrainers: SearchIndexItem[] = [];
export const mockDocuments: SearchIndexItem[] = [];

/**
 * Инициализация поискового индекса
 * Вызывается при запуске приложения
 */
export function initializeSearchIndex(): void {
  const allItems = [
    ...mockNews,
    ...mockSections,
    ...mockTrainers,
    ...mockDocuments,
  ];

  searchIndexService.indexMany(allItems);

  console.log('Поисковый индекс инициализирован:', {
    total: allItems.length,
    news: mockNews.length,
    sections: mockSections.length,
    trainers: mockTrainers.length,
    documents: mockDocuments.length,
  });
}
