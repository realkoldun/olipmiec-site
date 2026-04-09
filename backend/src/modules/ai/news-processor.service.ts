import { Injectable, Logger } from "@nestjs/common";
import { OllamaService } from "./ollama.service";

export interface NewsAnalysisResult {
  title: string;
  tags: string[];
  content: string;
  category?: "sport" | "announcement" | "event" | "news";
}

export interface NewsSummarizationResult {
  summarizedText: string;
  compressionRatio: number;
}

@Injectable()
export class NewsProcessorService {
  private readonly logger = new Logger(NewsProcessorService.name);

  constructor(private readonly ollama: OllamaService) {}

  async analyzeNews(text: string): Promise<NewsAnalysisResult> {
    const prompt = this.createAnalysisPrompt(text);

    try {
      const response = await this.ollama.generate(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error: any) {
      this.logger.error(`Failed to analyze news: ${error.message}`);
      return {
        title: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
        tags: this.extractHashtagsFallback(text),
        content: this.removeHashtagsFallback(text),
        category: this.detectCategoryFallback(text),
      };
    }
  }

  async summarizeNews(
    content: string,
    maxLength = 500,
  ): Promise<NewsSummarizationResult> {
    const originalLength = content.length;

    const prompt = this.createSummarizationPrompt(content, maxLength);

    try {
      const response = await this.ollama.generate(prompt);
      const cleanedResponse = response.trim();

      console.log("bebebeb", cleanedResponse);

      const compressionRatio =
        originalLength > 0
          ? Math.round((1 - cleanedResponse.length / originalLength) * 100)
          : 0;

      return {
        summarizedText: cleanedResponse,
        compressionRatio,
      };
    } catch (error: any) {
      this.logger.error(`Failed to summarize news: ${error.message}`);
      throw error;
    }
  }

  private createSummarizationPrompt(
    content: string,
    maxLength: number,
  ): string {
    return `Сократи этот текст до ${maxLength} символов, сохранив основную суть и важные детали:

${content}

Сокращённый текст (на русском языке, без вступлений):`;
  }

  private createAnalysisPrompt(text: string): string {
    return `Ты - помощник для обработки новостей из Telegram. Проанализируй текст и извлеки:

1. **Заголовок** - короткое название новости (до 100 символов)
2. **Теги** - массив ключевых слов/тем (3-7 тегов, без символа #)
3. **Категория** - одна из: "sport", "announcement", "event", "news"
   - sport: спортивные события, соревнования, победы, матчи, тренировки
   - announcement: объявления, информация для родителей, расписания
   - event: мероприятия, праздники, церемонии, дни рождения
   - news: общие новости, поздравления, достижения
4. **Контент** - основной текст новости БЕЗ хештегов

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
  "category": "sport|announcement|event|news",
  "content": "Текст новости без хештегов"
}`;
  }

  private parseAnalysisResponse(response: string): NewsAnalysisResult {
    let cleanResponse = response.trim();

    cleanResponse = cleanResponse
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "");

    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      title: parsed.title?.trim() || "",
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map((t: string) => t.toLowerCase().trim())
        : [],
      category:
        parsed.category || this.detectCategoryFallback(parsed.content || ""),
      content: parsed.content?.trim() || "",
    };
  }

  private extractHashtagsFallback(text: string): string[] {
    const matches = text.match(/(?:^|\s)#([\wа-яА-ЯёЁ_]+)/g) || [];
    return [
      ...new Set(matches.map((tag) => tag.replace(/[#\s]/g, "").toLowerCase())),
    ];
  }

  private removeHashtagsFallback(text: string): string {
    return text.replace(/(?:^|\s)#[\wа-яА-ЯёЁ_]+/g, "").trim();
  }

  private detectCategoryFallback(
    text: string,
  ): "sport" | "announcement" | "event" | "news" {
    const lowerText = text.toLowerCase();

    const sportKeywords = [
      "соревнования",
      "победа",
      "чемпионат",
      "матч",
      "тренировка",
      "спорт",
      "биатлон",
      "лыжи",
      "шорт-трек",
      "хоккей",
      "футбол",
      "баскетбол",
      "волейбол",
      "плавание",
      "первенство",
      "кубок",
      "медаль",
      "золото",
      "серебро",
      "бронза",
    ];
    const announcementKeywords = [
      "объявление",
      "расписание",
      "информация",
      "график",
      "родители",
      "запись",
      "набор",
      "обучение",
    ];
    const eventKeywords = [
      "праздник",
      "церемония",
      "день рождения",
      "концерт",
      "мероприятие",
      "торжество",
      "юбилей",
      "поздравляем",
    ];

    const sportScore = sportKeywords.filter((k) =>
      lowerText.includes(k),
    ).length;
    const announcementScore = announcementKeywords.filter((k) =>
      lowerText.includes(k),
    ).length;
    const eventScore = eventKeywords.filter((k) =>
      lowerText.includes(k),
    ).length;

    const scores = [
      { category: "sport" as const, score: sportScore },
      { category: "announcement" as const, score: announcementScore },
      { category: "event" as const, score: eventScore },
      { category: "news" as const, score: 0 },
    ];

    return scores.sort((a, b) => b.score - a.score)[0].category;
  }
}
