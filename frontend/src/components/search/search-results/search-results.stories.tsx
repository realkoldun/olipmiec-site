import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchResults } from './search-results';
import { SearchProvider } from '@/providers/search-provider';
import { searchIndexService } from '@/services/search-index.service';
import { mockNews, mockSections, mockTrainers, mockDocuments } from '@/mocks/search.mock';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useSearch } from '@/hooks/use-search';

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

// Компонент для инициализации данных и выполнения поиска
function SearchResultsWithQuery({
  query,
  onItemClick,
}: {
  query?: string;
  onItemClick?: (url: string) => void;
}) {
  const { search } = useSearch();

  useEffect(() => {
    // Инициализация данных
    const allItems = [...mockNews, ...mockSections, ...mockTrainers, ...mockDocuments];
    searchIndexService.indexMany(allItems);

    // Выполнение поиска если есть запрос
    if (query) {
      search(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return <SearchResults onItemClick={onItemClick || (() => {})} />;
}

// Декоратор с провайдером
const withProvider = (Story: () => ReactElement) => (
  <SearchProvider>
    <div style={{ maxWidth: '800px', width: '100%' }}>
      <Story />
    </div>
  </SearchProvider>
);

// Пустое состояние (нет запроса)
export const Empty: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery />,
};

// Состояние загрузки
export const Loading: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery />,
  parameters: {
    nextjs: {
      navigation: {
        search: '?searching=true',
      },
    },
  },
};

// С результатами поиска (футбол)
export const WithResults: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="футбол" />,
};

// С результатами поиска (спорт)
export const WithResultsSport: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="спорт" />,
};

// С результатами поиска (школа)
export const WithResultsSchool: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="школа" />,
};

// С ошибкой
export const Error: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery />,
  parameters: {
    nextjs: {
      navigation: {
        search: '?status=error&error=Не удалось выполнить поиск',
      },
    },
  },
};

// С результатами и пагинацией (общий запрос)
export const WithPagination: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="олимпиец" />,
};

// Фильтр по типу: Новости
export const FilterNews: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="победа" />,
  parameters: {
    nextjs: {
      navigation: {
        search: '?type=news',
      },
    },
  },
};

// Фильтр по типу: Секции
export const FilterSections: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="плавание" />,
  parameters: {
    nextjs: {
      navigation: {
        search: '?type=section',
      },
    },
  },
};

// Фильтр по типу: Тренеры
export const FilterTrainers: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="тренер" />,
  parameters: {
    nextjs: {
      navigation: {
        search: '?type=trainer',
      },
    },
  },
};

// Фильтр по типу: Документы
export const FilterDocuments: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="положение" />,
  parameters: {
    nextjs: {
      navigation: {
        search: '?type=document',
      },
    },
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
  render: () => <SearchResultsWithQuery query="футбол" />,
};

// Мобильная версия
export const Mobile: Story = {
  decorators: [withProvider],
  render: () => <SearchResultsWithQuery query="секция" />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Skeleton загрузка
export const Skeleton: Story = {
  decorators: [withProvider],
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
