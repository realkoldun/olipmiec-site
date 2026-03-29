import { Controller, Get, Query, ParseIntPipe, Param, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsProcessorService } from '../ai/news-processor.service';

@Controller('api/news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly newsProcessor: NewsProcessorService,
  ) {}

  @Get()
  async getNews(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('category') category?: string,
    @Query('tags') tags?: string,
  ) {
    const tagsArray = tags ? tags.split(',').filter(Boolean) : [];
    const result = await this.newsService.findAll(page, limit, {
      category: category || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    });

    return {
      data: result.data.map((news) => ({
        id: news.id,
        telegramId: news.telegramId,
        title: news.title,
        content: news.content,
        summarizedContent: news.summarizedContent,
        imageUrl: news.imageUrl,
        videoUrl: news.videoUrl,
        hasMedia: news.hasMedia,
        postDate: news.postDate,
        views: news.views,
        tags: news.tags || [],
        category: news.category || null,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
      })),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    };
  }

  @Get('latest')
  async getLatestNews(@Query('limit', new ParseIntPipe({ optional: true })) limit = 5) {
    const news = await this.newsService.getLatest(limit);

    return news.map((n) => ({
      id: n.id,
      telegramId: n.telegramId,
      title: n.title,
      content: n.content,
      summarizedContent: n.summarizedContent,
      imageUrl: n.imageUrl,
      videoUrl: n.videoUrl,
      hasMedia: n.hasMedia,
      postDate: n.postDate,
      views: n.views,
      tags: n.tags || [],
      category: n.category || null,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));
  }

  @Get(':id')
  async getNewsById(@Param('id') id: string) {
    const news = await this.newsService.findOne(id);

    return {
      id: news.id,
      telegramId: news.telegramId,
      title: news.title,
      content: news.content,
      summarizedContent: news.summarizedContent,
      imageUrl: news.imageUrl,
      videoUrl: news.videoUrl,
      hasMedia: news.hasMedia,
      postDate: news.postDate,
      views: news.views,
      tags: news.tags || [],
      category: news.category || null,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    };
  }

  @Post(':id/summarize')
  @HttpCode(HttpStatus.OK)
  async summarizeNews(@Param('id') id: string, @Body('maxLength') maxLength?: number) {
    const news = await this.newsService.findOne(id);

    if (news.summarizedContent) {
      return {
        ok: true,
        summarizedText: news.summarizedContent,
        fromCache: true,
      };
    }

    const result = await this.newsProcessor.summarizeNews(news.content, maxLength || 500);
    await this.newsService.summarizeNews(id, result.summarizedText);

    return {
      ok: true,
      summarizedText: result.summarizedText,
      compressionRatio: result.compressionRatio,
      fromCache: false,
    };
  }
}
