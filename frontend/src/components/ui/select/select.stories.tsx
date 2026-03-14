import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';
import { Label } from './label';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Выпадающий список для выбора одного значения из нескольких вариантов.

## Особенности
- Основан на Radix UI Select
- Поддержка группировки элементов
- Доступность (keyboard navigation, screen readers)
- Кастомизируемый внешний вид

## Использование
Используется в формах для выбора категорий, секций, тренеров и т.д.
        `,
      },
    },
  },
  tags: ['autodocs'],
  subcomponents: {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Базовый Select
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Выберите секцию" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Секции</SelectLabel>
          <SelectItem value="football">Футбол</SelectItem>
          <SelectItem value="basketball">Баскетбол</SelectItem>
          <SelectItem value="volleyball">Волейбол</SelectItem>
          <SelectItem value="swimming">Плавание</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// Select с Label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="section-select">Секция</Label>
      <Select>
        <SelectTrigger id="section-select" className="w-full">
          <SelectValue placeholder="Выберите секцию" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Спортивные секции</SelectLabel>
            <SelectItem value="football">Футбол</SelectItem>
            <SelectItem value="basketball">Баскетбол</SelectItem>
            <SelectItem value="volleyball">Волейбол</SelectItem>
            <SelectItem value="swimming">Плавание</SelectItem>
            <SelectItem value="tennis">Большой теннис</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select с группами
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Выберите возрастную группу" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Возрастные группы</SelectLabel>
          <SelectItem value="5-7">5-7 лет (младшая)</SelectItem>
          <SelectItem value="8-10">8-10 лет (средняя)</SelectItem>
          <SelectItem value="11-13">11-13 лет (старшая)</SelectItem>
          <SelectItem value="14-17">14-17 лет (юниоры)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// Select с описанием
export const WithDescription: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="trainer-select">Тренер</Label>
      <Select>
        <SelectTrigger id="trainer-select" className="w-full">
          <SelectValue placeholder="Выберите тренера" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="petrov">Петров П.П. (Футбол)</SelectItem>
            <SelectItem value="ivanov">Иванов И.И. (Баскетбол)</SelectItem>
            <SelectItem value="sidorov">Сидоров С.С. (Волейбол)</SelectItem>
            <SelectItem value="kozlova">Козлова А.А. (Плавание)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Тренер будет назначен после записи
      </p>
    </div>
  ),
};

// Отключённый Select
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Недоступно" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option">Опция</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// Select с большим количеством опций
export const ManyOptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Выберите вид спорта" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Игровые виды</SelectLabel>
          <SelectItem value="football">Футбол</SelectItem>
          <SelectItem value="basketball">Баскетбол</SelectItem>
          <SelectItem value="volleyball">Волейбол</SelectItem>
          <SelectItem value="handball">Гандбол</SelectItem>
          <SelectItem value="tennis">Большой теннис</SelectItem>
          <SelectItem value="badminton">Бадминтон</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Водные виды</SelectLabel>
          <SelectItem value="swimming">Плавание</SelectItem>
          <SelectItem value="waterpolo">Водное поло</SelectItem>
          <SelectItem value="diving">Прыжки в воду</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Единоборства</SelectLabel>
          <SelectItem value="judo">Дзюдо</SelectItem>
          <SelectItem value="karate">Карате</SelectItem>
          <SelectItem value="boxing">Бокс</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// Select для формы записи
export const RegistrationForm: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="section">Секция</Label>
        <Select>
          <SelectTrigger id="section">
            <SelectValue placeholder="Выберите секцию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="football">Футбол</SelectItem>
            <SelectItem value="basketball">Баскетбол</SelectItem>
            <SelectItem value="swimming">Плавание</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="age">Возрастная группа</Label>
        <Select>
          <SelectTrigger id="age">
            <SelectValue placeholder="Выберите возраст" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5-7">5-7 лет</SelectItem>
            <SelectItem value="8-10">8-10 лет</SelectItem>
            <SelectItem value="11-13">11-13 лет</SelectItem>
            <SelectItem value="14-17">14-17 лет</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

// Select с доступностью (увеличенный размер)
export const AccessibilityLarge: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5 text-accessibility-large">
      <Label htmlFor="large-select">Секция (увеличенный)</Label>
      <Select>
        <SelectTrigger id="large-select" className="w-full h-12 text-lg">
          <SelectValue placeholder="Выберите секцию" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="football" className="text-lg">Футбол</SelectItem>
          <SelectItem value="basketball" className="text-lg">Баскетбол</SelectItem>
          <SelectItem value="swimming" className="text-lg">Плавание</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
