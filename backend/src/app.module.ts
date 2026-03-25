import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { TelegramModule } from './modules/telegram/telegram.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Scheduler
    ScheduleModule.forRoot(),

    // Feature modules
    TelegramModule,
    NewsModule,
  ],
})
export class AppModule {}
