import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './dialog';
import {Button, Input, Label} from "@/components/ui";


const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Модальное окно (диалог) — всплывающее окно для взаимодействия с пользователем.

## Особенности
- Основан на Radix UI Dialog
- Закрытие по ESC и клику вне области
- Доступность (focus trap, keyboard navigation)
- Анимации открытия/закрытия

## Использование
Используется для подтверждения действий, форм, подробной информации и т.д.
        `,
      },
    },
  },
  tags: ['autodocs'],
  subcomponents: {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Базовый диалог
export const Default: Story = {
  render: () => {
    const handleClick = (action: string) => () => {
      alert(`Нажата кнопка: ${action}`);
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Открыть диалог</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Заголовок диалога</DialogTitle>
            <DialogDescription>
              Описание диалога. Здесь может быть дополнительный текст.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Основное содержимое диалога.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button onClick={handleClick('OK')}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

// Диалог подтверждения
export const Confirmation: Story = {
  render: () => {
    const handleDelete = () => {
      alert('Элемент удалён!');
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Удалить</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

// Диалог с формой
export const WithForm: Story = {
  render: () => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Форма отправлена!');
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Записаться в секцию</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Запись в секцию</DialogTitle>
            <DialogDescription>
              Заполните форму для записи в спортивную секцию
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Имя фамилия</Label>
                <Input id="name" placeholder="Иванов Иван" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="example@mail.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" type="tel" placeholder="+375 (XX) XXX-XX-XX" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Отмена</Button>
              </DialogClose>
              <Button type="submit">Отправить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
};

// Диалог с информацией
export const InfoDialog: Story = {
  render: () => {
    const handleRegister = () => {
      alert('Переход к регистрации...');
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">ℹ️ О секции</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Футбольная секция</DialogTitle>
            <DialogDescription>
              Информация о секции футбола для детей 7-15 лет
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div>
              <h4 className="font-medium">Тренер</h4>
              <p className="text-sm text-muted-foreground">Петров П.П.</p>
            </div>
            <div>
              <h4 className="font-medium">Расписание</h4>
              <p className="text-sm text-muted-foreground">Пн, Ср, Пт 17:00-19:00</p>
            </div>
            <div>
              <h4 className="font-medium">Место проведения</h4>
              <p className="text-sm text-muted-foreground">Стадион &quot;Олимпиец&quot;, поле №2</p>
            </div>
            <div>
              <h4 className="font-medium">Возрастные группы</h4>
              <p className="text-sm text-muted-foreground">5-7, 8-10, 11-13, 14-17 лет</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Закрыть</Button>
            </DialogClose>
            <Button onClick={handleRegister}>Записаться</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

// Большой диалог с прокруткой
export const LargeDialog: Story = {
  render: () => {
    const handleAgree = () => {
      alert('Вы согласились с правилами!');
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Большой диалог</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Правила посещения секции</DialogTitle>
            <DialogDescription>
              Ознакомьтесь с правилами перед записью
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i}>
                <h4 className="font-medium">Правило {i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Закрыть</Button>
            </DialogClose>
            <Button onClick={handleAgree}>Я согласен</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

// Диалог без заголовка
export const NoHeader: Story = {
  render: () => {
    const handleOk = () => {
      alert('OK нажат!');
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Простой диалог</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="py-4 text-center">
            <p className="text-lg">Действие выполнено успешно!</p>
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button onClick={handleOk}>OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

// Диалог для доступности (увеличенный текст)
export const AccessibilityLarge: Story = {
  render: () => {
    const handleOk = () => {
      alert('OK нажат!');
    };

    const handleCancel = () => {
      alert('Отмена!');
    };

    return (
      <div className="text-accessibility-large">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-lg h-12">Открыть диалог (крупный)</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">Заголовок диалога</DialogTitle>
              <DialogDescription className="text-lg">
                Описание диалога с увеличенным текстом для доступности
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-lg">Основное содержимое диалога.</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="text-lg h-12" onClick={handleCancel}>Отмена</Button>
              </DialogClose>
              <Button className="text-lg h-12" onClick={handleOk}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};
