import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { VoiceReader } from './voice-reader';
import { userEvent, within } from '@storybook/test';
import { expect } from '@storybook/test';

const meta = {
  title: 'Accessibility/VoiceReader',
  component: VoiceReader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**VoiceReader** — компонент озвучки текста с кастомным управлением.

## Особенности
- Кастомное управление воспроизведением (старт/пауза/стоп)
- Выбор скорости речи (0.5x - 2x)
- Визуальная индикация состояния
- Выбор голоса из доступных
- Интеграция с accessibility store
- Анимация во время озвучки

## Использование
\`\`\`tsx
<VoiceReader 
  text="Текст для озвучки"
  showAdvancedSettings={true}
/>
\`\`\`

## Web Speech API
Компонент использует Web Speech API (SpeechSynthesis).
Поддерживается в современных браузерах:
- Chrome/Edge (лучшая поддержка)
- Firefox
- Safari

## Тесты
- Старт озвучки
- Пауза/продолжение
- Остановка
- Изменение скорости
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Текст для озвучки',
    },
    showAdvancedSettings: {
      control: 'boolean',
      description: 'Показывать расширенные настройки',
    },
  },
} satisfies Meta<typeof VoiceReader>;

export default meta;
type Story = StoryObj<typeof VoiceReader>;

// Текст по умолчанию для тестов
const defaultText = 'Привет! Это пример озвучки текста в браузере. Компонент VoiceReader использует Web Speech API для синтеза речи.';

// Длинный текст для демонстрации
const longText = `
Специальная детско-юношеская школа олимпийского резерва "Олимпиец" 
города Витебска приглашает детей и подростков на занятия спортом.

Наши преимущества:
- Опытные тренеры
- Современные спортивные залы
- Участие в соревнованиях
- Бесплатные занятия

Запишитесь на пробное занятие уже сегодня!
`;

// Базовая история
export const Default: Story = {
  args: {
    text: defaultText,
    showAdvancedSettings: false,
  },
};

// С расширенными настройками
export const WithSettings: Story = {
  args: {
    text: defaultText,
    showAdvancedSettings: true,
  },
};

// С длинным текстом
export const LongText: Story = {
  args: {
    text: longText,
    showAdvancedSettings: true,
  },
};

// Без текста (disabled состояние)
export const NoText: Story = {
  args: {
    text: '',
    showAdvancedSettings: false,
  },
};

// Тёмная тема
export const Dark: Story = {
  args: {
    text: defaultText,
    showAdvancedSettings: true,
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ background: '#000', minHeight: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// Мобильная версия
export const Mobile: Story = {
  args: {
    text: defaultText,
    showAdvancedSettings: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Интерактивный тест: Старт озвучки
export const TestPlay: Story = {
  args: {
    text: defaultText,
    showAdvancedSettings: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Находим кнопку воспроизведения
    const playButton = canvas.getByRole('button', { name: /начать озвучку/i });
    
    // Проверяем, что кнопка существует
    await expect(playButton).toBeInTheDocument();
    
    // Кликаем по кнопке
    await userEvent.click(playButton);
    
    // Ждем немного для обновления состояния
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Проверяем, что кнопка изменилась на "стоп"
    const stopButton = canvas.getByRole('button', { name: /остановить озвучку/i });
    await expect(stopButton).toBeInTheDocument();
  },
};

// Интерактивный тест: Пауза
export const TestPause: Story = {
  args: {
    text: defaultText,
    showAdvancedSettings: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Находим и кликаем кнопку воспроизведения
    const playButton = canvas.getByRole('button', { name: /начать озвучку/i });
    await userEvent.click(playButton);
    
    // Ждем начала озвучки
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Находим кнопку паузы
    const pauseButton = canvas.getByRole('button', { name: /пауза/i });
    await expect(pauseButton).toBeInTheDocument();
    
    // Кликаем паузу
    await userEvent.click(pauseButton);
    
    // Ждем обновления
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Проверяем, что появилась кнопка продолжения
    const resumeButton = canvas.getByRole('button', { name: /продолжить/i });
    await expect(resumeButton).toBeInTheDocument();
  },
};

// Интерактивный тест: Изменение скорости
export const TestRateChange: Story = {
  args: {
    text: defaultText,
    showAdvancedSettings: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Находим и кликаем кнопку настроек
    const settingsButton = canvas.getByRole('button', { name: /настройки озвучки/i });
    await userEvent.click(settingsButton);
    
    // Ждем открытия настроек
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Находим ползунок скорости
    const rateSlider = canvas.getByRole('slider', { name: /скорость речи/i });
    await expect(rateSlider).toBeInTheDocument();
    
    // Изменяем скорость
    await userEvent.type(rateSlider, '{ArrowRight}');
    
    // Проверяем, что значение изменилось
    await expect(rateSlider).toHaveValue('1.1');
  },
};

// Интерактивный тест: Полный цикл
export const TestFullCycle: Story = {
  args: {
    text: 'Тестовый текст для полного цикла проверки.',
    showAdvancedSettings: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Старт
    const playButton = canvas.getByRole('button', { name: /начать озвучку/i });
    await userEvent.click(playButton);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 2. Проверяем, что появилась кнопка паузы
    const pauseButton = canvas.getByRole('button', { name: /пауза/i });
    await expect(pauseButton).toBeInTheDocument();

    // 3. Пауза
    await userEvent.click(pauseButton);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 4. Продолжение
    const resumeButton = canvas.getByRole('button', { name: /продолжить/i });
    await userEvent.click(resumeButton);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 5. Остановка
    const stopButton = canvas.getByRole('button', { name: /остановить/i });
    await userEvent.click(stopButton);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 6. Проверяем, что снова появилась кнопка play
    const playButtonAgain = canvas.getByRole('button', { name: /начать озвучку/i });
    await expect(playButtonAgain).toBeInTheDocument();
  },
};

// Демонстрация с визуальным эффектом
export const WithVisualizer: Story = {
  args: {
    text: defaultText,
    showAdvancedSettings: true,
  },
  decorators: [
    (Story) => (
      <div style={{ 
        maxWidth: '500px', 
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '16px',
          marginBottom: '16px',
        }}>
          <p style={{ margin: 0, color: '#333' }}>{defaultText}</p>
        </div>
        <Story />
      </div>
    ),
  ],
};
