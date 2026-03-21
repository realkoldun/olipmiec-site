import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramSyncService } from './telegram-sync.service';

/**
 * TelegramController - API для управления Telegram интеграцией
 */
@Controller('api/telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly telegramSyncService: TelegramSyncService,
  ) {}

  /**
   * Проверка доступности бота
   * GET /api/telegram/health
   */
  @Get('health')
  async checkHealth() {
    const isAvailable = await this.telegramService.checkBotAvailability();
    return {
      ok: isAvailable,
      message: isAvailable ? 'Bot is available' : 'Bot is not available',
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
    const info = await this.telegramService.getChannelInfo();
    return {
      ok: !!info,
      data: info,
    };
  }
}
