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
**AccessibilityPanel** — плавающая панель настроек доступности.

## Особенности
- Плавающая кнопка в правом нижнем углу
- Открывается/закрывается по клику
- Настройки размера текста
- Настройки контраста
- Сброс настроек
- Сохранение в localStorage

## Использование
Добавить в корень приложения (после Header):
\`\`\`tsx
<AccessibilityPanel />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccessibilityPanel>;

export default meta;
type Story = StoryObj<typeof AccessibilityPanel>;

// Стандартная панель
export const Default: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Контент страницы</h1>
      <p>Нажмите на кнопку доступности в правом нижнем углу</p>
      <AccessibilityPanel />
    </div>
  ),
};

// Открытая панель
export const Open: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Контент страницы</h1>
      <p>Панель открыта</p>
      <AccessibilityPanel />
    </div>
  ),
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
};

// Тёмная тема
export const DarkTheme: Story = {
  render: () => (
    <div className="dark" style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Контент страницы</h1>
      <p>Тёмная тема + доступность</p>
      <AccessibilityPanel />
    </div>
  ),
};

// Мобильная версия
export const Mobile: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', padding: '10px' }}>
      <h1>Контент</h1>
      <p>Мобильная версия</p>
      <AccessibilityPanel />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
