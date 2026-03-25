import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean, IsArray } from 'class-validator';

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
  createdAt: Date;
  updatedAt: Date;
}
