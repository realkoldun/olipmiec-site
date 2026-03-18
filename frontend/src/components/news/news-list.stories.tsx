import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NewsList } from './news-list';
import { mockNews } from '@/mocks/news.mock';
import { within, userEvent, expect } from '@storybook/test';

const meta = {
  title: 'News/NewsList',
  component: NewsList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**NewsList** — список новостей с пагинацией.

## Особенности
- Адаптивная сетка (1-2-3 колонки)
- Пагинация
- Пустое состояние
- Callback при клике

## Использование
\`\`\`tsx
<NewsList
  news={newsItems}
  onNewsClick={(id) => router.push('/news/' + id)}
  page={1}
  totalPages={5}
  onPageChange={setPage}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showPagination: {
      control: 'boolean',
      description: 'Показывать пагинацию',
    },
    itemsPerPage: {
      control: 'number',
      description: 'Количество новостей на странице',
    },
  },
} satisfies Meta<typeof NewsList>;

export default meta;
type Story = StoryObj<typeof NewsList>;

// Базовая история с моковыми данными
export const Default: Story = {
  args: {
    news: mockNews.slice(0, 6),
    page: 1,
    totalPages: 3,
    onNewsClick: (id) => {
      alert(`Клик на новость: ${id}`);
    },
    onPageChange: (page) => {
      console.log('Страница:', page);
    },
  },
};

// Пустой список
export const Empty: Story = {
  args: {
    news: [],
  },
};

// С пагинацией
export const WithPagination: Story = {
  args: {
    news: mockNews.slice(0, 6),
    page: 2,
    totalPages: 5,
    showPagination: true,
    onNewsClick: () => {},
    onPageChange: () => {},
  },
};

// Без пагинации
export const WithoutPagination: Story = {
  args: {
    news: mockNews.slice(0, 6),
    showPagination: false,
    onNewsClick: () => {},
  },
};

// Одна новость
export const SingleNews: Story = {
  args: {
    news: [mockNews[0]],
  },
};

// Много новостей (3 ряда)
export const ManyNews: Story = {
  args: {
    news: mockNews,
    page: 1,
    totalPages: 2,
    itemsPerPage: 6,
    onNewsClick: () => {},
    onPageChange: () => {},
  },
};

// Тёмная тема
export const Dark: Story = {
  args: {
    news: mockNews.slice(0, 6),
    page: 1,
    totalPages: 3,
    onNewsClick: () => {},
    onPageChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ background: '#000', minHeight: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// Мобильная версия
export const Mobile: Story = {
  args: {
    news: mockNews.slice(0, 3),
    onNewsClick: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Планшет
export const Tablet: Story = {
  args: {
    news: mockNews.slice(0, 6),
    onNewsClick: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
};

// Интерактивный тест: Клик на новость
export const TestNewsClick: Story = {
  args: {
    news: mockNews.slice(0, 3),
    onNewsClick: (id) => {
      console.log('Клик:', id);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Находим первую карточку
    const cards = canvas.getAllByRole('button');
    
    // Кликаем на первую
    if (cards[0]) {
      await userEvent.click(cards[0]);
    }
  },
};

// Интерактивный тест: Пагинация
export const TestPagination: Story = {
  args: {
    news: mockNews.slice(0, 6),
    page: 1,
    totalPages: 5,
    onNewsClick: () => {},
    onPageChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Находим кнопку "2"
    const page2Button = canvas.getByRole('button', { name: 'Страница 2' });
    
    // Кликаем
    await userEvent.click(page2Button);
  },
};

// Все новости (8 штук, 2 страницы)
export const AllNews: Story = {
  args: {
    news: mockNews,
    page: 1,
    totalPages: 2,
    itemsPerPage: 6,
    onNewsClick: () => {},
    onPageChange: () => {},
  },
};

// Вторая страница
export const PageTwo: Story = {
  args: {
    news: mockNews.slice(6, 8),
    page: 2,
    totalPages: 2,
    onNewsClick: () => {},
    onPageChange: () => {},
  },
};

// Разные категории
export const MixedCategories: Story = {
  args: {
    news: mockNews.slice(0, 9),
    onNewsClick: () => {},
  },
};

// Интерактивный тест: Проверка количества новостей
export const TestNewsCount: Story = {
  args: {
    news: mockNews.slice(0, 6),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Проверяем количество карточек
    const cards = canvas.getAllByRole('button');
    await expect(cards.length).toBe(6);
  },
};

// Интерактивный тест: Проверка пагинации
export const TestPaginationExists: Story = {
  args: {
    news: mockNews.slice(0, 6),
    page: 1,
    totalPages: 3,
    onNewsClick: () => {},
    onPageChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Проверяем наличие пагинации
    const nextPageButton = canvas.getByRole('button', { name: 'Следующая страница' });
    await expect(nextPageButton).toBeInTheDocument();
  },
};

// Счетчик новостей
export const WithCount: Story = {
  args: {
    news: mockNews.slice(0, 6),
  },
  decorators: [
    (Story) => (
      <div>
        <div style={{ marginBottom: '16px', color: '#666' }}>
          Найдено: 8 новостей
        </div>
        <Story />
      </div>
    ),
  ],
};
