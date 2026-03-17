/**
 * Типы для системы сокращения текста
 */

/**
 * Статусы запроса
 */
export type SummarizationStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Настройки для сокращения текста
 */
export interface SummarizationOptions {
  /** Максимальная длина результата (в символах) */
  maxLength?: number;
  /** Стиль сокращения */
  style?: 'brief' | 'detailed' | 'key-points';
  /** Язык ответа */
  language?: 'ru' | 'en';
}

/**
 * Результат сокращения текста
 */
export interface SummarizationResult {
  /** Исходный текст */
  originalText: string;
  /** Сокращённый текст */
  summarizedText: string;
  /** Процент сокращения */
  compressionRatio: number;
  /** Время выполнения (мс) */
  processingTime: number;
}

/**
 * Ошибка сокращения
 */
export interface SummarizationError {
  /** Тип ошибки */
  type: 'network' | 'api' | 'timeout' | 'unknown';
  /** Сообщение об ошибке */
  message: string;
}

/**
 * Кэш запись
 */
export interface CacheEntry {
  /** Хэш исходного текста */
  textHash: string;
  /** Результат */
  result: SummarizationResult;
  /** Время создания (timestamp) */
  createdAt: number;
  /** Время жизни (мс) */
  ttl: number;
}

/**
 * Интерфейс сервиса сокращения текста
 * Позволяет легко переключиться на бэк в будущем
 */
export interface TextSummarizationService {
  /**
   * Сократить текст
   */
  summarize(text: string, options?: SummarizationOptions): Promise<SummarizationResult>;
  
  /**
   * Проверить доступность сервиса
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Отменить текущий запрос
   */
  cancel(): void;
}
