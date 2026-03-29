import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { NewsProcessorService } from './news-processor.service';

@Controller('api/ai')
export class AIController {
  constructor(
    private readonly ollama: OllamaService,
    private readonly newsProcessor: NewsProcessorService,
  ) {}

  @Get('health')
  async checkHealth() {
    const isAvailable = await this.ollama.isAvailable();
    const models = await this.ollama.getModels();

    return {
      ok: isAvailable,
      isConfigured: this.ollama.isConfigured,
      models,
      defaultModel: this.ollama.getDefaultModel(),
    };
  }

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
      model: model || this.ollama.getDefaultModel(),
    };
  }

  @Post('summarize')
  @HttpCode(HttpStatus.OK)
  async summarize(@Body('text') text: string, @Body('options') options?: any) {
    if (!text || typeof text !== 'string') {
      return {
        ok: false,
        message: 'Text is required',
      };
    }

    const maxLength = options?.maxLength || 500;
    const result = await this.newsProcessor.summarizeNews(text, maxLength);

    return {
      ok: true,
      summarizedText: result.summarizedText,
      compressionRatio: result.compressionRatio,
      processingTime: 0,
    };
  }
}
