'use client';

import { useState } from 'react';
import { Accessibility, X, Plus, Minus, Monitor } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button/button';

export interface AccessibilityPanelProps {
  className?: string;
}

/**
 * AccessibilityPanel — плавающая панель настроек доступности
 */
export function AccessibilityPanel({ className }: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Плавающая кнопка */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 right-4 z-50',
          'inline-flex items-center justify-center',
          'h-14 w-14 rounded-full',
          'bg-primary text-primary-foreground',
          'shadow-lg hover:bg-primary/90 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label="Настройки доступности"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Accessibility className="h-6 w-6" />
        )}
      </button>

      {/* Панель настроек */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-20 right-4 z-50',
            'w-80 rounded-lg border bg-background shadow-lg',
            'animate-in fade-in slide-in-from-bottom-4 duration-300'
          )}
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Доступность</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Контент */}
          <div className="flex flex-col gap-4 p-4">
            {/* Размер текста */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Размер текста</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Уменьшить"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center text-sm">Нормальный</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Увеличить"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Контраст */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Контраст</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Обычный
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Высокий
                </Button>
              </div>
            </div>

            {/* Сброс настроек */}
            <Button variant="outline" size="sm" className="w-full">
              Сбросить настройки
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
