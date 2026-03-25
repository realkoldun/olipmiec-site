import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

/**
 * Интерфейс для запроса к Ollama
 */
export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    num_predict?: number;
  };
}

/**
 * Интерфейс для ответа от Ollama
 */
export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

/**
 * OllamaService - сервис для работы с Ollama API
 * Поддерживает различные модели (gemma3:4b, llama2, mistral и др.)
 */
@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly httpClient: AxiosInstance;
  private readonly baseUrl: string;
  private readonly defaultModel: string;
  public isConfigured = false;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434');
    this.defaultModel = this.configService.get<string>('OLLAMA_MODEL', 'gemma3:4b');

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000, // 60 секунд на генерацию
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.isConfigured = true;
    this.logger.log(`Ollama configured: ${this.baseUrl}, model: ${this.defaultModel}`);
  }

  /**
   * Отправить запрос к Ollama
   */
  async generate(prompt: string, model?: string): Promise<string> {
    try {
      const response = await this.httpClient.post<OllamaResponse>('/api/generate', {
        model: model || this.defaultModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.3, // Низкая температура для более точных ответов
          top_p: 0.9,
          num_predict: 500, // Максимум токенов
        },
      });

      return response.data.response;
    } catch (error: any) {
      this.logger.error(`Ollama API error: ${error.message}`);
      throw new Error(`Failed to generate response from Ollama: ${error.message}`);
    }
  }

  /**
   * Проверить доступность Ollama
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.httpClient.get('/api/tags');
      return response.status === 200;
    } catch (error) {
      this.logger.error(`Ollama not available: ${error.message}`);
      return false;
    }
  }

  /**
   * Получить список доступных моделей
   */
  async getModels(): Promise<string[]> {
    try {
      const response = await this.httpClient.get('/api/tags');
      const models = response.data.models || [];
      return models.map((m: any) => m.name);
    } catch (error) {
      this.logger.error(`Failed to get models: ${error.message}`);
      return [];
    }
  }
}
