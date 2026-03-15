import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import { TextResizer } from './text-resizer';

const meta = {
  title: 'Accessibility/TextResizer',
  component: TextResizer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**TextResizer** — компонент изменения размера текста.

## Особенности
- Изменение размера от 12px до 24px
- Шаг изменения: 2px
- Визуальная шкала прогресса
- Пример текста для предпросмотра
- Кнопка сброса к значению по умолчанию
- Сохранение в localStorage
- Блокировка кнопок при достижении мин/макс

## Управление
- **-** (кнопка) — уменьшить на 2px
- **+** (кнопка) — увеличить на 2px
- **Сброс** — вернуть 16px
- **Ctrl + -** — уменьшить (горячая клавиша)
- **Ctrl + +** — увеличить (горячая клавиша)
        `,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onFontSizeChange: fn(),
  },
} satisfies Meta<typeof TextResizer>;

export default meta;
type Story = StoryObj<typeof TextResizer>;

// Стандартный TextResizer
export const Default: Story = {
  args: {},
};

// С тёмной темой
export const DarkTheme: Story = {
  render: (args) => (
    <div className="p-4 dark">
      <TextResizer {...args} />
    </div>
  ),
};

// Маленький размер
export const SmallSize: Story = {
  render: (args) => (
    <div className="p-4">
      <p className="text-sm text-muted-foreground mb-4">
        Установлен минимальный размер (12px)
      </p>
      <TextResizer {...args} />
    </div>
  ),
  parameters: {
    accessibility: {
      // Эмуляция состояния store с минимальным размером
      initialState: { fontSize: 12 },
    },
  },
};

// Большой размер
export const LargeSize: Story = {
  render: (args) => (
    <div className="p-4">
      <p className="text-sm text-muted-foreground mb-4">
        Установлен максимальный размер (24px)
      </p>
      <TextResizer {...args} />
    </div>
  ),
  parameters: {
    accessibility: {
      initialState: { fontSize: 24 },
    },
  },
};

// Интерактивное тестирование
export const Interactive: Story = {
  render: (args) => (
    <div className="p-4 space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Тестирование</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Нажмите <strong>-</strong> — размер должен уменьшиться</li>
          <li>Нажмите <strong>+</strong> — размер должен увеличиться</li>
          <li>Достигните <strong>12px</strong> — кнопка - должна заблокироваться</li>
          <li>Достигните <strong>24px</strong> — кнопка + должна заблокироваться</li>
          <li>Нажмите <strong>Сброс</strong> — должно вернуться 16px</li>
          <li>Проверьте <strong>пример текста</strong> — шрифт должен измениться</li>
          <li>Проверьте <strong>шкалу</strong> — должна заполняться</li>
        </ol>
      </div>
      
      <div className="border-t pt-4">
        <TextResizer {...args} />
      </div>
      
      <div className="border rounded-lg p-4 bg-muted/50">
        <h4 className="text-sm font-semibold mb-2">Ожидания:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Кнопки реагируют на нажатия</li>
          <li>✅ Размер меняется на 2px за шаг</li>
          <li>✅ Кнопки блокируются на границах (12px, 24px)</li>
          <li>✅ Шкала заполняется пропорционально</li>
          <li>✅ Пример текста изменяет размер шрифта</li>
          <li>✅ Метка меняется (Маленький/Нормальный/Большой)</li>
        </ul>
      </div>
    </div>
  ),
};

// Мобильная версия
export const Mobile: Story = {
  render: (args) => (
    <div className="p-2 max-w-[320px]">
      <TextResizer {...args} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// В составе панели доступности
export const InPanel: Story = {
  render: (args) => (
    <div className="relative w-[320px]">
      <div className="rounded-lg border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Доступность</h2>
          <button className="p-1" aria-label="Закрыть">✕</button>
        </div>
        <div className="p-4">
          <TextResizer {...args} />
        </div>
      </div>
    </div>
  ),
};

// Тест горячих клавиш
export const KeyboardShortcuts: Story = {
  render: (args) => (
    <div className="p-4 space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Горячие клавиши</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">+</kbd>
            <span>— Увеличить</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">-</kbd>
            <span>— Уменьшить</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">0</kbd>
            <span>— Сбросить</span>
          </div>
        </div>
      </div>
      
      <TextResizer {...args} />
    </div>
  ),
};
