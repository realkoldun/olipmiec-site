import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Кнопка — базовый интерактивный компонент для действий пользователя.

## Особенности
- Поддержка нескольких вариантов (variant)
- Три размера (sm, default, lg)
- Доступность (keyboard navigation, focus states)
- Иконки через children
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'outline', 'ghost', 'link', 'destructive'],
      description: 'Визуальный стиль кнопки',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
      description: 'Размер кнопки',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключённое состояние',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Основная кнопка
export const Primary: Story = {
  args: {
    children: 'Сохранить',
    variant: 'primary',
  },
};

// Вторичная кнопка
export const Secondary: Story = {
  args: {
    children: 'Отмена',
    variant: 'secondary',
  },
};

// Акцентная кнопка
export const Accent: Story = {
  args: {
    children: 'Записаться',
    variant: 'accent',
  },
};

// Кнопка с обводкой
export const Outline: Story = {
  args: {
    children: 'Подробнее',
    variant: 'outline',
  },
};

// Прозрачная кнопка
export const Ghost: Story = {
  args: {
    children: 'Ещё',
    variant: 'ghost',
  },
};

// Кнопка-ссылка
export const Link: Story = {
  args: {
    children: 'Перейти в каталог',
    variant: 'link',
  },
};

// Деструктивная кнопка
export const Destructive: Story = {
  args: {
    children: 'Удалить',
    variant: 'destructive',
  },
};

// Отключённая кнопка
export const Disabled: Story = {
  args: {
    children: 'Недоступно',
    disabled: true,
  },
};

// Разные размеры
export const Small: Story = {
  args: {
    children: 'Маленькая',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Большая',
    size: 'lg',
  },
};

// Кнопка-иконка
export const Icon: Story = {
  args: {
    children: '🔍',
    size: 'icon',
    'aria-label': 'Поиск',
  },
};

// С иконкой и текстом
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span>📧</span>
        Отправить письмо
      </>
    ),
  },
};

// Все варианты вместе
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

// Все размеры вместе
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Button size="sm">Small (h-9)</Button>
      <Button size="default">Default (h-10)</Button>
      <Button size="lg">Large (h-11)</Button>
      <Button size="icon" aria-label="Icon button">
        ⚙️
      </Button>
    </div>
  ),
};
