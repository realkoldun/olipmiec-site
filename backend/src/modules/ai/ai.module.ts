import { Module } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { NewsProcessorService } from './news-processor.service';
import { AIController } from './ai.controller';

@Module({
  controllers: [AIController],
  providers: [OllamaService, NewsProcessorService],
  exports: [OllamaService, NewsProcessorService],
})
export class AIModule {}
