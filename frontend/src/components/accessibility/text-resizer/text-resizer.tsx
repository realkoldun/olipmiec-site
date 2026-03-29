'use client';

import { useEffect, useState } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility-store';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button/button';

export interface TextResizerProps {
  className?: string;
}

/**
 * TextResizer — компонент изменения размера текста
 */
export function TextResizer({ className }: TextResizerProps) {
  const { fontSize, setFontSize } = useAccessibilityStore();
  const [isMounted, setIsMounted] = useState(false);

  // Применение размера шрифта при изменении - только после монтирования
  useEffect(() => {
    if (!isMounted) return;

    // Используем CSS переменную вместо прямого стиля
    document.documentElement.style.setProperty('--user-font-size', `${fontSize}px`);
  }, [fontSize, isMounted]);

  // Помечаем как смонтированный
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Уменьшение размера
  const handleDecrease = () => {
    setFontSize(Math.max(12, fontSize - 2));
  };

  // Увеличение размера
  const handleIncrease = () => {
    setFontSize(Math.min(24, fontSize + 2));
  };

  // Сброс к значению по умолчанию
  const handleReset = () => {
    setFontSize(14);
  };

  // Получение текстовой метки
  const getLabel = () => {
    if (fontSize < 14) return 'Маленький';
    if (fontSize > 18) return 'Большой';
    return 'Нормальный';
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Размер текста</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-2 text-xs"
          aria-label="Сбросить размер текста"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Сброс
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={handleDecrease}
          disabled={fontSize <= 12}
          aria-label="Уменьшить размер текста"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="text-sm font-medium">{getLabel()}</div>
          <div className="text-xs text-muted-foreground">{fontSize}px</div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={handleIncrease}
          disabled={fontSize >= 24}
          aria-label="Увеличить размер текста"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Визуальная шкала */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-200"
          style={{
            width: `${((fontSize - 12) / (24 - 12)) * 100}%`,
          }}
        />
      </div>

      {/* Пример текста */}
      <div
        className="p-3 border rounded-md bg-muted/50"
        style={{ fontSize: `${fontSize}px` }}
      >
        <p className="line-clamp-2">
          Пример текста для просмотра размера шрифта
        </p>
      </div>
    </div>
  );
}
