import type {
  SummarizationResult,
  SummarizationOptions,
  SummarizationError,
  TextSummarizationService,
} from '@/types/text-summarization';

/**
 * Конфигурация сервиса
 */
export interface OllamaConfig {
  /** URL Ollama API */
  baseUrl: string;
  /** Модель для использования */
  model: string;
  /** Таймаут запроса (мс) */
  timeout: number;
}

/**
 * Конфигурация по умолчанию
 * Можно переопределить через env переменные
 */
const DEFAULT_CONFIG: OllamaConfig = {
  baseUrl: 'http://localhost:11434',
  model: 'gemma3:4b', // или llama3, mistral, etc.
  timeout: 30000, // 30 секунд
};

/**
 * Промпт для сокращения текста
 */
function createSummarizationPrompt(
  text: string,
  options: SummarizationOptions
): string {
  const stylePrompts = {
    brief: 'Кратко изложи основное содержание в 2-3 предложениях.',
    detailed: 'Сделай подробный пересказ, сохранив ключевые детали.',
    'key-points': 'Выдели основные пункты в виде маркированного списка.',
  };

  const stylePrompt = stylePrompts[options.style || 'brief'];
  const maxLengthPrompt = options.maxLength
    ? `Длина ответа не должна превышать ${options.maxLength} символов.`
    : '';

  return `Ты — помощник для сокращения текста. Твоя задача — сделать краткий пересказ следующего текста на русском языке.

${stylePrompt} ${maxLengthPrompt}

Текст для пересказа:
"""
${text}
"""

Пересказ:`;
}

/**
 * Ollama Service
 * Сервис для работы с Ollama API
 * 
 * В будущем можно заменить на вызов API бэкенда:
 * - Изменить baseUrl на '/api/summarize'
 * - Изменить формат запроса/ответа
 */
export class OllamaService implements TextSummarizationService {
  private config: OllamaConfig;
  private abortController: AbortController | null = null;

  constructor(config?: Partial<OllamaConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Сократить текст
   */
  async summarize(
    text: string,
    options?: SummarizationOptions
  ): Promise<SummarizationResult> {
    const startTime = performance.now();
    
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    try {
      const prompt = createSummarizationPrompt(text, options || {});

      const response = await fetch(
        `${this.config.baseUrl}/api/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.config.model,
            prompt,
            stream: false,
            options: {
              temperature: 0.3, // Низкая температура для более точных ответов
              top_p: 0.9,
            },
          }),
          signal,
        }
      );

      if (!response.ok) {
        throw this.createError(
          'api',
          `Ошибка API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const summarizedText = data.response?.trim() || '';

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      return {
        originalText: text,
        summarizedText,
        compressionRatio: this.calculateCompressionRatio(text, summarizedText),
        processingTime,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createError('unknown', 'Запрос отменён');
        }
        if (error.message.includes('Failed to fetch')) {
          throw this.createError(
            'network',
            'Не удалось подключиться к Ollama. Убедитесь, что сервис запущен.'
          );
        }
        throw this.createError('unknown', error.message);
      }
      throw this.createError('unknown', 'Неизвестная ошибка');
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Проверить доступность сервиса
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Отменить текущий запрос
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Расчёт процента сокращения
   */
  private calculateCompressionRatio(
    original: string,
    summarized: string
  ): number {
    if (!original.length) return 0;
    return Math.round((1 - summarized.length / original.length) * 100);
  }

  /**
   * Создание ошибки
   */
  private createError(
    type: SummarizationError['type'],
    message: string
  ): Error & { type: SummarizationError['type'] } {
    const error = new Error(message) as Error & {
      type: SummarizationError['type'];
    };
    error.type = type;
    return error;
  }
}

/**
 * Экспорт экземпляра сервиса по умолчанию
 */
export const ollamaService = new OllamaService();
