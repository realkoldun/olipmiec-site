import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { TelegramMessage, TelegramServiceConfig } from './interfaces/telegram.interface';

/**
 * TelegramService - сервис для получения новостей из Telegram канала
 * Использует Telegram Bot API
 */
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly config: TelegramServiceConfig;
  private readonly httpClient: AxiosInstance;
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN', '');
    
    this.isConfigured = !!botToken && botToken !== '';
    
    this.config = {
      botToken: botToken,
      channelId: this.configService.get<string>('TELEGRAM_CHANNEL_ID', ''),
      baseUrl: 'https://api.telegram.org/bot',
    };

    this.httpClient = axios.create({
      baseURL: `${this.config.baseUrl}${this.config.botToken}`,
      timeout: 10000,
    });
    
    if (!this.isConfigured) {
      this.logger.warn('Telegram is not configured. Set TELEGRAM_BOT_TOKEN in .env');
    }
  }

  /**
   * Проверить настроен ли Telegram
   */
  getIsConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Получить последние сообщения из канала
   */
  async getChannelPosts(limit = 10): Promise<TelegramMessage[]> {
    if (!this.isConfigured) {
      this.logger.debug('Telegram not configured, returning empty posts');
      return [];
    }
    
    try {
      const response = await this.httpClient.get('/getUpdates', {
        params: {
          offset: -1,
          limit: limit + 1,
        },
      });

      if (!response.data.ok) {
        this.logger.error('Telegram API error:', response.data);
        throw new Error('Failed to fetch Telegram updates');
      }

      const updates = response.data.result || [];
      const posts = updates
        .filter((update) => update.channel_post)
        .map((update) => update.channel_post);

      return posts.slice(0, limit);
    } catch (error) {
      this.logger.error('Error fetching channel posts:', error);
      throw error;
    }
  }

  /**
   * Получить сообщение по ID
   */
  async getMessageById(messageId: number): Promise<TelegramMessage | null> {
    try {
      const response = await this.httpClient.get('/getUpdates', {
        params: {
          offset: 0,
          limit: 100,
        },
      });

      if (!response.data.ok) {
        return null;
      }

      const updates = response.data.result || [];
      const post = updates.find(
        (update) => update.channel_post?.message_id === messageId,
      );

      return post?.channel_post || null;
    } catch (error) {
      this.logger.error('Error fetching message by ID:', error);
      return null;
    }
  }

  /**
   * Получить URL для загрузки файла (фото/видео)
   */
  async getFileUrl(fileId: string): Promise<string> {
    try {
      const response = await this.httpClient.get('/getFile', {
        params: { file_id: fileId },
      });

      if (!response.data.ok) {
        return '';
      }

      const filePath = response.data.result.file_path;
      return `https://api.telegram.org/file/bot${this.config.botToken}/${filePath}`;
    } catch (error) {
      this.logger.error('Error getting file URL:', error);
      return '';
    }
  }

  /**
   * Проверить доступность бота
   */
  async checkBotAvailability(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }
    
    try {
      const response = await this.httpClient.get('/getMe');
      return response.data.ok;
    } catch (error) {
      this.logger.error('Bot not available:', error);
      return false;
    }
  }

  /**
   * Получить информацию о канале
   */
  async getChannelInfo() {
    try {
      const response = await this.httpClient.get('/getChat', {
        params: {
          chat_id: this.config.channelId,
        },
      });

      if (!response.data.ok) {
        return null;
      }

      return response.data.result;
    } catch (error) {
      this.logger.error('Error getting channel info:', error);
      return null;
    }
  }

  /**
   * Парсить текст сообщения
   * Извлекает заголовок из первой строки
   */
  parseMessageText(message: TelegramMessage): { title: string; content: string } {
    const text = message.text || '';
    const lines = text.split('\n');

    // Первая строка - заголовок
    const title = lines[0]?.trim() || 'Без названия';
    
    // Остальные строки - контент
    const content = lines.slice(1).join('\n').trim() || text;

    return { title, content };
  }

  /**
   * Извлечь медиа из сообщения
   */
  async extractMedia(message: TelegramMessage): Promise<{
    imageUrl?: string;
    videoUrl?: string;
    hasMedia: boolean;
  }> {
    const result = {
      imageUrl: undefined as string | undefined,
      videoUrl: undefined as string | undefined,
      hasMedia: false,
    };

    // Фото
    if (message.photo && message.photo.length > 0) {
      const photo = message.photo[message.photo.length - 1]; // Наибольшее качество
      result.imageUrl = await this.getFileUrl(photo.file_id);
      result.hasMedia = true;
    }

    // Видео
    if (message.video) {
      result.videoUrl = await this.getFileUrl(message.video.file_id);
      result.hasMedia = true;
    }

    return result;
  }
}
