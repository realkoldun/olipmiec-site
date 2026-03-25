import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TelegramScraperService } from './telegram-scraper.service';

describe('TelegramScraperService', () => {
  let service: TelegramScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [TelegramScraperService],
    }).compile();

    service = module.get<TelegramScraperService>(TelegramScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check if configured', () => {
    const isConfigured = service.getIsConfigured();
    expect(typeof isConfigured).toBe('boolean');
  });

  it('should get channel posts', async () => {
    if (service.getIsConfigured()) {
      const posts = await service.getChannelPosts(5);
      expect(Array.isArray(posts)).toBe(true);
      console.log('Received posts:', posts.length);
      posts.forEach((post, idx) => {
        console.log(`Post ${idx + 1}:`, {
          id: post.message_id,
          date: post.date,
          textPreview: post.text.substring(0, 50),
        });
      });
    } else {
      console.log('Telegram not configured, skipping test');
    }
  }, 15000);

  it('should check channel availability', async () => {
    const isAvailable = await service.checkChannelAvailability();
    console.log('Channel available:', isAvailable);
    expect(typeof isAvailable).toBe('boolean');
  }, 10000);

  it('should get channel info', async () => {
    if (service.getIsConfigured()) {
      const info = await service.getChannelInfo();
      console.log('Channel info:', info);
      expect(info).toBeDefined();
    }
  }, 10000);
});
