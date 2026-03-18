import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsPage from './page';
import { within, userEvent, expect } from '@storybook/test';

const meta = {
  title: 'Pages/NewsPage',
  component: NewsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component: `
**NewsPage** — страница новостей.

## Особенности
- Список новостей с пагинацией
- Фильтрация по категории
- Адаптивная сетка
- Навигация к детальной странице

## URL
/news
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsPage>;

export default meta;
type Story = StoryObj<typeof NewsPage>;

// Базовая история
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
      },
    },
  },
};

// Тёмная тема
export const Dark: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
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
        pathname: '/news',
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
        pathname: '/news',
      },
    },
  },
};

// Интерактивный тест: Фильтрация по категории
export const TestCategoryFilter: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим кнопку "Спорт"
    const sportButton = canvas.getByText('Спорт');
    await expect(sportButton).toBeInTheDocument();
    
    // Кликаем
    await userEvent.click(sportButton);
    
    // Ждем обновления
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};

// Интерактивный тест: Пагинация
export const TestPagination: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим кнопку "2"
    const page2Button = canvas.getByRole('button', { name: 'Страница 2' });
    
    // Кликаем если существует
    if (page2Button) {
      await userEvent.click(page2Button);
    }
  },
};

// Интерактивный тест: Клик на новость
export const TestNewsClick: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим первую карточку новости
    const cards = canvas.getAllByRole('button');
    
    if (cards.length > 0) {
      // Кликаем на первую
      await userEvent.click(cards[0]);
    }
  },
};

// Пустой список новостей (симуляция)
export const EmptyState: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
        search: '?category=empty',
      },
    },
  },
};

// Много новостей (все 8)
export const AllNews: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
        search: '?page=1',
      },
    },
  },
};

// Вторая страница
export const PageTwo: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
        search: '?page=2',
      },
    },
  },
};

// Фильтр: Спорт
export const FilterSport: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
        search: '?category=sport',
      },
    },
  },
};

// Фильтр: Объявления
export const FilterAnnouncement: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
        search: '?category=announcement',
      },
    },
  },
};

// Фильтр: Мероприятия
export const FilterEvent: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/news',
        search: '?category=event',
      },
    },
  },
};
