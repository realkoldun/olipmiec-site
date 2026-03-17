'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  SummarizationResult,
  SummarizationOptions,
  SummarizationStatus,
  SummarizationError,
  CacheEntry,
} from '@/types/text-summarization';
import { ollamaService } from '@/services/ollama.service';

/**
 * Результат работы хука
 */
export interface UseTextSummarizerResult {
  /** Статус выполнения */
  status: SummarizationStatus;
  /** Результат сокращения */
  result: SummarizationResult | null;
  /** Ошибка */
  error: SummarizationError | null;
  /** Прогресс (0-100) */
  progress: number;
  /** Выполняется ли сокращение */
  isSummarizing: boolean;
  /** Доступен ли сервис */
  isAvailable: boolean;
  /** Начать сокращение текста */
  summarize: (text: string, options?: SummarizationOptions) => Promise<void>;
  /** Отменить текущий запрос */
  cancel: () => void;
  /** Очистить кэш */
  clearCache: () => void;
  /** Очистить результат */
  reset: () => void;
}

/**
 * Конфигурация кеширования
 */
interface CacheConfig {
  /** Время жизни кэша (мс) */
  ttl: number;
  /** Максимальное количество записей в кэше */
  maxSize: number;
  /** Ключ для localStorage */
  storageKey: string;
}

/**
 * Простая хэш-функция
 */
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 минут
  maxSize: 50,
  storageKey: 'text-summarizer-cache',
};

/**
 * Хук для сокращения текста с кешированием
 * 
 * @example
 * ```tsx
 * const { summarize, result, isSummarizing } = useTextSummarizer();
 * 
 * <button onClick={() => summarize(text)}>
 *   {isSummarizing ? 'Сокращаем...' : 'Сократить текст'}
 * </button>
 * ```
 */
export function useTextSummarizer(
  cacheConfig?: Partial<CacheConfig>
): UseTextSummarizerResult {
  const config = { ...DEFAULT_CACHE_CONFIG, ...cacheConfig };
  
  const [status, setStatus] = useState<SummarizationStatus>('idle');
  const [result, setResult] = useState<SummarizationResult | null>(null);
  const [error, setError] = useState<SummarizationError | null>(null);
  const [progress, setProgress] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Загрузка кэша из localStorage при монтировании
  useEffect(() => {
    try {
      const cached = localStorage.getItem(config.storageKey);
      if (cached) {
        const parsed = JSON.parse(cached) as CacheEntry[];
        const now = Date.now();
        
        // Восстанавливаем только валидные записи
        parsed.forEach((entry) => {
          if (now - entry.createdAt < entry.ttl) {
            cacheRef.current.set(entry.textHash, entry);
          }
        });
      }
    } catch {
      // Игнорируем ошибки кэша
    }
  }, [config.storageKey]);

  // Сохранение кэша в localStorage
  const saveCache = useCallback(() => {
    try {
      const entries = Array.from(cacheRef.current.values());
      localStorage.setItem(config.storageKey, JSON.stringify(entries));
    } catch {
      // Игнорируем ошибки сохранения
    }
  }, [config.storageKey]);

  // Проверка доступности сервиса
  useEffect(() => {
    ollamaService.isAvailable().then(setIsAvailable);
  }, []);

  // Получение из кэша
  const getFromCache = useCallback(
    (text: string, options?: SummarizationOptions): SummarizationResult | null => {
      const hash = hashCode(text + JSON.stringify(options));
      const entry = cacheRef.current.get(hash);

      if (!entry) return null;

      const now = Date.now();
      if (now - entry.createdAt > entry.ttl) {
        cacheRef.current.delete(hash);
        return null;
      }

      return entry.result;
    },
    []
  );

  // Сохранение в кэш
  const saveToCache = useCallback(
    (text: string, result: SummarizationResult, options?: SummarizationOptions) => {
      const hash = hashCode(text + JSON.stringify(options));
      const entry: CacheEntry = {
        textHash: hash,
        result,
        createdAt: Date.now(),
        ttl: config.ttl,
      };

      // Удаляем старые записи если достигнут лимит
      if (cacheRef.current.size >= config.maxSize) {
        const oldestKey = Array.from(cacheRef.current.entries()).reduce(
          (min, [key, value]) =>
            value.createdAt < cacheRef.current.get(min)!.createdAt ? key : min,
          Array.from(cacheRef.current.keys())[0]
        );
        cacheRef.current.delete(oldestKey);
      }

      cacheRef.current.set(hash, entry);
      saveCache();
    },
    [config.maxSize, config.ttl, saveCache]
  );

  // Запуск прогресс-бара
  const startProgress = useCallback(() => {
    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Останавливаемся на 90% до получения ответа
        return prev + Math.random() * 10;
      });
    }, 500);
  }, []);

  // Остановка прогресс-бара
  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Сокращение текста
  const summarize = useCallback(
    async (text: string, options?: SummarizationOptions) => {
      if (!text.trim()) {
        setError({ type: 'unknown', message: 'Пустой текст' });
        return;
      }

      // Проверяем кэш
      const cachedResult = getFromCache(text, options);
      if (cachedResult) {
        setResult(cachedResult);
        setStatus('success');
        return;
      }

      setStatus('loading');
      setError(null);
      startProgress();

      try {
        const summarizationResult = await ollamaService.summarize(text, options);
        
        stopProgress();
        setProgress(100);
        setResult(summarizationResult);
        setStatus('success');
        
        // Сохраняем в кэш
        saveToCache(text, summarizationResult, options);
      } catch (err) {
        stopProgress();
        setProgress(0);
        
        const errorMessage =
          err instanceof Error ? err.message : 'Неизвестная ошибка';
        const errorType =
          (err as Error & { type?: SummarizationError['type'] })?.type ||
          'unknown';

        setError({
          type: errorType,
          message: errorMessage,
        });
        setStatus('error');
      }
    },
    [getFromCache, saveToCache, startProgress, stopProgress]
  );

  // Отмена
  const cancel = useCallback(() => {
    ollamaService.cancel();
    stopProgress();
    setStatus('idle');
    setProgress(0);
  }, [stopProgress]);

  // Очистка кэша
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    localStorage.removeItem(config.storageKey);
  }, [config.storageKey]);

  // Сброс
  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopProgress();
      ollamaService.cancel();
    };
  }, [stopProgress]);

  return {
    status,
    result,
    error,
    progress,
    isSummarizing: status === 'loading',
    isAvailable,
    summarize,
    cancel,
    clearCache,
    reset,
  };
}
