import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import { ContrastToggle } from './contrast-toggle';

const meta = {
  title: 'Accessibility/ContrastToggle',
  component: ContrastToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**ContrastToggle** — переключатель режимов контраста.

## Режимы
- **Обычный** — стандартные цвета (светлая/тёмная тема)
- **Высокий** — максимальный контраст (чёрный/белый)
- **Тёмный** — тёмная тема

## Особенности
- Визуальные превью для каждого режима
- Иконки (Sun, Monitor, Moon)
- Описание текущего режима
- Сохранение в localStorage
- Переключение через CSS переменные

## Использование
\`\`\`tsx
<ContrastToggle />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      // Применяем контраст к document
      useEffect(() => {
        const handleContrastChange = () => {
          const stored = localStorage.getItem('accessibility-settings');
          if (stored) {
            const settings = JSON.parse(stored);
            const contrast = settings.state?.contrast || 'normal';
            document.documentElement.setAttribute('data-contrast', contrast);
          }
        };
        
        handleContrastChange();
        window.addEventListener('storage', handleContrastChange);
        
        return () => window.removeEventListener('storage', handleContrastChange);
      }, []);
      
      return (
        <div className="p-4 w-full max-w-md">
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof ContrastToggle>;

export default meta;
type Story = StoryObj<typeof ContrastToggle>;

// Стандартный ContrastToggle
export const Default: Story = {
  args: {},
};

// Тёмная тема
export const DarkTheme: Story = {
  render: () => (
    <div className="dark p-4">
      <ContrastToggle />
    </div>
  ),
};

// Мобильная версия
export const Mobile: Story = {
  render: () => (
    <div className="p-2 max-w-[320px]">
      <ContrastToggle />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Интерактивное тестирование
export const Interactive: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Тестирование</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Нажмите <strong>Обычный</strong> — стандартные цвета</li>
          <li>Нажмите <strong>Высокий</strong> — максимальный контраст</li>
          <li>Нажмите <strong>Тёмный</strong> — тёмная тема</li>
          <li>Проверьте <strong>превью</strong> — показывает цвета</li>
          <li>Проверьте <strong>описание</strong> — текущий режим</li>
        </ol>
      </div>
      
      <ContrastToggle />
      
      <div className="border rounded-lg p-4 bg-muted/50">
        <h4 className="text-sm font-semibold mb-2">Ожидания:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Активный режим выделен (border-primary, bg-accent/50)</li>
          <li>✅ Превью показывает цвета режима</li>
          <li>✅ Описание обновляется</li>
          <li>✅ Иконки соответствуют режиму</li>
          <li>✅ CSS переменные применяются</li>
        </ul>
      </div>
    </div>
  ),
};

// Все режимы рядом (для демонстрации)
export const AllModes: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Обычный */}
        <div className="border rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 text-center">Обычный</h4>
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 border rounded p-4">
            <p className="text-sm">Пример текста</p>
          </div>
        </div>
        
        {/* Высокий */}
        <div className="border rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 text-center">Высокий</h4>
          <div className="bg-white dark:bg-black text-black dark:text-white border-black dark:border-white border-2 rounded p-4">
            <p className="text-sm">Пример текста</p>
          </div>
        </div>
        
        {/* Тёмный */}
        <div className="border rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 text-center">Тёмный</h4>
          <div className="bg-slate-900 text-white border-slate-700 border rounded p-4">
            <p className="text-sm">Пример текста</p>
          </div>
        </div>
      </div>
      
      <ContrastToggle />
    </div>
  ),
};

// В составе панели доступности
export const InPanel: Story = {
  render: () => (
    <div className="relative w-[320px]">
      <div className="rounded-lg border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Доступность</h2>
          <button className="p-1" aria-label="Закрыть">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <ContrastToggle />
        </div>
      </div>
    </div>
  ),
};
