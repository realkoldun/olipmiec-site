import type {
  SummarizationResult,
  SummarizationOptions,
  SummarizationError,
  TextSummarizationService,
} from '@/types/text-summarization';

export interface OllamaConfig {
  baseUrl: string;
  model: string;
  timeout: number;
}

const DEFAULT_CONFIG: OllamaConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  model: 'gemma3:4b',
  timeout: 60000,
};

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

export class OllamaService implements TextSummarizationService {
  private config: OllamaConfig;
  private abortController: AbortController | null = null;

  constructor(config?: Partial<OllamaConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

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
              temperature: 0.3,
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

  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  private calculateCompressionRatio(
    original: string,
    summarized: string
  ): number {
    if (!original.length) return 0;
    return Math.round((1 - summarized.length / original.length) * 100);
  }

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

export const ollamaService = new OllamaService();
