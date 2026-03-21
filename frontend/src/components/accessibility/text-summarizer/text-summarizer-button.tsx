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
      onResult?.(result.summarizedText);
      reset();
    } else {
      summarize(text, options);
    }
  }, [text, isSummarizing, result, options, onResult, reset, summarize]);

  // Обработчики для подсказки
  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  // Если текст слишком короткий или сервис недоступен
  if (!shouldShow) {
    return null;
  }

  const isCompleted = status === 'success' && !!result;

  return (
    <div className={cn('relative inline-block', className)}>
      <SummarizeButtonContent
        isSummarizing={isSummarizing}
        isCompleted={isCompleted}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Tooltip
        show={showTooltip && !isSummarizing}
        text="Сократите текст"
      />

      <ErrorNotification error={error} />
    </div>
  );
}

// ============================================================================
// Внутренние компоненты TextSummarizerButton
// ============================================================================

interface SummarizeButtonContentProps {
  isSummarizing: boolean;
  isCompleted: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function SummarizeButtonContent({
  isSummarizing,
  isCompleted,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SummarizeButtonContentProps) {
  const buttonLabel = isCompleted ? 'Текст сокращён' : 'Сократить текст';
  const buttonTitle = isCompleted
    ? 'Текст сокращён'
    : 'Сократить текст с помощью AI';

  const buttonClasses = cn(
    'inline-flex items-center justify-center',
    'h-8 w-8 rounded-full',
    'border border-primary/30',
    'bg-background hover:bg-accent',
    'text-primary',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isSummarizing && 'animate-pulse cursor-wait'
  );

  return (
    <button
      onClick={onClick}
      disabled={isSummarizing}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={buttonClasses}
      aria-label={buttonLabel}
      title={buttonTitle}
    >
      <ButtonIcon isSummarizing={isSummarizing} isCompleted={isCompleted} />
    </button>
  );
}

interface ButtonIconProps {
  isSummarizing: boolean;
  isCompleted: boolean;
}

function ButtonIcon({ isSummarizing, isCompleted }: ButtonIconProps) {
  if (isSummarizing) {
    return <Wand2 className="h-4 w-4 animate-spin" />;
  }

  if (isCompleted) {
    return <Check className="h-4 w-4 text-green-600" />;
  }

  return <Wand2 className="h-4 w-4" />;
}

interface TooltipProps {
  show: boolean;
  text: string;
}

function Tooltip({ show, text }: TooltipProps) {
  if (!show) return null;

  const tooltipClasses = cn(
    'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded-md',
    'whitespace-nowrap animate-in fade-in duration-200',
    'top-full right-0 mt-1'
  );

  return (
    <div className={tooltipClasses} role="tooltip">
      {text}
    </div>
  );
}

interface ErrorNotificationProps {
  error: { message: string } | null;
}

function ErrorNotification({ error }: ErrorNotificationProps) {
  if (!error) return null;

  const errorClasses = cn(
    'absolute z-50 px-2 py-1 text-xs text-white bg-red-600 rounded-md',
    'whitespace-nowrap animate-in fade-in duration-200',
    'top-full right-0 mt-1'
  );

  return (
    <div className={errorClasses}>
      Ошибка: {error.message}
    </div>
  );
}

// ============================================================================
// TextWithSummarizer
// ============================================================================

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

  // Показываем кнопку, если текст длинный и сервис доступен
  const shouldShow = text.length >= minLength && isAvailable;

  // Обработчики
  const handleClick = useCallback(() => {
    if (!text || isSummarizing) return;

    if (result?.summarizedText) {
      onResult?.(result.summarizedText);
      setIsSummarized(true);
    } else {
      setIsSummarized(false);
      summarize(text, options);
    }
  }, [text, isSummarizing, result, options, onResult, summarize]);

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const handleShowOriginal = useCallback(() => {
    setIsSummarized(false);
    reset();
  }, [reset]);

  const handleResetResult = useCallback(() => {
    setIsSummarized(false);
    reset();
  }, [reset]);

  // Обновление состояния при получении результата
  useEffect(() => {
    if (result?.summarizedText && !isSummarized) {
      onResult?.(result.summarizedText);
      setIsSummarized(true);
    }
  }, [result, isSummarized, onResult]);

  // Если текст короткий или сервис недоступен
  if (!shouldShow && !isSummarizing) {
    return (
      <div className={cn('relative', className)}>
        <p className="whitespace-pre-wrap">{displayText}</p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <SummarizerControl
        shouldShow={shouldShow}
        isSummarizing={isSummarizing}
        showTooltip={showTooltip}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <SummarizerText
        displayText={displayText}
        isSummarizing={isSummarizing}
      />

      <SummarizerActions
        isSummarized={isSummarized}
        showOriginalAfterSummarize={showOriginalAfterSummarize}
        onShowOriginal={handleShowOriginal}
        onResetResult={handleResetResult}
      />
    </div>
  );
}

// ============================================================================
// Внутренние компоненты TextWithSummarizer
// ============================================================================

interface SummarizerControlProps {
  shouldShow: boolean;
  isSummarizing: boolean;
  showTooltip: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function SummarizerControl({
  shouldShow,
  isSummarizing,
  showTooltip,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SummarizerControlProps) {
  if (!shouldShow) return null;

  return (
    <div className="absolute top-0 right-0 z-10">
      <button
        onClick={onClick}
        disabled={isSummarizing}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={getButtonClasses(isSummarizing)}
        aria-label="Сократить текст"
        title="Сократить текст с помощью AI"
      >
        {isSummarizing ? (
          <Wand2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
      </button>

      {showTooltip && (
        <Tooltip show={showTooltip} text="Сократите текст" />
      )}
    </div>
  );
}

interface SummarizerTextProps {
  displayText: string;
  isSummarizing: boolean;
}

function SummarizerText({ displayText, isSummarizing }: SummarizerTextProps) {
  const textClasses = cn(
    'whitespace-pre-wrap transition-all duration-300',
    isSummarizing && 'animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer'
  );

  return (
    <div className={textClasses}>
      {displayText}
    </div>
  );
}

interface SummarizerActionsProps {
  isSummarized: boolean;
  showOriginalAfterSummarize: boolean;
  onShowOriginal: () => void;
  onResetResult: () => void;
}

function SummarizerActions({
  isSummarized,
  showOriginalAfterSummarize,
  onShowOriginal,
  onResetResult,
}: SummarizerActionsProps) {
  if (!isSummarized) return null;

  return (
    <>
      {showOriginalAfterSummarize && (
        <button
          onClick={onShowOriginal}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Показать оригинал
        </button>
      )}

      <button
        onClick={onResetResult}
        className="mt-2 text-xs text-primary hover:underline transition-colors"
      >
        Сбросить результат
      </button>
    </>
  );
}

/**
 * Стили для кнопки сокращения
 */
function getButtonClasses(isSummarizing: boolean): string {
  return cn(
    'inline-flex items-center justify-center',
    'h-8 w-8 rounded-full',
    'border border-primary/30',
    'bg-background hover:bg-accent',
    'text-primary',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isSummarizing && 'animate-pulse cursor-wait'
  );
}
