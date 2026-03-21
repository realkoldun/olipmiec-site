import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto, NewsResponseDto } from './dto/news.dto';

/**
 * NewsController - REST API для управления новостями
 */
@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * Получить все новости с пагинацией
   * GET /api/news?page=1&limit=10
   */
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.newsService.findAll(page, limit);
  }

  /**
   * Получить последние новости
   * GET /api/news/latest?limit=5
   */
  @Get('latest')
  async getLatest(@Query('limit', new ParseIntPipe({ optional: true })) limit = 5) {
    return this.newsService.getLatest(limit);
  }

  /**
   * Получить новость по ID
   * GET /api/news/:id
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const news = await this.newsService.findOne(id);
    await this.newsService.incrementViews(id);
    return news;
  }

  /**
   * Создать новость
   * POST /api/news
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  /**
   * Обновить новость
   * PUT /api/news/:id
   */
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.newsService.update(id, updateNewsDto);
  }

  /**
   * Удалить новость
   * DELETE /api/news/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.newsService.remove(id);
  }
}
