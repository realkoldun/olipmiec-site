'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility-store';
import { Monitor, Sun, Moon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ContrastToggleProps {
  className?: string;
}

/**
 * ContrastToggle — переключатель режимов контраста
 */
export function ContrastToggle({ className }: ContrastToggleProps) {
  const { contrast, setContrast } = useAccessibilityStore();

  // Режимы контраста
  const modes = [
    {
      value: 'normal',
      label: 'Обычный',
      icon: Sun,
      description: 'Стандартные цвета',
      preview: {
        bg: 'bg-white dark:bg-slate-900',
        text: 'text-slate-900 dark:text-white',
        border: 'border-slate-200 dark:border-slate-700',
      },
    },
    {
      value: 'high',
      label: 'Высокий',
      icon: Monitor,
      description: 'Увеличенный контраст',
      preview: {
        bg: 'bg-white dark:bg-black',
        text: 'text-black dark:text-white',
        border: 'border-black dark:border-white',
      },
    },
    {
      value: 'dark',
      label: 'Тёмный',
      icon: Moon,
      description: 'Тёмная тема',
      preview: {
        bg: 'bg-slate-900',
        text: 'text-white',
        border: 'border-slate-700',
      },
    },
  ];

  // Применение контраста при изменении
  useEffect(() => {
    const body = document.body;
    body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    body.classList.add(`contrast-${contrast}`);
  }, [contrast]);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <Monitor className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Контраст</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = contrast === mode.value;

          return (
            <button
              key={mode.value}
              onClick={() => setContrast(mode.value as 'normal' | 'high' | 'dark')}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                isActive
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-muted-foreground/50'
              )}
              aria-pressed={isActive}
              aria-label={mode.description}
              title={mode.description}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Описание текущего режима */}
      <div className="p-3 rounded-md bg-muted/50 border">
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Текущий режим:
          </span>
          <span className="text-xs">
            {modes.find((m) => m.value === contrast)?.description}
          </span>
        </div>
      </div>
    </div>
  );
}
