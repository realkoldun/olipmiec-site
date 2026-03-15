import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FileText, Users, Trophy, Settings, Calendar } from 'lucide-react';
import { Sidebar } from './sidebar';

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Sidebar** — боковая панель навигации с поддержкой вложенных меню.

## Особенности
- Иконки для пунктов меню
- Поддержка вложенных меню (аккордеон)
- Активное состояние для текущей страницы
- Бейджи для количества элементов
- Сворачиваемые секции
- Адаптивная ширина

## Использование
Используется в админ-панелях, личных кабинетах, каталогах:
- Навигация по разделам сайта
- Фильтры в каталоге
- Меню пользователя
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    collapsible: {
      control: 'boolean',
      description: 'Сворачиваемые секции',
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Пример данных для меню
const sampleItems = [
  {
    label: 'Новости',
    href: '/news',
    icon: <FileText className="h-5 w-5" />,
    badge: 5,
  },
  {
    label: 'Секции',
    href: '/sections',
    icon: <Users className="h-5 w-5" />,
    children: [
      { label: 'Футбол', href: '/sections/football', badge: 3 },
      { label: 'Баскетбол', href: '/sections/basketball' },
      { label: 'Волейбол', href: '/sections/volleyball' },
      { label: 'Плавание', href: '/sections/swimming' },
    ],
  },
  {
    label: 'Тренеры',
    href: '/trainers',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Почётная доска',
    href: '/honor-board',
    icon: <Trophy className="h-5 w-5" />,
    badge: 12,
  },
  {
    label: 'Документы',
    href: '/documents',
    icon: <FileText className="h-5 w-5" />,
    children: [
      { label: 'Положения', href: '/documents/regulations' },
      { label: 'Приказы', href: '/documents/orders' },
      { label: 'Отчёты', href: '/documents/reports' },
    ],
  },
  {
    label: 'Расписание',
    href: '/schedule',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    label: 'Настройки',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

// Стандартный Sidebar
export const Default: Story = {
  args: {
    items: sampleItems,
    title: 'Навигация',
    collapsible: true,
  },
};

// Sidebar без заголовка
export const WithoutTitle: Story = {
  args: {
    items: sampleItems,
    collapsible: true,
  },
};

// Sidebar без сворачивания
export const NotCollapsible: Story = {
  args: {
    items: sampleItems,
    title: 'Навигация',
    collapsible: false,
  },
};

// Sidebar только с основными пунктами
export const Minimal: Story = {
  args: {
    items: sampleItems.slice(0, 5),
    title: 'Меню',
    collapsible: true,
  },
};

// С тёмной темой
export const DarkTheme: Story = {
  args: {
    items: sampleItems,
    title: 'Навигация',
    collapsible: true,
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

// Для мобильных
export const Mobile: Story = {
  args: {
    items: sampleItems,
    title: 'Навигация',
    collapsible: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
