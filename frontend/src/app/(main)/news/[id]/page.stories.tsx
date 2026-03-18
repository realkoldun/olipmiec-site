import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsDetailPage from './page';
import { within, userEvent, expect } from '@storybook/test';

const meta = {
  title: 'Pages/NewsDetailPage',
  component: NewsDetailPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component: `
**NewsDetailPage** — детальная страница новости.

## Особенности
- Полное содержимое новости
- Изображение
- Мета-информация (автор, дата, просмотры)
- Теги
- Категория
- Навигация назад

## URL
/news/[id]

## Параметры
- id: news-1, news-2, ..., news-8
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    params: {
      description: 'Параметры маршрута (id новости)',
    },
  },
} satisfies Meta<typeof NewsDetailPage>;

export default meta;
type Story = StoryObj<typeof NewsDetailPage>;

// Базовая история - первая новость
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
};

// Спорт
export const SportNews: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
};

// Объявление
export const AnnouncementNews: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-2',
      },
    },
  },
};

// Мероприятие
export const EventNews: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-3',
      },
    },
  },
};

// Плавание (рекорд)
export const SwimmingNews: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-4',
      },
    },
  },
};

// Баскетбол
export const BasketballNews: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-6',
      },
    },
  },
};

// Тёмная тема
export const Dark: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

// Мобильная версия
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
};

// Планшет
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
};

// Интерактивный тест: Кнопка назад
export const TestBackButton: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим кнопку "Назад"
    const backButton = canvas.getByText('Назад');
    await expect(backButton).toBeInTheDocument();
    
    // Кликаем
    await userEvent.click(backButton);
  },
};

// Интерактивный тест: Проверка содержимого
export const TestContent: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Проверяем заголовок
    const title = canvas.getByRole('heading', { level: 1 });
    await expect(title).toBeInTheDocument();
    
    // Проверяем наличие тегов
    const tags = canvas.getAllByRole('status');
    await expect(tags.length).toBeGreaterThan(0);
  },
};

// Новость не найдена
export const NotFound: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/non-existent',
      },
    },
  },
};

// Новость с большим количеством тегов
export const ManyTags: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
};

// Новость без изображения
export const WithoutImage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-5',
      },
    },
  },
};

// Длинный текст новости
export const LongContent: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
};

// Все метаданные
export const WithAllMeta: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news/news-1',
      },
    },
  },
};
