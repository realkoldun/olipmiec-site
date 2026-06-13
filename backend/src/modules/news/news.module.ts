import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { ImageStorageService } from './image-storage.service';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([News]), AIModule],
  controllers: [NewsController],
  providers: [NewsService, ImageStorageService],
  exports: [NewsService, ImageStorageService],
})
export class NewsModule {}
