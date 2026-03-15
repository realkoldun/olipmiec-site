import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './header';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Header** — шапка сайта с навигацией, поиском и кнопкой доступности.

## Особенности
- Адаптивная навигация (бургер-меню для мобильных)
- Поиск с открытием по клику
- Кнопка настроек доступности
- Фиксированное позиционирование
- Логотип с названием школы

## Структура
- Логотип (слева)
- Навигация (центр)
- Действия: поиск, доступность, мобильное меню (справа)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showSearch: {
      control: 'boolean',
      description: 'Показывать поиск',
    },
    showAccessibility: {
      control: 'boolean',
      description: 'Показывать кнопку доступности',
    },
    fixed: {
      control: 'boolean',
      description: 'Фиксированный header',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// Стандартный Header
export const Default: Story = {
  args: {
    showSearch: true,
    showAccessibility: true,
    fixed: true,
  },
};

// Header без поиска
export const WithoutSearch: Story = {
  args: {
    showSearch: false,
    showAccessibility: true,
    fixed: true,
  },
};

// Header без доступности
export const WithoutAccessibility: Story = {
  args: {
    showSearch: true,
    showAccessibility: false,
    fixed: true,
  },
};

// Header нефиксированный
export const NotFixed: Story = {
  args: {
    showSearch: true,
    showAccessibility: true,
    fixed: false,
  },
};

// Минимальный Header (только логотип и меню)
export const Minimal: Story = {
  args: {
    showSearch: false,
    showAccessibility: false,
    fixed: true,
  },
};

// Для демонстрации мобильного меню
export const Mobile: Story = {
  args: {
    showSearch: true,
    showAccessibility: true,
    fixed: true,
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
    showSearch: true,
    showAccessibility: true,
    fixed: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
};
