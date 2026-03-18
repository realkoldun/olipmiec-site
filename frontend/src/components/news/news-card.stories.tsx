import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NewsCard } from './news-card';
import { userEvent, within } from '@storybook/test';
import { expect } from '@storybook/test';
import type { NewsItem } from '@/types/news';
import { mockNews } from '@/mocks/news.mock';

const meta = {
  title: 'News/NewsCard',
  component: NewsCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**NewsCard** — карточка новости.

## Особенности
- Отображение изображения
- Мета-информация (автор, дата, просмотры)
- Теги
- Категория
- Адаптивный размер

## Использование
\`\`\`tsx
<NewsCard
  news={newsItem}
  onClick={(id) => router.push('/news/' + id)}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Размер карточки',
    },
    showImage: {
      control: 'boolean',
      description: 'Показывать изображение',
    },
    showMeta: {
      control: 'boolean',
      description: 'Показывать мета-информацию',
    },
    showTags: {
      control: 'boolean',
      description: 'Показывать теги',
    },
  },
} satisfies Meta<typeof NewsCard>;

export default meta;
type Story = StoryObj<typeof NewsCard>;

// Пример новости
const sampleNews: NewsItem = {
  id: 'news-1',
  title: 'Победа на областных соревнованиях по легкой атлетике',
  content: 'Витебские спортсмены завоевали 5 золотых медалей...',
  excerpt: 'Витебские спортсмены завоевали 5 золотых медалей на республиканских соревнованиях...',
  image: 'https://images.unsplash.com/photo-1461896836934- voices?auto=format&fit=crop&w=800&q=80',
  author: 'Сергей Иванов',
  createdAt: '2025-03-18',
  tags: ['соревнования', 'легкая атлетика', 'победа', 'медали'],
  category: 'sport',
  published: true,
  views: 1250,
};

// Базовая история
export const Default: Story = {
  args: {
    news: sampleNews,
    size: 'md',
  },
};

// Малый размер
export const Small: Story = {
  args: {
    news: sampleNews,
    size: 'sm',
  },
};

// Большой размер
export const Large: Story = {
  args: {
    news: sampleNews,
    size: 'lg',
  },
};

// Без изображения
export const WithoutImage: Story = {
  args: {
    news: { ...sampleNews, image: undefined },
    showImage: false,
  },
};

// Без мета-информации
export const WithoutMeta: Story = {
  args: {
    news: sampleNews,
    showMeta: false,
  },
};

// Без тегов
export const WithoutTags: Story = {
  args: {
    news: sampleNews,
    showTags: false,
  },
};

// С кликом
export const WithClick: Story = {
  args: {
    news: sampleNews,
    onClick: (id) => {
      alert(`Клик на новость: ${id}`);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button');
    
    // Проверяем, что карточка существует
    await expect(card).toBeInTheDocument();
    
    // Кликаем
    await userEvent.click(card);
  },
};

// Разные категории
export const CategoryAnnouncement: Story = {
  args: {
    news: {
      ...sampleNews,
      category: 'announcement',
      title: 'Открыта запись в футбольную секцию',
      tags: ['футбол', 'секция', 'набор'],
    },
  },
};

export const CategoryEvent: Story = {
  args: {
    news: {
      ...sampleNews,
      category: 'event',
      title: 'День открытых дверей 25 марта',
      tags: ['мероприятие', 'день открытых дверей'],
    },
  },
};

// Тёмная тема
export const Dark: Story = {
  args: {
    news: sampleNews,
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ background: '#000', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// Мобильная версия
export const Mobile: Story = {
  args: {
    news: sampleNews,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Длинный заголовок
export const LongTitle: Story = {
  args: {
    news: {
      ...sampleNews,
      title: 'Очень длинный заголовок новости который должен корректно обрезаться и отображаться на нескольких строках без переноса слов',
    },
  },
};

// Много тегов
export const ManyTags: Story = {
  args: {
    news: {
      ...sampleNews,
      tags: ['тег1', 'тег2', 'тег3', 'тег4', 'тег5', 'тег6'],
    },
  },
};

// Все новости из моковых данных
export const AllMockNews: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
      {mockNews.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  ),
};

// Интерактивный тест: Проверка заголовка
export const TestTitle: Story = {
  args: {
    news: sampleNews,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Проверяем заголовок
    const title = canvas.getByText(sampleNews.title);
    await expect(title).toBeInTheDocument();
  },
};

// Интерактивный тест: Проверка тегов
export const TestTags: Story = {
  args: {
    news: sampleNews,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Проверяем наличие тегов
    const tags = canvas.getAllByRole('status');
    expect(tags.length).toBeGreaterThan(0);
  },
};

// Интерактивный тест: Проверка мета-информации
export const TestMeta: Story = {
  args: {
    news: sampleNews,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Проверяем дату
    const dateElement = canvas.getByText(/март 2025/i);
    await expect(dateElement).toBeInTheDocument();
    
    // Проверяем просмотры
    const viewsElement = canvas.getByText('1250');
    await expect(viewsElement).toBeInTheDocument();
  },
};
