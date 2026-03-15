import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer } from './footer';

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Footer** — подвал сайта с контактной информацией и навигацией.

## Секции
- Логотип и описание школы
- Навигация по разделам (3 колонки)
- Контактная информация с иконками
- Копирайт и юридические ссылки

## Особенности
- Прижат к низу страницы (mt-auto)
- Адаптивная сетка (mobile/tablet/desktop)
- Иконки контактов (телефон, email, адрес, время)
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof Footer>;

// Стандартный Footer
export const Default: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, padding: '40px 20px' }}>
        <h1>Основной контент</h1>
        <p>Footer будет прижат к низу страницы</p>
      </main>
      <Footer />
    </div>
  ),
};

// Footer отдельно
export const Standalone: Story = {
  render: () => <Footer />,
};

// Footer с кастомным классом
export const WithCustomClass: Story = {
  render: () => <Footer className="bg-background" />,
};

// Для демонстрации на мобильных
export const Mobile: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, padding: '20px 10px' }}>
        <h1>Контент</h1>
      </main>
      <Footer />
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
  render: () => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, padding: '40px 20px' }}>
        <h1>Контент</h1>
      </main>
      <Footer />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
};

// Тёмная тема
export const DarkTheme: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="dark">
      <main style={{ flex: 1, padding: '40px 20px' }}>
        <h1>Контент</h1>
      </main>
      <Footer />
    </div>
  ),
};
