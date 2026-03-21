'use client';

import { useNews } from '@/hooks/use-news';
import { NewsList } from '@/components/news/news-list';
import { Breadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs';
import { Button } from '@/components/ui/button/button';
import { SiteLayout } from '@/components/layout/site-layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Страница новостей — клиентский компонент с React Query
 */
export default function NewsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useNews(1, 6);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const news = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Обработчик клика на новость
  const handleNewsClick = (id: string) => {
    router.push(`/news/${id}`);
  };

  // Обработчик изменения страницы
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Категории для фильтра
  const categories = [
    { value: undefined, label: 'Все' },
    { value: 'sport', label: 'Спорт' },
    { value: 'announcement', label: 'Объявления' },
    { value: 'event', label: 'Мероприятия' },
    { value: 'news', label: 'Новости' },
  ];

  // Хлебные крошки
  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Новости', href: '/news' },
  ];

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-video bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (error) {
    return (
      <SiteLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center text-destructive">
            <h1 className="text-2xl font-bold mb-2">Ошибка загрузки</h1>
            <p>Не удалось загрузить новости. Попробуйте позже.</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-[1400px]">
        {/* Хлебные крошки */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Новости</h1>
          <p className="text-muted-foreground">Последние события и объявления школы</p>
        </div>

        {/* Фильтры по категории */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={String(category.value)}
              variant={selectedCategory === category.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.value);
                setCurrentPage(1);
              }}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Счетчик */}
        <div className="mb-4 text-sm text-muted-foreground">
          Найдено: {total} новостей
        </div>

        {/* Список новостей */}
        <NewsList
          news={news}
          onNewsClick={handleNewsClick}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPagination={totalPages > 1}
        />
      </div>
    </SiteLayout>
  );
}
