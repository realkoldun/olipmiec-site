import { searchIndexService } from '@/services/search-index.service';
import { mockNews as newsMock } from './news.mock';
import { mockSections as sectionsMock } from './sections.mock';
import { mockTrainers as trainersMock } from './trainers.mock';
import { mockDocuments as documentsMock } from './documents.mock';

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
 * Конвертация секций из sections.mock в формат SearchIndexItem
 */
function convertSectionsToSearchItems() {
  return sectionsMock.map((section) => ({
    id: section.id,
    type: 'section' as const,
    title: section.title,
    content: section.content,
    tags: section.tags,
    url: `/sections/${section.id}`,
    createdAt: section.createdAt || new Date().toISOString(),
    excerpt: section.excerpt || section.content.slice(0, 100),
  }));
}

/**
 * Конвертация тренеров из trainers.mock в формат SearchIndexItem
 */
function convertTrainersToSearchItems() {
  return trainersMock.map((trainer) => ({
    id: trainer.id,
    type: 'trainer' as const,
    title: trainer.name,
    content: trainer.bio || trainer.description,
    tags: trainer.specialization || [],
    url: `/trainers/${trainer.id}`,
    createdAt: trainer.joinedAt || new Date().toISOString(),
    excerpt: trainer.shortBio || trainer.description?.slice(0, 100),
  }));
}

/**
 * Конвертация документов из documents.mock в формат SearchIndexItem
 */
function convertDocumentsToSearchItems() {
  return documentsMock.map((doc) => ({
    id: doc.id,
    type: 'document' as const,
    title: doc.title,
    content: doc.description || doc.content,
    tags: doc.tags || [],
    url: `/documents/${doc.id}`,
    createdAt: doc.createdAt || new Date().toISOString(),
    excerpt: doc.description || doc.content?.slice(0, 100),
  }));
}

/**
 * Моковые данные для поиска
 */
const mockNews = convertNewsToSearchItems();
const mockSections = convertSectionsToSearchItems();
const mockTrainers = convertTrainersToSearchItems();
const mockDocuments = convertDocumentsToSearchItems();

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
