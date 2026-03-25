import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { NewsProcessorService } from './news-processor.service';

/**
 * AI Controller - REST API для работы с AI (Ollama)
 */
@Controller('api/ai')
export class AIController {
  constructor(
    private readonly ollama: OllamaService,
    private readonly newsProcessor: NewsProcessorService,
  ) {}

  /**
   * Проверка доступности Ollama
   * GET /api/ai/health
   */
  @Get('health')
  async checkHealth() {
    const isAvailable = await this.ollama.isAvailable();
    const models = await this.ollama.getModels();
    
    return {
      ok: isAvailable,
      isConfigured: this.ollama.isConfigured,
      models,
      defaultModel: this.ollama.defaultModel,
    };
  }

  /**
   * Обработать текст новости
   * POST /api/ai/analyze-news
   */
  @Post('analyze-news')
  @HttpCode(HttpStatus.OK)
  async analyzeNews(@Body('text') text: string) {
    if (!text || typeof text !== 'string') {
      return {
        ok: false,
        message: 'Text is required',
      };
    }

    const result = await this.newsProcessor.analyzeNews(text);
    
    return {
      ok: true,
      data: result,
    };
  }

  /**
   * Прямой запрос к Ollama
   * POST /api/ai/generate
   */
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Body('prompt') prompt: string, @Body('model') model?: string) {
    if (!prompt || typeof prompt !== 'string') {
      return {
        ok: false,
        message: 'Prompt is required',
      };
    }

    const response = await this.ollama.generate(prompt, model);
    
    return {
      ok: true,
      response,
      model: model || this.ollama.defaultModel,
    };
  }
}
