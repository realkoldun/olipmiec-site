import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
import {Button} from "@/components/ui";

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Карточка — контейнер для группировки связанной информации.

## Составные части
- CardHeader — заголовок карточки
- CardTitle — заголовок содержимого
- CardDescription — описание
- CardContent — основное содержимое
- CardFooter — подвал с действиями

## Использование
Карточки используются для отображения новостей, секций, тренеров и другой контента.
        `,
      },
    },
  },
  tags: ['autodocs'],
  subcomponents: {
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Базовая карточка
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Название карточки</CardTitle>
        <CardDescription>Краткое описание содержимого</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Основное содержимое карточки. Здесь может быть текст, изображения или другие компоненты.</p>
      </CardContent>
      <CardFooter>
        <Button>Действие</Button>
      </CardFooter>
    </Card>
  ),
};

// Карточка только с контентом
export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Простая карточка без заголовка и подвала.</p>
      </CardContent>
    </Card>
  ),
};

// Карточка с несколькими действиями
export const WithActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Запись в секцию</CardTitle>
        <CardDescription>Футбольная секция, возраст 7-15 лет</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Тренер: Иванов И.И.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Занятия: Пн, Ср, Пт 17:00-19:00
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Подробнее</Button>
        <Button>Записаться</Button>
      </CardFooter>
    </Card>
  ),
};

// Карточка новости
export const NewsCard: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Победа на областных соревнованиях</CardTitle>
        <CardDescription>15 января 2025 • Автор: Иванов И.И.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Наши воспитанники заняли первое место в областных соревнованиях по футболу.
          Поздравляем команду и тренера!
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Читать далее →</Button>
      </CardFooter>
    </Card>
  ),
};

// Карточка тренера
export const TrainerCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl">
            👤
          </div>
          <div>
            <CardTitle className="text-xl">Петров П.П.</CardTitle>
            <CardDescription>Футбол</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          <span className="font-medium">Опыт:</span> 15 лет
        </p>
        <p className="text-sm">
          <span className="font-medium">Категория:</span> Высшая
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Показать профиль</Button>
      </CardFooter>
    </Card>
  ),
};

// Карточка с высоким контрастом (доступность)
export const HighContrast: Story = {
  render: () => (
    <div className="high-contrast p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Режим высокого контраста</CardTitle>
          <CardDescription>Для слабовидящих пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Эта карточка отображается в режиме высокой контрастности.</p>
        </CardContent>
        <CardFooter>
          <Button variant="primary">OK</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
