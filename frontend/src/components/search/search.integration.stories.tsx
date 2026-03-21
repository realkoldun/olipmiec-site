import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchProvider } from '@/providers/search-provider';
import { useSearch } from '@/hooks/use-search';
import { searchIndexService } from '@/services/search-index.service';
import { mockNews, mockSections, mockTrainers, mockDocuments } from '@/mocks/search.mock';
import type { ReactElement } from 'react';
import { SearchResults } from './search-results/search-results';
import {SearchBar} from "@/components/search/search-bar/search-bar";
import {SearchHighlight} from "@/components/search/search-highlight/search-highlight";

const meta = {
  title: 'Search/Integration',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Integration Tests** — интеграционные тесты системы поиска.

## Тесты
- Полный цикл поиска
- Работа с моковыми данными
- Фильтрация по типу
- Подсветка совпадений

## Данные
- Новости (3)
- Секции (4)
- Тренеры (3)
- Документы (3)
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Декоратор с провайдером
const withProvider = (Story: () => ReactElement) => (
  <SearchProvider>
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <Story />
    </div>
  </SearchProvider>
);

// Инициализация данных
const initializeData = () => {
  const allItems = [...mockNews, ...mockSections, ...mockTrainers, ...mockDocuments];
  searchIndexService.indexMany(allItems);
};

// Полный тест поиска
export const FullSearch: Story = {
  decorators: [withProvider],
  render: () => {
    initializeData();
    
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '24px' }}>Поиск по сайту</h1>
        
        <SearchBar
          autoSearch
          debounceMs={300}
          placeholder="Введите поисковый запрос..."
          size="lg"
        />
        
        <div style={{ marginTop: '24px' }}>
          <SearchResults
            onItemClick={(url: string) => {
              alert(`Переход на: ${url}`);
            }}
          />
        </div>
      </div>
    );
  },
};

// Тест с предзаполненным запросом
export const WithPredefinedQuery: Story = {
  decorators: [withProvider],
  render: () => {
    initializeData();
    
    const { setQuery } = useSearch();
    
    // Устанавливаем запрос
    setTimeout(() => setQuery('футбол'), 100);
    
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Поиск: футбол</h1>
        
        <SearchBar
          autoSearch
          debounceMs={300}
          placeholder="Поиск..."
          size="lg"
        />
        
        <div style={{ marginTop: '24px' }}>
          <SearchResults
            onItemClick={(url: string) => {
              alert(`Переход на: ${url}`);
            }}
          />
        </div>
      </div>
    );
  },
};

// Тест подсветки
export const HighlightTest: Story = {
  decorators: [withProvider],
  render: () => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Тест подсветки совпадений</h1>

      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3>Оригинальный текст:</h3>
          <p>
            Специальная детско-юношеская школа олимпийского резерва «Олимпиец»
            приглашает детей и подростков на занятия спортом.
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3>Подсветка: &quot;школа спорт&quot;</h3>
          <SearchHighlight
            text="Специальная детско-юношеская школа олимпийского резерва «Олимпиец» приглашает детей и подростков на занятия спортом."
            query="школа спорт"
            maxLength={200}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3>Подсветка: &quot;Олимпиец&quot;</h3>
          <SearchHighlight
            text="Специальная детско-юношеская школа олимпийского резерва «Олимпиец» приглашает детей и подростков на занятия спортом."
            query="Олимпиец"
            maxLength={200}
          />
        </div>
      </div>
    </div>
  ),
};

// Тест фильтрации
export const FilterTest: Story = {
  decorators: [withProvider],
  render: () => {
    initializeData();
    
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Тест фильтрации</h1>
        
        <div style={{ marginTop: '24px' }}>
          <h3>Все результаты (14)</h3>
          <SearchResults onItemClick={() => {}} />
        </div>
      </div>
    );
  },
};

// Тест производительности
export const PerformanceTest: Story = {
  decorators: [withProvider],
  render: () => {
    // Создаем много данных для теста
    const largeData = [
      ...mockNews,
      ...mockSections,
      ...mockTrainers,
      ...mockDocuments,
      // Добавляем ещё данных
      ...Array.from({ length: 50 }).map((_, i) => ({
        id: `extra-${i}`,
        type: 'news' as const,
        title: `Тестовая новость ${i}`,
        content: `Содержание тестовой новости ${i}. Футбол, спорт, соревнования.`,
        tags: ['тест', 'новость'],
        url: `/news/${i}`,
        createdAt: '2025-01-01',
        excerpt: `Тестовая новость ${i}...`,
      })),
    ];
    
    searchIndexService.indexMany(largeData);
    
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Тест производительности (64 элемента)</h1>
        
        <SearchBar
          autoSearch
          debounceMs={100}
          placeholder="Быстрый поиск..."
          size="lg"
        />
        
        <div style={{ marginTop: '24px' }}>
          <SearchResults onItemClick={() => {}} />
        </div>
      </div>
    );
  },
};

// Темная тема
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <SearchProvider>
        <div className="dark" style={{ minHeight: '100vh', background: '#000', padding: '20px' }}>
          <Story />
        </div>
      </SearchProvider>
    ),
  ],
  render: () => {
    initializeData();
    
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Поиск в тёмной теме</h1>
        
        <SearchBar
          autoSearch
          debounceMs={300}
          placeholder="Поиск..."
          size="lg"
        />
        
        <div style={{ marginTop: '24px' }}>
          <SearchResults
            onItemClick={(url: string) => {
              alert(`Переход на: ${url}`);
            }}
          />
        </div>
      </div>
    );
  },
};

// Мобильная версия
export const MobileView: Story = {
  decorators: [withProvider],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => {
    initializeData();
    
    return (
      <div style={{ padding: '16px' }}>
        <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>Поиск</h1>
        
        <SearchBar
          autoSearch
          debounceMs={300}
          placeholder="Поиск..."
          size="md"
        />
        
        <div style={{ marginTop: '16px' }}>
          <SearchResults onItemClick={() => {}} />
        </div>
      </div>
    );
  },
};
