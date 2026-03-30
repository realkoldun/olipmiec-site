'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Eye, ArrowLeft, Wand2, Check } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import type { NewsItem } from '@/types/news';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/utils/cn';
import { Breadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs';
import { useTextSummarizer } from '@/hooks/use-text-summarizer';

export interface NewsDetailPageClientProps {
  news: NewsItem & {
    imageUrl?: string;
    telegramId?: number;
    hasMedia?: boolean;
    postDate?: string;
    summarizedContent?: string;
  };
}

export function NewsDetailPageClient({ news }: NewsDetailPageClientProps) {
  const router = useRouter();
  const { result, isSummarizing, summarize } = useTextSummarizer();
  const [showSummarized, setShowSummarized] = useState(false);
  const [hasUserToggled, setHasUserToggled] = useState(false);

  const adaptedNews = {
    ...news,
    image: news.imageUrl || news.image,
    excerpt: news.excerpt || news.content?.substring(0, 200) + '...',
    tags: news.tags || [],
    category: news.category || undefined,
    published: news.published ?? true,
  };

  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Новости', href: '/news' },
    { label: adaptedNews.title, href: `/news/${adaptedNews.id}` },
  ];

  const handleSummarize = useCallback(() => {
    if (result?.summarizedText) {
      setShowSummarized(!showSummarized);
      setHasUserToggled(true);
      return;
    }
    summarize(adaptedNews.content);
  }, [adaptedNews.content, result, showSummarized, summarize]);

  const displayContent = showSummarized && result?.summarizedText ? result.summarizedText : adaptedNews.content;
  const hasSummarized = !!result?.summarizedText;

  useEffect(() => {
    if (hasSummarized && !hasUserToggled) {
      setShowSummarized(true);
    }
  }, [hasSummarized, hasUserToggled]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-[1400px]">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <article className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
            {adaptedNews.title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(adaptedNews.postDate || adaptedNews.createdAt)}</span>
            </div>

            {adaptedNews.views !== undefined && (
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{adaptedNews.views} просмотров</span>
              </div>
            )}
          </div>

          {adaptedNews.image && (
            <figure className="mb-8">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={adaptedNews.image}
                  alt={adaptedNews.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  className="rounded-lg object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </figure>
          )}

          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSummarize}
              disabled={isSummarizing}
              className={cn(
                hasSummarized && 'border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950',
                isSummarizing && 'animate-pulse'
              )}
            >
              {isSummarizing ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Сокращаем...
                </>
              ) : hasSummarized ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {showSummarized ? 'Показать оригинал' : 'Показать сокращённую версию'}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Сократить текст
                </>
              )}
            </Button>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            {displayContent?.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {adaptedNews.tags && adaptedNews.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
              {adaptedNews.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
