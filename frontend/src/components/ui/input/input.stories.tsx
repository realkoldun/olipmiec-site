import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './input';
import {Label} from "@/components/ui";

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Поле ввода текста — базовый компонент для ввода пользователем текстовой информации.

## Особенности
- Поддержка всех стандартных HTML-атрибутов
- Состояния: focus, disabled, error
- Доступность (Aria-атрибуты, label)
- Различные типы: text, email, password, search, tel, url и др.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date', 'time'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Базовый input
export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Введите текст...',
  },
};

// Input с label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="example@mail.com" />
    </div>
  ),
};

// Input с описанием
export const WithDescription: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username">Имя пользователя</Label>
      <Input type="text" id="username" placeholder="@username" />
      <p className="text-sm text-muted-foreground">
        Только буквы, цифры и символ подчёркивания
      </p>
    </div>
  ),
};

// Отключённый input
export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Недоступно',
    disabled: true,
  },
};

// Input с ошибкой
export const Error: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error">Email</Label>
      <Input
        type="email"
        id="email-error"
        placeholder="example@mail.com"
        className="border-destructive focus-visible:ring-destructive"
        defaultValue="invalid-email"
      />
      <p className="text-sm text-destructive">Некорректный email адрес</p>
    </div>
  ),
};

// Password input
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Введите пароль',
  },
};

// Search input
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Поиск...',
  },
};

// Number input
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
    min: 0,
    max: 100,
  },
};

// Date input
export const Date: Story = {
  args: {
    type: 'date',
  },
};

// Input с префиксом/суффиксом (пример)
export const WithAddon: Story = {
  render: () => (
    <div className="flex w-full max-w-sm items-center gap-2">
      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 flex-1">
        <span className="text-muted-foreground">📧</span>
        <Input
          type="email"
          placeholder="Email"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  ),
};

// Форма с несколькими input
export const Form: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Имя</Label>
        <Input type="text" id="name" placeholder="Иван" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="surname">Фамилия</Label>
        <Input type="text" id="surname" placeholder="Иванов" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="phone">Телефон</Label>
        <Input type="tel" id="phone" placeholder="+375 (XX) XXX-XX-XX" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="birth">Дата рождения</Label>
        <Input type="date" id="birth" />
      </div>
    </div>
  ),
};

// Input для доступности (увеличенный размер)
export const AccessibilityLarge: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5 text-accessibility-large">
      <Label htmlFor="large-input">Email (увеличенный)</Label>
      <Input
        type="email"
        id="large-input"
        placeholder="example@mail.com"
        className="text-lg h-12"
      />
    </div>
  ),
};
