import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchResults } from './search-results';
import { SearchProvider } from '@/providers/search-provider';
import { searchIndexService } from '@/services/search-index.service';
import { mockNews, mockSections, mockTrainers, mockDocuments } from '@/mocks/search.mock';
import type { ReactElement } from 'react';

const meta = {
  title: 'Search/SearchResults',
  component: SearchResults,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**SearchResults** — результаты поиска.

## Особенности
- Фильтрация по типу (новости, секции, тренеры, документы)
- Подсветка совпадений
- Релевантность результатов
- Пагинация
- Skeleton загрузка

## Использование
\`\`\`tsx
<SearchResults
  onItemClick={(url) => window.location.href = url}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchResults>;

export default meta;
type Story = StoryObj<typeof SearchResults>;

// Декоратор с провайдером и инициализацией данных
const withProviderAndData = (Story: () => ReactElement) => {
  return (
    <SearchProvider>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <Story />
      </div>
    </SearchProvider>
  );
};

// Инициализация данных
const initializeData = () => {
  const allItems = [...mockNews, ...mockSections, ...mockTrainers, ...mockDocuments];
  searchIndexService.indexMany(allItems);
};

// Пустое состояние (нет запроса)
export const Empty: Story = {
  decorators: [withProviderAndData],
};

// Состояние загрузки
export const Loading: Story = {
  decorators: [withProviderAndData],
  parameters: {
    nextjs: {
      navigation: {
        search: '?searching=true',
      },
    },
  },
};

// С результатами поиска
export const WithResults: Story = {
  decorators: [withProviderAndData],
  parameters: {
    nextjs: {
      navigation: {
        search: '?query=футбол&status=success',
      },
    },
  },
  play: async () => {
    initializeData();
  },
};

// С ошибкой
export const Error: Story = {
  decorators: [withProviderAndData],
  parameters: {
    nextjs: {
      navigation: {
        search: '?status=error&error=Не удалось выполнить поиск',
      },
    },
  },
};

// Много результатов (с пагинацией)
export const WithPagination: Story = {
  decorators: [withProviderAndData],
  parameters: {
    nextjs: {
      navigation: {
        search: '?query=спорт&page=1&totalPages=5',
      },
    },
  },
  play: async () => {
    initializeData();
  },
};

// Фильтр по типу: Новости
export const FilterNews: Story = {
  decorators: [withProviderAndData],
  parameters: {
    nextjs: {
      navigation: {
        search: '?query=победа&type=news',
      },
    },
  },
  play: async () => {
    initializeData();
  },
};

// Фильтр по типу: Секции
export const FilterSections: Story = {
  decorators: [withProviderAndData],
  parameters: {
    nextjs: {
      navigation: {
        search: '?query=плавание&type=section',
      },
    },
  },
  play: async () => {
    initializeData();
  },
};

// Фильтр по типу: Тренеры
export const FilterTrainers: Story = {
  decorators: [withProviderAndData],
  parameters: {
    nextjs: {
      navigation: {
        search: '?query=тренер&type=trainer',
      },
    },
  },
  play: async () => {
    initializeData();
  },
};

// Фильтр по типу: Документы
export const FilterDocuments: Story = {
  decorators: [withProviderAndData],
  parameters: {
    nextjs: {
      navigation: {
        search: '?query=положение&type=document',
      },
    },
  },
  play: async () => {
    initializeData();
  },
};

// Тёмная тема
export const Dark: Story = {
  decorators: [
    (Story) => (
      <SearchProvider>
        <div className="dark" style={{ background: '#000', minHeight: '400px', padding: '20px', maxWidth: '800px' }}>
          <Story />
        </div>
      </SearchProvider>
    ),
  ],
  parameters: {
    nextjs: {
      navigation: {
        search: '?query=футбол',
      },
    },
  },
  play: async () => {
    initializeData();
  },
};

// Мобильная версия
export const Mobile: Story = {
  decorators: [withProviderAndData],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      navigation: {
        search: '?query=спорт',
      },
    },
  },
  play: async () => {
    initializeData();
  },
};

// Skeleton загрузка
export const Skeleton: Story = {
  decorators: [withProviderAndData],
  render: () => (
    <div style={{ maxWidth: '800px', width: '100%' }}>
      <div className="space-y-4">
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
    </div>
  ),
};
