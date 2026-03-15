import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AccessibilityPanel } from './accessibility-panel';

const meta = {
  title: 'Accessibility/Panel',
  component: AccessibilityPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**AccessibilityPanel** — панель настроек доступности.

## Особенности
- Открывается по кнопке в Header
- Закрытие по ESC или клику вне панели
- Настройки размера текста
- Настройки контраста
- Сброс настроек
- Сохранение в localStorage
- Адаптивная (мобильная версия)
- Тёмная тема

## Использование
В Header:
\`\`\`tsx
<Header showAccessibilityPanel={true} />
\`\`\`

В Storybook (с плавающей кнопкой):
\`\`\`tsx
<AccessibilityPanel showFloatingButton={true} />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showFloatingButton: {
      control: 'boolean',
      description: 'Показывать плавающую кнопку (для Storybook)',
    },
  },
} satisfies Meta<typeof AccessibilityPanel>;

export default meta;
type Story = StoryObj<typeof AccessibilityPanel>;

// С плавающей кнопкой (для демонстрации)
export const Default: Story = {
  args: {
    showFloatingButton: true,
  },
  render: (args) => (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Контент страницы</h1>
      <p>Нажмите на кнопку в правом нижнем углу или на иконку ♿ в Header</p>
      <AccessibilityPanel {...args} />
    </div>
  ),
};

// Тёмная тема
export const DarkTheme: Story = {
  args: {
    showFloatingButton: true,
  },
  render: (args) => (
    <div className="dark" style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Контент страницы</h1>
      <p>Тёмная тема + доступность</p>
      <AccessibilityPanel {...args} />
    </div>
  ),
};

// Мобильная версия
export const Mobile: Story = {
  args: {
    showFloatingButton: true,
  },
  render: (args) => (
    <div style={{ minHeight: '100vh', padding: '10px' }}>
      <h1>Контент</h1>
      <p>Мобильная версия — панель на всю ширину</p>
      <AccessibilityPanel {...args} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Планшет
export const Tablet: Story = {
  args: {
    showFloatingButton: true,
  },
  render: (args) => (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Контент</h1>
      <AccessibilityPanel {...args} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
};

// С интеграцией в Header
export const WithHeader: Story = {
  render: () => (
    <div style={{ minHeight: '100vh' }}>
      {/* Имитация Header */}
      <header style={{
        borderBottom: '1px solid',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>🏆 Олимпиец</span>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-accessibility-panel'))}
          style={{
            padding: '0.5rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
          aria-label="Настройки доступности"
        >
          ♿
        </button>
      </header>
      
      <main style={{ padding: '2rem' }}>
        <h1>Контент страницы</h1>
        <p>Нажмите на ♿ в правом верхнем углу</p>
      </main>
      
      <AccessibilityPanel />
    </div>
  ),
};
