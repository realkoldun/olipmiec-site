import { Injectable, Logger } from '@nestjs/common';
import { OllamaService } from './ollama.service';

/**
 * Результат обработки новости AI
 */
export interface NewsAnalysisResult {
  title: string;
  tags: string[];
  content: string;
}

/**
 * NewsProcessorService - сервис для AI обработки новостей
 * Использует Ollama для извлечения заголовка, тегов и очистки текста
 */
@Injectable()
export class NewsProcessorService {
  private readonly logger = new Logger(NewsProcessorService.name);

  constructor(private readonly ollama: OllamaService) {}

  /**
   * Обработать текст новости и извлечь структурированные данные
   */
  async analyzeNews(text: string): Promise<NewsAnalysisResult> {
    const prompt = this.createAnalysisPrompt(text);
    
    try {
      const response = await this.ollama.generate(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error: any) {
      this.logger.error(`Failed to analyze news: ${error.message}`);
      // Возвращаем данные без AI обработки
      return {
        title: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        tags: this.extractHashtagsFallback(text),
        content: this.removeHashtagsFallback(text),
      };
    }
  }

  /**
   * Создать промпт для анализа новости
   */
  private createAnalysisPrompt(text: string): string {
    return `Ты - помощник для обработки новостей из Telegram. Проанализируй текст и извлеки:

1. **Заголовок** - короткое название новости (до 100 символов)
2. **Теги** - массив ключевых слов/тем (3-7 тегов, без символа #)
3. **Контент** - основной текст новости БЕЗ хештегов

Правила:
- Теги должны быть релевантными теме новости
- Удаляй все хештеги из контента (даже слитные like #поздравляем10)
- Сохраняй эмодзи в контенте
- Форматируй ответ СТРОГО в JSON формате

Текст новости:
${text}

Ответ в формате JSON:
{
  "title": "Заголовок новости",
  "tags": ["тег1", "тег2", "тег3"],
  "content": "Текст новости без хештегов"
}`;
  }

  /**
   * Распарсить ответ от AI
   */
  private parseAnalysisResponse(response: string): NewsAnalysisResult {
    // Очищаем ответ от markdown обёрток
    let cleanResponse = response.trim();
    
    // Удаляем ```json и ``` если есть
    cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Находим JSON в ответе
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      title: parsed.title?.trim() || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags.map((t: string) => t.toLowerCase().trim()) : [],
      content: parsed.content?.trim() || '',
    };
  }

  /**
   * Fallback: извлечь хештеги regex (если AI недоступен)
   */
  private extractHashtagsFallback(text: string): string[] {
    // Более умный regex: ищем # в начале строки или после пробела/переноса
    const matches = text.match(/(?:^|\s)#([\wа-яА-ЯёЁ_]+)/g) || [];
    return [...new Set(matches.map(tag => tag.replace(/[#\s]/g, '').toLowerCase()))];
  }

  /**
   * Fallback: удалить хештеги из текста (если AI недоступен)
   */
  private removeHashtagsFallback(text: string): string {
    return text.replace(/(?:^|\s)#[\wа-яА-ЯёЁ_]+/g, '').trim();
  }
}
