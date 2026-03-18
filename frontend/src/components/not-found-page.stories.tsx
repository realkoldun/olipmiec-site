import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotFoundPage } from '@/components/not-found-page';
import { within, userEvent, expect } from '@storybook/test';

const meta = {
  title: 'Pages/NotFoundPage',
  component: NotFoundPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**NotFoundPage** — страница ошибки 404.

## Особенности
- Header с навигацией
- Footer
- Кнопка "На главную"
- Кнопка "Назад"
- Быстрые ссылки на разделы

## Использование
Страница отображается автоматически при переходе на несуществующий URL.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

// Базовая история
export const Default: Story = {};

// Тёмная тема
export const Dark: Story = {
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
  },
};

// Планшет
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
};

// Интерактивный тест: Клик на "На главную"
export const TestGoHome: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим кнопку "На главную"
    const homeButton = canvas.getByText('На главную');
    await expect(homeButton).toBeInTheDocument();
    
    // Кликаем
    await userEvent.click(homeButton);
  },
};

// Интерактивный тест: Клик на "Назад"
export const TestGoBack: Story = {
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

// Интерактивный тест: Клик на ссылку "Новости"
export const TestNewsLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим кнопку "Новости"
    const newsButton = canvas.getByText('Новости');
    await expect(newsButton).toBeInTheDocument();
    
    // Кликаем
    await userEvent.click(newsButton);
  },
};

// Интерактивный тест: Проверка заголовка
export const TestTitle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Проверяем заголовок "404"
    const title = canvas.getByText('404');
    await expect(title).toBeInTheDocument();
    
    // Проверяем подзаголовок
    const subtitle = canvas.getByText('Страница не найдена');
    await expect(subtitle).toBeInTheDocument();
  },
};

// Интерактивный тест: Проверка иконки
export const TestIcon: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Ждем рендеринга
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Проверяем наличие иконки
    const icon = canvas.getByTestId('file-warning-icon');
    await expect(icon).toBeInTheDocument();
  },
};
