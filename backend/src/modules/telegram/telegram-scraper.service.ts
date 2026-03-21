import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

/**
 * Интерфейс для сообщения из Telegram
 */
export interface TelegramMessage {
  message_id: number;
  date: Date;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  hasMedia: boolean;
  views?: number;
}

/**
 * TelegramScraperService - сервис для парсинга публичных Telegram каналов
 * Использует веб-версию канала (t.me/s/channel)
 * 
 * @example
 * // Для публичного канала https://t.me/olimpiyec
 * // Используем: https://t.me/s/olimpiyec
 */
@Injectable()
export class TelegramScraperService {
  private readonly logger = new Logger(TelegramScraperService.name);
  private readonly channelUrl: string;
  private readonly httpClient: AxiosInstance;
  private isConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const channelId = this.configService.get<string>('TELEGRAM_CHANNEL_ID', '');
    
    // Канал должен быть указан без @ и без https://t.me/
    if (channelId) {
      this.isConfigured = true;
      // Очищаем ID от лишних символов
      const cleanId = channelId.replace(/[@/]/g, '').replace('https://t.me/', '');
      this.channelUrl = `https://t.me/s/${cleanId}`;
    } else {
      this.isConfigured = false;
      this.channelUrl = '';
    }

    this.httpClient = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    
    if (!this.isConfigured) {
      this.logger.warn('Telegram scraper not configured. Set TELEGRAM_CHANNEL_ID in .env (e.g., @olimpiyec)');
    } else {
      this.logger.log(`Telegram scraper configured for channel: ${this.channelUrl}`);
    }
  }

  /**
   * Получить последние сообщения из канала
   * Парсит веб-версию канала t.me/s/channel
   */
  async getChannelPosts(limit = 20): Promise<TelegramMessage[]> {
    if (!this.isConfigured) {
      this.logger.debug('Telegram scraper not configured, returning empty posts');
      return [];
    }

    try {
      const response = await this.httpClient.get(this.channelUrl);
      const $ = cheerio.load(response.data);

      const messages: TelegramMessage[] = [];

      // Ищем все посты
      $('.tgme_widget_message').each((index, element) => {
        if (messages.length >= limit) return;

        const $post = $(element);
        
        // Извлекаем ID сообщения из data-post
        const dataPost = $post.attr('data-post');
        if (!dataPost) return;

        const messageId = parseInt(dataPost.split('/').pop() || '0');

        // Дата
        const dateStr = $post.find('.tgme_widget_message_date time').attr('datetime');
        const date = dateStr ? new Date(dateStr) : new Date();

        // Текст (включая заголовок)
        const text = $post.find('.tgme_widget_message_text').text().trim();
        if (!text) return; // Пропускаем посты без текста

        // Изображения
        let imageUrl: string | undefined;
        const image = $post.find('.tgme_widget_message_photo_wrap').first();
        if (image.length > 0) {
          const style = image.attr('style') || '';
          const match = style.match(/url\(['"]?([^'")]+)['"]?\)/);
          if (match) {
            imageUrl = match[1];
          }
        }

        // Видео (превью)
        let videoUrl: string | undefined;
        const video = $post.find('.tgme_widget_message_video_wrap img').first();
        if (video.length > 0) {
          videoUrl = video.attr('src');
        }

        // Просмотры
        const viewsText = $post.find('.tgme_widget_message_views').text().trim();
        const views = viewsText ? parseInt(viewsText.replace(/\s/g, '')) : undefined;

        messages.push({
          message_id: messageId,
          date,
          text,
          imageUrl: imageUrl || videoUrl,
          videoUrl: undefined,
          hasMedia: !!(imageUrl || videoUrl),
          views,
        });
      });

      this.logger.log(`Parsed ${messages.length} messages from ${this.channelUrl}`);
      return messages;
    } catch (error) {
      this.logger.error('Error parsing Telegram channel:', error.message);
      throw error;
    }
  }

  /**
   * Парсить текст сообщения
   * Извлекает заголовок из первой строки
   */
  parseMessageText(message: TelegramMessage): { title: string; content: string } {
    const text = message.text;
    const lines = text.split('\n');

    // Первая строка - заголовок (если она короткая)
    let title: string;
    let content: string;

    if (lines[0]?.length < 100 && lines[0].trim().length > 0) {
      title = lines[0].trim();
      content = lines.slice(1).join('\n').trim() || text;
    } else {
      // Если первая строка длинная, берём первые 100 символов
      title = text.substring(0, 100) + (text.length > 100 ? '...' : '');
      content = text;
    }

    return { title, content };
  }

  /**
   * Проверить доступность канала
   */
  async checkChannelAvailability(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      const response = await this.httpClient.get(this.channelUrl);
      return response.status === 200;
    } catch (error) {
      this.logger.error('Channel not available:', error.message);
      return false;
    }
  }

  /**
   * Получить информацию о канале
   */
  async getChannelInfo(): Promise<{ title?: string; description?: string; subscribers?: number } | null> {
    if (!this.isConfigured) {
      return null;
    }

    try {
      const response = await this.httpClient.get(this.channelUrl);
      const $ = cheerio.load(response.data);

      const title = $('.tgme_channel_info_header_title').text().trim();
      const description = $('.tgme_channel_info_description').text().trim();
      const subscribersText = $('.tgme_channel_info_counter_value').text().trim();
      const subscribers = subscribersText ? parseInt(subscribersText.replace(/\s/g, '')) : undefined;

      return { title, description, subscribers };
    } catch (error) {
      this.logger.error('Error getting channel info:', error.message);
      return null;
    }
  }

  /**
   * Проверить настроен ли сервис
   */
  getIsConfigured(): boolean {
    return this.isConfigured;
  }
}
