import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { MobileNav } from './mobile-nav';
import { Button } from '@/components/ui/button/button';

const meta = {
  title: 'Layout/MobileNav',
  component: MobileNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**MobileNav** — мобильное навигационное меню (бургер).

## Особенности
- Выезжает справа
- Закрытие по ESC и клику вне области
- Анимация появления
- Полноэкранная подсветка фона
- Навигация с описанием каждого пункта
        `,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onClose: () => {},
  },
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof MobileNav>;

// Интерактивная демонстрация
export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setOpen(true)}>Открыть мобильное меню</Button>
        <MobileNav open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};

// Открытое меню
export const Open: Story = {
  args: { open: true },
};

// Закрытое меню
export const Closed: Story = {
  args: { open: false },
};

// Для демонстрации на планшете
export const Tablet: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setOpen(true)}>Открыть меню</Button>
        <MobileNav open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
};

// Для демонстрации на мобильном
export const SmallMobile: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setOpen(true)}>Открыть меню</Button>
        <MobileNav open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone13',
    },
  },
};
