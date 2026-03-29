import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { NewsModule } from '../news/news.module';
import { News } from '../news/entities/news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News]), NewsModule],
  controllers: [SearchController],
  providers: [],
})
export class SearchModule {}
