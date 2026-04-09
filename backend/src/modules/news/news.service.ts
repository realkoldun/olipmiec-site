import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    try {
      const news = this.newsRepository.create(createNewsDto);
      return await this.newsRepository.save(news);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('News with this telegramId already exists');
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async findOneByTelegramId(telegramId: number): Promise<News | null> {
    return await this.newsRepository.findOne({ where: { telegramId } });
  }

  async existsByTelegramId(telegramId: number): Promise<boolean> {
    const count = await this.newsRepository.count({ where: { telegramId } });
    return count > 0;
  }

  async findAll(page = 1, limit = 10, filters?: { category?: string; tags?: string[] }): Promise<{ data: News[]; total: number; page: number; totalPages: number }> {
    const queryBuilder = this.newsRepository.createQueryBuilder('news');

    if (filters?.category) {
      queryBuilder.andWhere('news.category = :category', { category: filters.category });
    }

    if (filters?.tags && filters.tags.length > 0) {
      // Для PostgreSQL массивов используем оператор '@>' (contains)
      queryBuilder.andWhere('news.tags @> :tags', { tags: filters.tags });
    }

    queryBuilder.orderBy('news.postDate', 'DESC');
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);
    Object.assign(news, updateNewsDto);
    return await this.newsRepository.save(news);
  }

  async remove(id: string): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);
  }

  async getLatest(limit = 5): Promise<News[]> {
    return await this.newsRepository.find({
      order: { postDate: 'DESC' },
      take: limit,
    });
  }

  async incrementViews(id: string): Promise<News> {
    const news = await this.findOne(id);
    news.views += 1;
    return await this.newsRepository.save(news);
  }

  async summarizeNews(id: string, summarizedContent: string): Promise<News> {
    const news = await this.findOne(id);
    news.summarizedContent = summarizedContent;
    return await this.newsRepository.save(news);
  }
}
