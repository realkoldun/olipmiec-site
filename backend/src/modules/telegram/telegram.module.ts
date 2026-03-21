import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramSyncService } from './telegram-sync.service';
import { TelegramController } from './telegram.controller';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [NewsModule],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramSyncService],
  exports: [TelegramService],
})
export class TelegramModule {}
