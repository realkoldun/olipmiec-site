import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';

/**
 * NewsService - сервис для работы с новостями
 * Реализует паттерн Repository
 */
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  /**
   * Создать новость
   */
  async create(createNewsDto: CreateNewsDto): Promise<News> {
    try {
      const news = this.newsRepository.create(createNewsDto);
      return await this.newsRepository.save(news);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation
        throw new ConflictException('News with this telegramId already exists');
      }
      throw error;
    }
  }

  /**
   * Найти новость по ID
   */
  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  /**
   * Найти новость по Telegram ID
   */
  async findOneByTelegramId(telegramId: number): Promise<News | null> {
    return await this.newsRepository.findOne({ where: { telegramId } });
  }

  /**
   * Проверить существует ли новость с таким telegramId
   */
  async existsByTelegramId(telegramId: number): Promise<boolean> {
    const count = await this.newsRepository.count({ where: { telegramId } });
    return count > 0;
  }

  /**
   * Получить все новости с пагинацией и фильтрацией
   */
  async findAll(page = 1, limit = 10, filters?: { category?: string; tags?: string[] }): Promise<{ data: News[]; total: number; page: number; totalPages: number }> {
    const where: any = {};

    // Фильтр по категории
    if (filters?.category) {
      where.category = filters.category;
    }

    // Фильтр по тегам (contains - массив содержит все указанные теги)
    if (filters?.tags && filters.tags.length > 0) {
      where.tags = { type: 'contains', value: filters.tags };
    }

    const [data, total] = await this.newsRepository.findAndCount({
      where,
      order: { postDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Обновить новость
   */
  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);
    Object.assign(news, updateNewsDto);
    return await this.newsRepository.save(news);
  }

  /**
   * Удалить новость
   */
  async remove(id: string): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);
  }

  /**
   * Получить последние новости
   */
  async getLatest(limit = 5): Promise<News[]> {
    return await this.newsRepository.find({
      order: { postDate: 'DESC' },
      take: limit,
    });
  }

  /**
   * Увеличить счетчик просмотров
   */
  async incrementViews(id: string): Promise<News> {
    const news = await this.findOne(id);
    news.views += 1;
    return await this.newsRepository.save(news);
  }
}
