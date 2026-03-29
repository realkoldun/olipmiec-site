'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  SummarizationResult,
  SummarizationOptions,
  SummarizationStatus,
  SummarizationError,
  CacheEntry,
} from '@/types/text-summarization';
import apiClient from '@/services/api/api-client';

export interface UseTextSummarizerResult {
  status: SummarizationStatus;
  result: SummarizationResult | null;
  error: SummarizationError | null;
  progress: number;
  isSummarizing: boolean;
  isAvailable: boolean;
  summarize: (text: string, options?: SummarizationOptions) => Promise<void>;
  cancel: () => void;
  clearCache: () => void;
  reset: () => void;
}

interface CacheConfig {
  ttl: number;
  maxSize: number;
  storageKey: string;
}

function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000,
  maxSize: 50,
  storageKey: 'text-summarizer-cache',
};

export function useTextSummarizer(cacheConfig?: Partial<CacheConfig>): UseTextSummarizerResult {
  const config = { ...DEFAULT_CACHE_CONFIG, ...cacheConfig };

  const [status, setStatus] = useState<SummarizationStatus>('idle');
  const [result, setResult] = useState<SummarizationResult | null>(null);
  const [error, setError] = useState<SummarizationError | null>(null);
  const [progress, setProgress] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(config.storageKey);
      if (cached) {
        const parsed = JSON.parse(cached) as CacheEntry[];
        const now = Date.now();
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

  const saveCache = useCallback(() => {
    try {
      const entries = Array.from(cacheRef.current.values());
      localStorage.setItem(config.storageKey, JSON.stringify(entries));
    } catch {
      // Игнорируем ошибки сохранения
    }
  }, [config.storageKey]);

  useEffect(() => {
    apiClient
      .get('/health')
      .then(() => setIsAvailable(true))
      .catch(() => setIsAvailable(false));
  }, []);

  const getFromCache = useCallback((text: string, options?: SummarizationOptions): SummarizationResult | null => {
    const hash = hashCode(text + JSON.stringify(options));
    const entry = cacheRef.current.get(hash);

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.createdAt > entry.ttl) {
      cacheRef.current.delete(hash);
      return null;
    }

    return entry.result;
  }, []);

  const saveToCache = useCallback(
    (text: string, result: SummarizationResult, options?: SummarizationOptions) => {
      const hash = hashCode(text + JSON.stringify(options));
      const entry: CacheEntry = {
        textHash: hash,
        result,
        createdAt: Date.now(),
        ttl: config.ttl,
      };

      if (cacheRef.current.size >= config.maxSize) {
        const oldestKey = Array.from(cacheRef.current.entries()).reduce(
          (min, [key, value]) => (value.createdAt < cacheRef.current.get(min)!.createdAt ? key : min),
          Array.from(cacheRef.current.keys())[0]
        );
        cacheRef.current.delete(oldestKey);
      }

      cacheRef.current.set(hash, entry);
      saveCache();
    },
    [config.maxSize, config.ttl, saveCache]
  );

  const startProgress = useCallback(() => {
    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const summarize = useCallback(
    async (text: string, options?: SummarizationOptions) => {
      if (!text.trim()) {
        setError({ type: 'unknown', message: 'Пустой текст' });
        return;
      }

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
        const response = await apiClient.post('/api/summarize', {
          text,
          options,
        });

        const summarizationResult: SummarizationResult = {
          originalText: text,
          summarizedText: response.data.summarizedText,
          compressionRatio: response.data.compressionRatio || 0,
          processingTime: response.data.processingTime || 0,
        };

        stopProgress();
        setProgress(100);
        setResult(summarizationResult);
        setStatus('success');

        saveToCache(text, summarizationResult, options);
      } catch (err) {
        stopProgress();
        setProgress(0);

        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        const errorType = (err as Error & { type?: SummarizationError['type'] })?.type || 'unknown';

        setError({
          type: errorType,
          message: errorMessage,
        });
        setStatus('error');
      }
    },
    [getFromCache, saveToCache, startProgress, stopProgress]
  );

  const cancel = useCallback(() => {
    stopProgress();
    setStatus('idle');
    setProgress(0);
  }, [stopProgress]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    localStorage.removeItem(config.storageKey);
  }, [config.storageKey]);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      stopProgress();
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
