import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchBar } from './search-bar';
import { userEvent, within } from '@storybook/test';
import { expect } from '@storybook/test';
import { SearchProvider } from '@/providers/search-provider';
import type { ReactElement } from 'react';

const meta = {
  title: 'Search/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**SearchBar** — строка поиска с автодополнением.

## Особенности
- Горячие клавиши Ctrl+K для открытия
- Debounce для автопоиска (300мс по умолчанию)
- Индикатор загрузки
- Кнопка очистки
- Подсказка о горячих клавишах

## Использование
\`\`\`tsx
<SearchBar
  autoSearch
  debounceMs={300}
  placeholder="Поиск..."
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showClose: {
      control: 'boolean',
      description: 'Показывать кнопку закрытия',
    },
    autoSearch: {
      control: 'boolean',
      description: 'Автоматический поиск при вводе',
    },
    debounceMs: {
      control: 'number',
      description: 'Задержка перед поиском (мс)',
    },
    placeholder: {
      control: 'text',
      description: 'Плейсхолдер',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Размер',
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof SearchBar>;

// Декоратор с провайдером
const withProvider = (Story: () => ReactElement) => (
  <SearchProvider>
    <div style={{ maxWidth: '600px', width: '100%' }}>
      <Story />
    </div>
  </SearchProvider>
);

// Базовая история
export const Default: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: true,
    placeholder: 'Поиск...',
    size: 'md',
  },
};

// Малый размер
export const Small: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: true,
    placeholder: 'Поиск...',
    size: 'sm',
  },
};

// Большой размер
export const Large: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: true,
    placeholder: 'Поиск по сайту...',
    size: 'lg',
  },
};

// С кнопкой закрытия
export const WithCloseButton: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: true,
    showClose: true,
    placeholder: 'Поиск...',
    size: 'md',
  },
};

// Без автопоиска (по Enter)
export const ManualSearch: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: false,
    placeholder: 'Введите запрос и нажмите Enter',
    size: 'md',
  },
};

// С предзаполненным значением
export const Prepopulated: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: true,
    placeholder: 'Поиск...',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    await userEvent.type(input, 'футбол');
  },
};

// Интерактивный тест: Ввод текста
export const TestTyping: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: true,
    placeholder: 'Поиск...',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    
    // Проверяем, что input существует
    await expect(input).toBeInTheDocument();
    
    // Вводим текст
    await userEvent.type(input, 'новости');
    
    // Проверяем, что текст введен
    await expect(input).toHaveValue('новости');
  },
};

// Интерактивный тест: Очистка
export const TestClear: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: true,
    placeholder: 'Поиск...',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    
    // Вводим текст
    await userEvent.type(input, 'тест');
    await expect(input).toHaveValue('тест');
    
    // Находим и кликаем кнопку очистки
    const clearButton = canvas.getByRole('button', { name: /очистить/i });
    await userEvent.click(clearButton);
    
    // Проверяем, что текст очищен
    await expect(input).toHaveValue('');
  },
};

// Тёмная тема
export const Dark: Story = {
  decorators: [
    (Story) => (
      <SearchProvider>
        <div className="dark" style={{ background: '#000', minHeight: '200px', padding: '20px', maxWidth: '600px' }}>
          <Story />
        </div>
      </SearchProvider>
    ),
  ],
  args: {
    autoSearch: true,
    placeholder: 'Поиск...',
    size: 'md',
  },
};

// Мобильная версия
export const Mobile: Story = {
  decorators: [withProvider],
  args: {
    autoSearch: true,
    placeholder: 'Поиск...',
    size: 'md',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
