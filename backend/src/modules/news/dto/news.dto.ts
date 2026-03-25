import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { NewsCategory } from '../entities/news.entity';

export class CreateNewsDto {
  @IsNumber()
  telegramId: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsBoolean()
  hasMedia?: boolean;

  @IsDateString()
  postDate: string;

  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(NewsCategory)
  category?: NewsCategory;
}

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsBoolean()
  hasMedia?: boolean;

  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(NewsCategory)
  category?: NewsCategory;
}

export class NewsResponseDto {
  id: string;
  telegramId: number;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  hasMedia: boolean;
  postDate: Date;
  views: number;
  tags: string[];
  category?: NewsCategory;
  createdAt: Date;
  updatedAt: Date;
}
