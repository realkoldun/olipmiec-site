import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { TelegramScraperService } from '../telegram/telegram-scraper.service';

/**
 * NewsController - REST API для получения новостей напрямую из Telegram
 */
@Controller('api/news')
export class NewsController {
  constructor(private readonly telegramScraper: TelegramScraperService) {}

  /**
   * Получить новости напрямую из Telegram
   * GET /api/news?page=1&limit=10
   */
  @Get()
  async getNews(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    // Получаем новости напрямую из Telegram
    const messages = await this.telegramScraper.getChannelPosts(limit * 3); // Берём с запасом

    // Преобразуем в формат NewsItem
    const news = messages.map((message) => {
      const { title, content } = this.telegramScraper.parseMessageText(message);
      
      return {
        id: message.message_id.toString(),
        telegramId: message.message_id,
        title,
        content,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        hasMedia: message.hasMedia,
        postDate: message.date,
        views: message.views || 0,
        createdAt: message.date,
        updatedAt: message.date,
      };
    });

    // Пагинация
    const total = news.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedNews = news.slice(start, end);

    return {
      data: paginatedNews,
      total,
      page,
      totalPages,
    };
  }

  /**
   * Получить последние новости напрямую из Telegram
   * GET /api/news/latest?limit=5
   */
  @Get('latest')
  async getLatestNews(@Query('limit', new ParseIntPipe({ optional: true })) limit = 5) {
    const messages = await this.telegramScraper.getChannelPosts(limit);

    return messages.map((message) => {
      const { title, content } = this.telegramScraper.parseMessageText(message);
      
      return {
        id: message.message_id.toString(),
        telegramId: message.message_id,
        title,
        content,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        hasMedia: message.hasMedia,
        postDate: message.date,
        views: message.views || 0,
        createdAt: message.date,
        updatedAt: message.date,
      };
    });
  }

  /**
   * Получить новость по ID напрямую из Telegram
   * GET /api/news/:id
   */
  @Get(':id')
  async getNewsById() {
    // Для получения конкретной новости нужно парсить весь канал
    // Это неэффективно, поэтому возвращаем ошибку
    return {
      error: 'Direct news fetch by ID is not supported. Use /api/news endpoint.',
    };
  }
}
