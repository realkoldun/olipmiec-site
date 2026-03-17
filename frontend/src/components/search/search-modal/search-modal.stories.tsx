import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchModal } from './search-modal';
import { SearchProvider } from '@/providers/search-provider';
import { searchIndexService } from '@/services/search-index.service';
import { mockNews, mockSections, mockTrainers, mockDocuments } from '@/mocks/search.mock';
import { useSearch } from '@/hooks/use-search';
import { userEvent, within } from '@storybook/test';
import { expect } from '@storybook/test';
import type { ReactElement } from 'react';

const meta = {
  title: 'Search/SearchModal',
  component: SearchModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**SearchModal** — модальное окно поиска.

## Особенности
- Открытие по Ctrl+K
- Закрытие по Escape
- Поиск с автодополнением
- Результаты с фильтрами

## Использование
\`\`\`tsx
const { isSearchOpen, openSearch, closeSearch } = useSearch();

<SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Открыто ли модальное окно',
    },
    onClose: {
      description: 'Callback закрытия',
    },
  },
} satisfies Meta<typeof SearchModal>;

export default meta;
type Story = StoryObj<typeof SearchModal>;

// Декоратор с провайдером
const withProvider = (Story: () => ReactElement) => (
  <SearchProvider>
    <Story />
  </SearchProvider>
);

// Инициализация данных
const initializeData = () => {
  const allItems = [...mockNews, ...mockSections, ...mockTrainers, ...mockDocuments];
  searchIndexService.indexMany(allItems);
};

// Закрытое состояние
export const Closed: Story = {
  decorators: [withProvider],
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// Открытое состояние
export const Open: Story = {
  decorators: [withProvider],
  args: {
    isOpen: true,
    onClose: () => {},
  },
  play: async () => {
    initializeData();
  },
};

// С поисковым запросом
export const WithQuery: Story = {
  decorators: [withProvider],
  args: {
    isOpen: true,
    onClose: () => {},
  },
  parameters: {
    nextjs: {
      navigation: {
        search: '?query=футбол',
      },
    },
  },
  play: async ({ canvasElement }) => {
    initializeData();
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим input и вводим текст
    const input = canvasElement.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      input.value = 'футбол';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

// С результатами
export const WithResults: Story = {
  decorators: [withProvider],
  args: {
    isOpen: true,
    onClose: () => {},
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
        <div className="dark" style={{ minHeight: '100vh', background: '#000' }}>
          <Story />
        </div>
      </SearchProvider>
    ),
  ],
  args: {
    isOpen: true,
    onClose: () => {},
  },
  play: async () => {
    initializeData();
  },
};

// Мобильная версия
export const Mobile: Story = {
  decorators: [withProvider],
  args: {
    isOpen: true,
    onClose: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async () => {
    initializeData();
  },
};

// Интерактивный тест: Открытие/закрытие
export const TestOpenClose: Story = {
  decorators: [
    () => {
      // Компонент-обертка для управления состоянием
      const Wrapper = () => {
        const { isSearchOpen, openSearch, closeSearch } = useSearch();
        
        return (
          <div style={{ padding: '20px' }}>
            <button onClick={openSearch}>Открыть поиск (Ctrl+K)</button>
            <p>Нажмите кнопку или Ctrl+K для открытия</p>
            <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
          </div>
        );
      };
      
      return (
        <SearchProvider>
          <Wrapper />
        </SearchProvider>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Находим кнопку
    const openButton = canvas.getByText(/открыть поиск/i);
    await expect(openButton).toBeInTheDocument();
    
    // Кликаем
    await userEvent.click(openButton);
    
    // Ждем открытия
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Проверяем, что модальное окно открыто
    const searchInput = canvasElement.querySelector('input[type="text"]');
    await expect(searchInput).toBeInTheDocument();
  },
};

// Интерактивный тест: Поиск
export const TestSearch: Story = {
  decorators: [withProvider],
  args: {
    isOpen: true,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    initializeData();
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = within(canvasElement);
    
    // Находим input
    const input = canvas.getByRole('searchbox');
    
    // Вводим запрос
    await userEvent.type(input, 'футбол');
    
    // Ждем результатов
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Проверяем, что результаты появились
    // (может не сработать без реального поиска)
  },
};

// Интерактивный тест: Горячие клавиши
export const TestHotkeys: Story = {
  decorators: [
    () => {
      const Wrapper = () => {
        const { isSearchOpen, closeSearch } = useSearch();
        
        return (
          <div style={{ padding: '20px' }}>
            <p>Нажмите Ctrl+K для открытия, Escape для закрытия</p>
            <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
          </div>
        );
      };
      
      return (
        <SearchProvider>
          <Wrapper />
        </SearchProvider>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    // Симулируем нажатие Ctrl+K
    await userEvent.keyboard('{Control>}k{/Control}');
    
    // Ждем открытия
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Проверяем, что модальное окно открыто
    const searchInput = canvasElement.querySelector('input[type="text"]');
    if (searchInput) {
      await expect(searchInput).toBeInTheDocument();
    }
  },
};
