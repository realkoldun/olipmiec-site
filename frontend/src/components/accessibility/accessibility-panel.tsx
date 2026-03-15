'use client';

import { useState, useEffect } from 'react';
import { X, Monitor } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button/button';
import { TextResizer } from './text-resizer';
import { ContrastToggle } from './contrast-toggle';
import { useAccessibilityStore } from '@/stores/accessibility-store';

export interface AccessibilityPanelProps {
  className?: string;
  /** Показывать плавающую кнопку (для Storybook) */
  showFloatingButton?: boolean;
}

/**
 * AccessibilityPanel — панель настроек доступности
 */
export function AccessibilityPanel({ 
  className,
  showFloatingButton = false,
}: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Обработчик открытия панели из Header
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    
    window.addEventListener('open-accessibility-panel', handleOpen);
    window.addEventListener('close-accessibility-panel', handleClose);
    
    return () => {
      window.removeEventListener('open-accessibility-panel', handleOpen);
      window.removeEventListener('close-accessibility-panel', handleClose);
    };
  }, []);

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Сброс всех настроек
  const { reset } = useAccessibilityStore();
  const handleResetAll = () => {
    reset();
  };

  return (
    <>
      {/* Плавающая кнопка (только для Storybook) */}
      {showFloatingButton && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'fixed bottom-4 right-4 z-50',
            'inline-flex items-center justify-center',
            'h-14 w-14 rounded-full',
            'bg-primary text-primary-foreground',
            'shadow-lg hover:bg-primary/90 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Настройки доступности"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Monitor className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Панель настроек */}
      {isOpen && (
        <>
          {/* Затемнение фона */}
          <div
            className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Панель */}
          <div
            className={cn(
              'fixed top-16 right-4 z-[70]',
              'w-[calc(100vw-2rem)] max-w-sm',
              'rounded-lg border bg-background shadow-lg',
              'animate-in fade-in slide-in-from-top-4 duration-300',
              'max-h-[calc(100vh-8rem)] overflow-y-auto',
              className
            )}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Доступность</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Контент */}
            <div className="flex flex-col gap-4 p-4">
              {/* Размер текста */}
              <TextResizer />

              {/* Контраст */}
              <ContrastToggle />

              {/* Сброс настроек */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleResetAll}
              >
                Сбросить все настройки
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
