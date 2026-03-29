import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramScraperService } from './telegram-scraper.service';
import { NewsService } from '../news/news.service';
import { CreateNewsDto } from '../news/dto/news.dto';
import { NewsProcessorService } from '../ai/news-processor.service';

/**
 * TelegramSyncService - сервис для синхронизации новостей из Telegram
 * Автоматически получает новые сообщения через скрапинг и сохраняет их в БД
 */
@Injectable()
export class TelegramSyncService {
  private readonly logger = new Logger(TelegramSyncService.name);
  private lastSyncedMessageId: number | null = null;

  constructor(
    private readonly telegramScraper: TelegramScraperService,
    private readonly newsService: NewsService,
    private readonly newsProcessor: NewsProcessorService,
  ) {}

  /**
   * Инициализация сервиса
   * Запускается при старте приложения
   */
  async onModuleInit() {
    this.logger.log('TelegramSyncService initialized');

    // Проверка доступности канала
    if (this.telegramScraper.getIsConfigured()) {
      const isAvailable = await this.telegramScraper.checkChannelAvailability();
      if (isAvailable) {
        this.logger.log('Telegram channel is available');

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

        // Запуск синхронизации при старте
        this.logger.log('Running initial sync...');
        await this.sync();
      } else {
        this.logger.warn('Telegram channel is not available. Check TELEGRAM_CHANNEL_ID');
      }
    } else {
      this.logger.log('Telegram not configured. Application works in API mode only.');
    }
  }

  /**
   * Синхронизация по расписанию (каждые 5 минут)
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    if (!this.telegramScraper.getIsConfigured()) {
      return; // Пропускаем если Telegram не настроен
    }

    this.logger.debug('Running scheduled sync...');
    await this.sync();
  }

  /**
   * Ручная синхронизация
   * Может быть вызвана через API
   */
  async sync(): Promise<number> {
    if (!this.telegramScraper.getIsConfigured()) {
      this.logger.log('Telegram not configured, skipping sync');
      return 0;
    }

    this.logger.log('Starting Telegram sync...');

    try {
      // Получаем последние сообщения через скрапинг (с пагинацией)
      const messages = await this.telegramScraper.getChannelPosts(100);

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

        try {
          // Проверяем существует ли уже
          const exists = await this.newsService.existsByTelegramId(message.message_id);
          if (exists) {
            continue;
          }

          // AI обработка новости
          const analysis = await this.newsProcessor.analyzeNews(message.text);

          // Создаем DTO
          const createNewsDto: CreateNewsDto = {
            telegramId: message.message_id,
            title: analysis.title,
            content: analysis.content,
            postDate: message.date.toISOString(),
            views: message.views || 0,
            imageUrl: message.imageUrl,
            hasMedia: message.hasMedia,
            tags: analysis.tags,
          };

          // Сохраняем в БД
          await this.newsService.create(createNewsDto);

          newCount++;
          this.lastSyncedMessageId = message.message_id;

          this.logger.log(`Saved news #${message.message_id}: ${analysis.title}`);
        } catch (error) {
          this.logger.error(`Error processing message ${message.message_id}:`, error.message);
        }
      }

      this.logger.log(`Sync completed. New messages: ${newCount}`);
      return newCount;
    } catch (error) {
      this.logger.error('Sync failed:', error.message);
      throw error;
    }
  }

  /**
   * Получить статус синхронизации
   */
  getSyncStatus() {
    return {
      lastSyncedMessageId: this.lastSyncedMessageId,
      isConfigured: this.telegramScraper.getIsConfigured(),
    };
  }

  /**
   * Сбросить lastSyncedMessageId для полной синхронизации
   */
  resetLastSyncedId() {
    this.lastSyncedMessageId = null;
    this.logger.log('Last synced message ID reset');
  }
}
