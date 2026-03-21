import { Module } from '@nestjs/common';
import { TelegramScraperService } from '../telegram/telegram-scraper.service';
import { NewsController } from './news.controller';

@Module({
  controllers: [NewsController],
  providers: [TelegramScraperService],
  exports: [TelegramScraperService],
})
export class NewsModule {}
