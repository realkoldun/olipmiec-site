import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramService } from './telegram.service';
import { NewsService } from '../news/news.service';
import { CreateNewsDto } from '../news/dto/news.dto';

/**
 * TelegramSyncService - сервис для синхронизации новостей из Telegram
 * Автоматически получает новые сообщения и сохраняет их в БД
 */
@Injectable()
export class TelegramSyncService {
  private readonly logger = new Logger(TelegramSyncService.name);
  private lastSyncedMessageId: number | null = null;

  constructor(
    private readonly telegramService: TelegramService,
    private readonly newsService: NewsService,
  ) {}

  /**
   * Инициализация сервиса
   * Запускается при старте приложения
   */
  async onModuleInit() {
    this.logger.log('TelegramSyncService initialized');
    
    // Проверка доступности бота
    const isAvailable = await this.telegramService.checkBotAvailability();
    if (isAvailable) {
      this.logger.log('Telegram bot is available');
      
      // Получение последнего сохраненного сообщения
      try {
        const latestNews = await this.newsService.getLatest(1);
        if (latestNews.length > 0) {
          this.lastSyncedMessageId = latestNews[0].telegramId;
          this.logger.log(`Last synced message ID: ${this.lastSyncedMessageId}`);
        }
      } catch (error) {
        this.logger.warn('Could not fetch latest news (table may not exist yet):', error.message);
      }
    } else {
      this.logger.warn('Telegram bot is not available. Check TELEGRAM_BOT_TOKEN');
      this.logger.warn('Application will work in API mode only (no auto-sync)');
    }
  }

  /**
   * Синхронизация по расписанию (каждые 5 минут)
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.debug('Running scheduled sync...');
    await this.sync();
  }

  /**
   * Ручная синхронизация
   * Может быть вызвана через API
   */
  async sync(): Promise<number> {
    this.logger.log('Starting Telegram sync...');

    try {
      // Получаем последние сообщения
      const messages = await this.telegramService.getChannelPosts(20);
      
      if (messages.length === 0) {
        this.logger.log('No new messages found');
        return 0;
      }

      let newCount = 0;

      // Обрабатываем каждое сообщение
      for (const message of messages) {
        // Пропускаем уже сохраненные
        if (this.lastSyncedMessageId && message.message_id <= this.lastSyncedMessageId) {
          continue;
        }

        // Пропускаем сообщения без текста
        if (!message.text) {
          continue;
        }

        try {
          // Проверяем существует ли уже
          const exists = await this.newsService.existsByTelegramId(message.message_id);
          if (exists) {
            continue;
          }

          // Парсим текст
          const { title, content } = this.telegramService.parseMessageText(message);

          // Извлекаем медиа
          const media = await this.telegramService.extractMedia(message);

          // Создаем DTO
          const createNewsDto: CreateNewsDto = {
            telegramId: message.message_id,
            title,
            content,
            postDate: new Date(message.date * 1000).toISOString(),
            views: message.views || 0,
            ...media,
          };

          // Сохраняем в БД
          await this.newsService.create(createNewsDto);
          
          newCount++;
          this.lastSyncedMessageId = message.message_id;
          
          this.logger.log(`Saved news #${message.message_id}: ${title}`);
        } catch (error) {
          this.logger.error(`Error processing message ${message.message_id}:`, error);
        }
      }

      this.logger.log(`Sync completed. New messages: ${newCount}`);
      return newCount;
    } catch (error) {
      this.logger.error('Sync failed:', error);
      throw error;
    }
  }

  /**
   * Получить статус синхронизации
   */
  getSyncStatus() {
    return {
      lastSyncedMessageId: this.lastSyncedMessageId,
      isConfigured: !!process.env.TELEGRAM_BOT_TOKEN,
    };
  }
}
