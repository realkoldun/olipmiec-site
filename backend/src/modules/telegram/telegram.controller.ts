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
    };
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
