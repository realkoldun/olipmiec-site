import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TextSummarizerButton, TextWithSummarizer } from './text-summarizer-button';
import { userEvent, within } from '@storybook/test';
import { expect } from '@storybook/test';

const meta = {
  title: 'Accessibility/TextSummarizer',
  component: TextSummarizerButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**TextSummarizerButton** — маленькая круглая кнопка для сокращения текста с помощью AI (Ollama).

## Особенности
- Маленькая круглая кнопка (8x8)
- Появляется только если текст длиннее minLength (по умолчанию 500 символов)
- В процессе сокращения текст "переливается" (скелетон эффект)
- Подсказка "Сократите текст" при наведении
- Интеграция с Ollama (локальная LLM)
- Кеширование результатов (5 минут)

## Использование
\`\`\`tsx
// Простая кнопка
<TextSummarizerButton
  text="Длинный текст..."
  onResult={(summarized) => setText(summarized)}
/>

// Обёртка для текста с кнопкой
<TextWithSummarizer
  text={articleContent}
  onResult={(summarized) => setSummarizedText(summarized)}
/>
\`\`\`

## Настройки
- **style**: 'brief' | 'detailed' | 'key-points'
- **maxLength**: максимальная длина результата
- **language**: 'ru' | 'en'

## Ollama
Для работы требуется запущенный Ollama:
\`\`\`bash
ollama serve
\`\`\`

Модель по умолчанию: llama3.2
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Текст для сокращения',
    },
    minLength: {
      control: 'number',
      description: 'Минимальная длина текста для показа кнопки',
    },
  },
} satisfies Meta<typeof TextSummarizerButton>;

export default meta;
type Story = StoryObj<typeof TextSummarizerButton>;

// Длинный текст для тестов
const longText = `
Специальная детско-юношеская школа олимпийского резерва «Олимпиец» 
города Витебска приглашает детей и подростков на занятия спортом. 
Наша школа работает с 1990 года и за это время подготовила множество 
талантливых спортсменов, которые успешно выступали на республиканских 
и международных соревнованиях. Мы предлагаем занятия по следующим 
видам спорта: футбол, баскетбол, волейбол, плавание, легкая атлетика. 
Наши тренеры имеют высшее образование и большой опыт работы с детьми. 
Занятия проводятся в современных спортивных залах и на стадионах. 
Запишитесь на пробное занятие уже сегодня!
`.trim();

// Короткий текст
const shortText = 'Привет! Это короткий текст.';

// Базовая история
export const Default: Story = {
  args: {
    text: longText,
    minLength: 500,
    options: {
      style: 'brief',
      maxLength: 200,
      language: 'ru',
    },
  },
};

// Текст слишком короткий (кнопка не показывается)
export const TextTooShort: Story = {
  args: {
    text: shortText,
    minLength: 500,
  },
};

// Тёмная тема
export const Dark: Story = {
  args: {
    text: longText,
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ background: '#000', minHeight: '200px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// Мобильная версия
export const Mobile: Story = {
  args: {
    text: longText,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// С кастомным minLength
export const CustomMinLength: Story = {
  args: {
    text: 'Текст средней длины. Кнопка появится только если minLength меньше длины этого текста.',
    minLength: 50,
  },
};

// TextWithSummarizer — обёртка для текста
export const WithTextWrapper: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <h2>Статья о школе</h2>
      <TextWithSummarizer
        text={longText}
        options={{ style: 'brief', maxLength: 200 }}
        showOriginalAfterSummarize={true}
      />
    </div>
  ),
};

// Несколько текстов с кнопками
export const MultipleTexts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
      <div>
        <h3>Новость 1</h3>
        <TextWithSummarizer
          text={longText}
          options={{ style: 'brief' }}
        />
      </div>
      <div>
        <h3>Новость 2</h3>
        <TextWithSummarizer
          text={longText + ' Дополнительный текст для увеличения длины.'}
          options={{ style: 'key-points' }}
        />
      </div>
    </div>
  ),
};

// Интерактивный тест: Проверка появления кнопки
export const TestButtonAppearance: Story = {
  args: {
    text: longText,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Проверяем, что кнопка есть
    const button = canvas.getByRole('button', { name: /сократить текст/i });
    await expect(button).toBeInTheDocument();
  },
};

// Интерактивный тест: Кнопка не появляется для короткого текста
export const TestNoButtonForShortText: Story = {
  args: {
    text: shortText,
    minLength: 500,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Проверяем, что кнопки нет
    const button = canvas.queryByRole('button', { name: /сократить текст/i });
    await expect(button).not.toBeInTheDocument();
  },
};

// Интерактивный тест: Подсказка при наведении
export const TestTooltip: Story = {
  args: {
    text: longText,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Находим кнопку
    const button = canvas.getByRole('button', { name: /сократить текст/i });
    
    // Наводим курсор
    await userEvent.hover(button);
    
    // Ждем появления подсказки
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Проверяем, что подсказка появилась
    const tooltip = canvas.getByText('Сократите текст');
    await expect(tooltip).toBeInTheDocument();
  },
};

// Демонстрация с реальным текстом новости
export const NewsExample: Story = {
  render: () => {
    const newsText = `
Витебские спортсмены завоевали 5 золотых медалей на республиканских 
соревнованиях по легкой атлетике, которые проходили в Минске с 15 по 
17 марта 2025 года. Среди победителей — воспитанники СДЮШОР 
«Олимпиец»: Иван Петров (бег на 100 метров), Анна Сидорова (прыжки в 
высоту), эстафетная команда 4×100 метров. Главный тренер школы 
Сергей Козлов отметил отличную подготовку спортсменов и поблагодарил 
администрацию города за поддержку.
    `.trim();

    return (
      <div style={{ maxWidth: '500px', padding: '20px' }}>
        <article>
          <h2 style={{ marginBottom: '12px' }}>Победа на республиканских соревнованиях</h2>
          <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
            18 марта 2025 | Спорт
          </div>
          <TextWithSummarizer
            text={newsText}
            options={{ style: 'brief', maxLength: 150 }}
            minLength={300}
          />
        </article>
      </div>
    );
  },
};
