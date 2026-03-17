import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchHighlight } from './search-highlight';

const meta = {
  title: 'Search/SearchHighlight',
  component: SearchHighlight,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**SearchHighlight** — подсветка совпадений в тексте.

## Особенности
- Подсветка нескольких слов
- Умное усечение текста
- Контекст вокруг совпадения

## Использование
\`\`\`tsx
<SearchHighlight
  text="Поиск по сайту"
  query="поиск"
  maxLength={150}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Текст для подсветки',
    },
    query: {
      control: 'text',
      description: 'Слова для подсветки',
    },
    maxLength: {
      control: 'number',
      description: 'Максимальная длина текста',
    },
  },
} satisfies Meta<typeof SearchHighlight>;

export default meta;
type Story = StoryObj<typeof SearchHighlight>;

// Базовая история
export const Default: Story = {
  args: {
    text: 'Специальная детско-юношеская школа олимпийского резерва «Олимпиец» приглашает детей и подростков на занятия спортом.',
    query: 'школа спорт',
    maxLength: 150,
  },
};

// Короткий текст
export const ShortText: Story = {
  args: {
    text: 'Футбольная секция для детей',
    query: 'футбол',
    maxLength: 150,
  },
};

// Длинный текст с усечением
export const LongText: Story = {
  args: {
    text: `
Специальная детско-юношеская школа олимпийского резерва «Олимпиец» 
города Витебска приглашает детей и подростков на занятия спортом. 
Наша школа работает с 1990 года и за это время подготовила множество 
талантливых спортсменов, которые успешно выступали на республиканских 
и международных соревнованиях.
    `.trim(),
    query: 'школа Витебск',
    maxLength: 200,
  },
};

// Несколько совпадений
export const MultipleMatches: Story = {
  args: {
    text: 'Тренер по футболу Иван Петров работает в футбольной секции уже 15 лет. Футбол — его призвание!',
    query: 'футбол тренер',
    maxLength: 150,
  },
};

// Без совпадений
export const NoMatches: Story = {
  args: {
    text: 'Секция плавания для всех возрастных групп',
    query: 'футбол',
    maxLength: 150,
  },
};

// Пустой запрос
export const EmptyQuery: Story = {
  args: {
    text: 'Текст без подсветки',
    query: '',
    maxLength: 150,
  },
};

// Пустой текст
export const EmptyText: Story = {
  args: {
    text: '',
    query: 'поиск',
    maxLength: 150,
  },
};

// С усечением
export const Truncated: Story = {
  args: {
    text: 'Очень длинный текст который будет усечен до определенной длины чтобы показать только важную часть с совпадениями',
    query: 'усечен',
    maxLength: 50,
  },
};

// Тёмная тема
export const Dark: Story = {
  args: {
    text: 'Подсветка совпадений в тёмной теме',
    query: 'подсветка',
    maxLength: 150,
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ background: '#000', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// Разные размеры шрифта
export const DifferentFontSizes: Story = {
  args: {
    text: 'Разные размеры шрифта для подсветки',
    query: 'размеры',
    maxLength: 150,
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '12px' }}><Story /></div>
        <div style={{ fontSize: '16px' }}><Story /></div>
        <div style={{ fontSize: '20px' }}><Story /></div>
      </div>
    ),
  ],
};
