import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TelegramScraperService } from './telegram-scraper.service';
import { TelegramSyncService } from './telegram-sync.service';

/**
 * TelegramController - API для управления Telegram интеграцией (scraper)
 */
@Controller('api/telegram')
export class TelegramController {
  constructor(
    private readonly telegramScraper: TelegramScraperService,
    private readonly telegramSyncService: TelegramSyncService,
  ) {}

  /**
   * Проверка доступности канала
   * GET /api/telegram/health
   */
  @Get('health')
  async checkHealth() {
    const isAvailable = await this.telegramScraper.checkChannelAvailability();
    return {
      ok: isAvailable,
      message: isAvailable ? 'Channel is available' : 'Channel is not available',
      isConfigured: this.telegramScraper.getIsConfigured(),
      type: 'scraper', // Указываем, что используется скрапер, а не бот
    };
  }

  /**
   * Получить последние посты из канала (тест скрапера)
   * GET /api/telegram/test-scraper
   */
  @Get('test-scraper')
  async testScraper() {
    if (!this.telegramScraper.getIsConfigured()) {
      return {
        ok: false,
        message: 'Telegram scraper not configured. Check TELEGRAM_CHANNEL_ID in .env',
      };
    }

    try {
      const posts = await this.telegramScraper.getChannelPosts(5);
      return {
        ok: true,
        count: posts.length,
        posts: posts.map(p => ({
          id: p.message_id,
          date: p.date,
          title: p.text.substring(0, 100) + (p.text.length > 100 ? '...' : ''),
          hasMedia: p.hasMedia,
        })),
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  }

  /**
   * Получить статус синхронизации
   * GET /api/telegram/status
   */
  @Get('status')
  async getStatus() {
    return this.telegramSyncService.getSyncStatus();
  }

  /**
   * Запустить синхронизацию вручную
   * POST /api/telegram/sync
   */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async sync() {
    const count = await this.telegramSyncService.sync();
    return {
      ok: true,
      message: `Synchronized ${count} new messages`,
      count,
    };
  }

  /**
   * Получить информацию о канале
   * GET /api/telegram/channel
   */
  @Get('channel')
  async getChannelInfo() {
    const info = await this.telegramScraper.getChannelInfo();
    return {
      ok: !!info,
      data: info,
    };
  }
}
