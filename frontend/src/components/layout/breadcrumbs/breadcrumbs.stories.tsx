import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Breadcrumbs } from './breadcrumbs';

const meta = {
  title: 'Layout/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Breadcrumbs** — навигационные хлебные крошки.

## Особенности
- Показывает текущее местоположение пользователя
- Быстрый переход к предыдущим страницам
- Поддержка разных разделителей (chevron, slash, dot)
- Домашняя иконка для перехода на главную
- Доступность (ARIA-атрибуты, keyboard navigation)

## Использование
Используется на всех страницах для навигации:
- Новости → Категория → Статья
- Секции → Футбол
- Тренеры → Петров П.П.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    separator: {
      control: 'select',
      options: ['chevron', 'slash', 'dot'],
      description: 'Тип разделителя',
    },
    showHome: {
      control: 'boolean',
      description: 'Показывать домашнюю иконку',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

// Стандартные хлебные крошки
export const Default: Story = {
  args: {
    items: [
      { label: 'Новости', href: '/news' },
      { label: 'Победа на соревнованиях' },
    ],
    showHome: true,
    separator: 'chevron',
  },
};

// Длинные хлебные крошки
export const Long: Story = {
  args: {
    items: [
      { label: 'Новости', href: '/news' },
      { label: '2025', href: '/news/2025' },
      { label: 'Январь', href: '/news/2025/january' },
      { label: 'Победа на областных соревнованиях' },
    ],
    showHome: true,
    separator: 'chevron',
  },
};

// Без домашней иконки
export const WithoutHome: Story = {
  args: {
    items: [
      { label: 'Секции', href: '/sections' },
      { label: 'Футбол' },
    ],
    showHome: false,
    separator: 'chevron',
  },
};

// С разделителем slash
export const SlashSeparator: Story = {
  args: {
    items: [
      { label: 'Документы', href: '/documents' },
      { label: 'Положение о секции' },
    ],
    showHome: true,
    separator: 'slash',
  },
};

// С разделителем dot
export const DotSeparator: Story = {
  args: {
    items: [
      { label: 'Тренеры', href: '/trainers' },
      { label: 'Петров П.П.' },
    ],
    showHome: true,
    separator: 'dot',
  },
};

// Короткие (одна страница)
export const Single: Story = {
  args: {
    items: [
      { label: 'Контакты' },
    ],
    showHome: true,
    separator: 'chevron',
  },
};

// Для мобильных
export const Mobile: Story = {
  args: {
    items: [
      { label: 'Новости', href: '/news' },
      { label: 'Победа на областных соревнованиях по футболу' },
    ],
    showHome: true,
    separator: 'chevron',
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
    items: [
      { label: 'Новости', href: '/news' },
      { label: '2025', href: '/news/2025' },
      { label: 'Победа' },
    ],
    showHome: true,
    separator: 'chevron',
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
};
