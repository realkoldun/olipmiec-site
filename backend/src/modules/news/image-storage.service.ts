import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class ImageStorageService {
  private readonly logger = new Logger(ImageStorageService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const customDir = this.configService.get<string>('UPLOAD_DIR', '');
    this.uploadDir = customDir
      ? path.resolve(customDir)
      : path.resolve(process.cwd(), 'uploads', 'news');
    this.baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
    this.logger.log(`Image storage directory: ${this.uploadDir}`);
  }

  /**
   * Скачать изображение с Telegram и сохранить локально
   * @returns относительный путь сохранённого файла (например, uploads/news/uuid.jpg) или null при ошибке
   */
  async downloadAndSave(imageUrl: string): Promise<string | null> {
    if (!imageUrl) return null;

    try {
      await fs.mkdir(this.uploadDir, { recursive: true });

      const ext = this.getExtension(imageUrl);
      const filename = `${crypto.randomUUID()}${ext}`;
      const relativePath = `uploads/news/${filename}`;
      const filepath = path.join(this.uploadDir, filename);

      this.logger.debug(`Downloading image from ${imageUrl.substring(0, 100)}...`);

      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      await fs.writeFile(filepath, Buffer.from(response.data));

      this.logger.log(`Image saved locally: ${relativePath}`);
      return relativePath;
    } catch (error) {
      this.logger.error(
        `Failed to download image from ${imageUrl.substring(0, 80)}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Получить публичный URL для локального изображения
   */
  getPublicUrl(relativePath: string): string {
    return `${this.baseUrl}/${relativePath.replace(/\\/g, '/')}`;
  }

  /**
   * Удалить локальный файл изображения
   */
  async delete(localPath: string): Promise<void> {
    try {
      const filepath = path.resolve(process.cwd(), localPath);
      await fs.unlink(filepath);
      this.logger.debug(`Deleted image: ${localPath}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        this.logger.warn(`Failed to delete image ${localPath}: ${error.message}`);
      }
    }
  }

  private getExtension(url: string): string {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const match = cleanUrl.match(/\.(jpe?g|png|gif|webp|bmp|svg|jfif)/i);
    if (match) {
      const ext = match[1].toLowerCase();
      return ext === 'jpeg' ? '.jpg' : `.${ext}`;
    }
    return '.jpg';
  }
}