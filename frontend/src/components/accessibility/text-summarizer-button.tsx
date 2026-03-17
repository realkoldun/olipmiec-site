'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTextSummarizer } from '@/hooks/use-text-summarizer';
import { SummarizationOptions } from '@/types/text-summarization';
import { Wand2, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TextSummarizerButtonProps {
  className?: string;
  /** Текст для сокращения */
  text?: string;
  /** Настройки сокращения */
  options?: SummarizationOptions;
  /** Callback при получении результата */
  onResult?: (result: string) => void;
  /** Минимальная длина текста для показа кнопки */
  minLength?: number;
}

/**
 * TextSummarizerButton — кнопка для сокращения текста с помощью AI
 * 
 * Особенности:
 * - Маленькая круглая кнопка
 * - Появляется только если текст длиннее minLength
 * - В процессе сокращения текст "переливается" (скелетон)
 * - Подсказка при наведении
 * 
 * @example
 * ```tsx
 * <TextSummarizerButton text="Длинный текст..." onResult={(summarized) => setText(summarized)} />
 * ```
 */
export function TextSummarizerButton({
  className,
  text = '',
  options,
  onResult,
  minLength = 500,
}: TextSummarizerButtonProps) {
  const {
    status,
    result,
    error,
    isSummarizing,
    isAvailable,
    summarize,
    reset,
  } = useTextSummarizer();

  const [showTooltip, setShowTooltip] = useState(false);

  // Показывать кнопку только если текст достаточно длинный
  const shouldShow = text.length >= minLength && isAvailable;

  // Обработчик клика
  const handleClick = useCallback(() => {
    if (!text || isSummarizing) return;
    
    if (result) {
      // Если результат уже есть, применяем его
      onResult?.(result.summarizedText);
      reset();
    } else {
      // Иначе запускаем сокращение
      summarize(text, options);
    }
  }, [text, isSummarizing, result, options, onResult, reset, summarize]);

  // Если текст слишком короткий или сервис недоступен
  if (!shouldShow) {
    return null;
  }

  const isCompleted = status === 'success' && result;

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Кнопка */}
      <button
        onClick={handleClick}
        disabled={isSummarizing}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'inline-flex items-center justify-center',
          'h-8 w-8 rounded-full',
          'border border-primary/30',
          'bg-background hover:bg-accent',
          'text-primary',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isSummarizing && 'animate-pulse cursor-wait'
        )}
        aria-label={isCompleted ? 'Текст сокращён' : 'Сократить текст'}
        title={isCompleted ? 'Текст сокращён' : 'Сократить текст с помощью AI'}
      >
        {isSummarizing ? (
          <Wand2 className="h-4 w-4 animate-spin" />
        ) : isCompleted ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
      </button>

      {/* Подсказка */}
      {showTooltip && !isSummarizing && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded-md',
            'whitespace-nowrap animate-in fade-in duration-200',
            'top-full right-0 mt-1'
          )}
          role="tooltip"
        >
          Сократите текст
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-white bg-red-600 rounded-md',
            'whitespace-nowrap animate-in fade-in duration-200',
            'top-full right-0 mt-1'
          )}
        >
          Ошибка: {error.message}
        </div>
      )}
    </div>
  );
}

/**
 * TextWithSummarizer — обёртка для текста с кнопкой сокращения
 * Показывает текст с эффектом "переливания" во время сокращения
 */
export interface TextWithSummarizerProps {
  className?: string;
  /** Исходный текст */
  text: string;
  /** Сокращённый текст */
  summarizedText?: string | null;
  /** Настройки сокращения */
  options?: SummarizationOptions;
  /** Callback при получении результата */
  onResult?: (result: string) => void;
  /** Минимальная длина текста для показа кнопки */
  minLength?: number;
  /** Показывать исходный текст после сокращения */
  showOriginalAfterSummarize?: boolean;
}

export function TextWithSummarizer({
  className,
  text,
  summarizedText: summarizedTextProp,
  options,
  onResult,
  minLength = 500,
  showOriginalAfterSummarize = false,
}: TextWithSummarizerProps) {
  const {
    result,
    isSummarizing,
    isAvailable,
    summarize,
    reset,
  } = useTextSummarizer();

  const [showTooltip, setShowTooltip] = useState(false);
  const [isSummarized, setIsSummarized] = useState(false);

  // Используем результат из хука или из пропсов
  const summarizedText = result?.summarizedText || summarizedTextProp;

  // Определяем какой текст показывать
  const displayText = isSummarized && summarizedText ? summarizedText : text;
  const shouldShow = text.length >= minLength && isAvailable && !isSummarized;

  // Обработчик клика
  const handleClick = useCallback(() => {
    if (!text || isSummarizing) return;

    if (result) {
      // Если результат уже есть, применяем его
      onResult?.(result.summarizedText);
      setIsSummarized(true);
      reset();
    } else {
      // Иначе запускаем сокращение
      summarize(text, options);
    }
  }, [text, isSummarizing, result, options, onResult, reset, summarize]);

  // Эффект для автоматического обновления при получении результата
  useEffect(() => {
    if (result && !isSummarized) {
      onResult?.(result.summarizedText);
      setIsSummarized(true);
    }
  }, [result, isSummarized, onResult]);

  // Обработчик показа оригинала
  const handleShowOriginal = useCallback(() => {
    setIsSummarized(false);
    reset();
  }, [reset]);

  // Показывать кнопку только если текст достаточно длинный
  if (!shouldShow && !isSummarizing) {
    return (
      <div className={cn('relative', className)}>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Кнопка сокращения */}
      {shouldShow && (
        <div className="absolute top-0 right-0 z-10">
          <button
            onClick={handleClick}
            disabled={isSummarizing}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={cn(
              'inline-flex items-center justify-center',
              'h-8 w-8 rounded-full',
              'border border-primary/30',
              'bg-background hover:bg-accent',
              'text-primary',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isSummarizing && 'animate-pulse cursor-wait'
            )}
            aria-label="Сократить текст"
            title="Сократить текст с помощью AI"
          >
            {isSummarizing ? (
              <Wand2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </button>

          {/* Подсказка */}
          {showTooltip && (
            <div
              className={cn(
                'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded-md',
                'whitespace-nowrap animate-in fade-in duration-200',
                'top-full right-0 mt-1'
              )}
              role="tooltip"
            >
              Сократите текст
            </div>
          )}
        </div>
      )}

      {/* Текст с эффектом скелетона */}
      <div
        className={cn(
          'whitespace-pre-wrap transition-all duration-300',
          isSummarizing && 'animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer'
        )}
      >
        {displayText}
      </div>

      {/* Кнопка показа оригинала после сокращения */}
      {isSummarized && showOriginalAfterSummarize && (
        <button
          onClick={handleShowOriginal}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Показать оригинал
        </button>
      )}
    </div>
  );
}
