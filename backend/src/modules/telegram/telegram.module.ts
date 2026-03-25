import { Module } from '@nestjs/common';
import { TelegramScraperService } from './telegram-scraper.service';
import { TelegramSyncService } from './telegram-sync.service';
import { TelegramController } from './telegram.controller';
import { NewsModule } from '../news/news.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [NewsModule, AIModule],
  controllers: [TelegramController],
  providers: [TelegramScraperService, TelegramSyncService],
  exports: [TelegramScraperService],
})
export class TelegramModule {}
