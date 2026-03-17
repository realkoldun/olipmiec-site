import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AccessibilityPanel } from './accessibility-panel';
import { userEvent, within } from '@storybook/test';
import { expect } from '@storybook/test';

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
- **Озвучка текста** (Web Speech API)
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

// Интерактивный тест: Озвучка текста
export const TestVoiceReader: Story = {
  args: {
    showFloatingButton: true,
  },
  render: (args) => (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Тест озвучки текста</h1>
      <p>Откройте панель доступности и проверьте работу озвучки</p>
      <AccessibilityPanel {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Находим плавающую кнопку и кликаем
    const floatingButton = canvas.getByRole('button', { name: /настройки доступности/i });
    await userEvent.click(floatingButton);
    
    // Ждем открытия панели
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим кнопку начала озвучки в панели
    const playButton = canvas.getByRole('button', { name: /начать озвучку/i });
    await expect(playButton).toBeInTheDocument();
    
    // Кликаем по кнопке озвучки
    await userEvent.click(playButton);
    
    // Ждем начала озвучки
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Проверяем, что кнопка изменилась на "остановить"
    const stopButton = canvas.getByRole('button', { name: /остановить озвучку/i });
    await expect(stopButton).toBeInTheDocument();
    
    // Останавливаем
    await userEvent.click(stopButton);
  },
};

// Интерактивный тест: Настройки озвучки
export const TestVoiceSettings: Story = {
  args: {
    showFloatingButton: true,
  },
  render: (args) => (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Тест настроек озвучки</h1>
      <p>Проверка изменения скорости речи</p>
      <AccessibilityPanel {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Открываем панель
    const floatingButton = canvas.getByRole('button', { name: /настройки доступности/i });
    await userEvent.click(floatingButton);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим кнопку настроек озвучки
    const settingsButton = canvas.getByRole('button', { name: /настройки озвучки/i });
    await userEvent.click(settingsButton);
    
    // Ждем открытия настроек
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Находим ползунок скорости
    const rateSlider = canvas.getByRole('slider', { name: /скорость речи/i });
    await expect(rateSlider).toBeInTheDocument();
    
    // Изменяем скорость
    const initialValue = rateSlider.getAttribute('value');
    await userEvent.type(rateSlider, '{ArrowRight}');
    
    // Проверяем, что значение изменилось
    await expect(rateSlider).toHaveValue(String(parseFloat(initialValue || '1') + 0.1));
  },
};
