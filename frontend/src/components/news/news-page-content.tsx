'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NewsApiResponse } from '@/services/api';
import { NewsList } from '@/components/news/news-list';
import { Breadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs';
import { Button } from '@/components/ui/button/button';
import { SiteLayout } from '@/components/layout/site-layout';

export interface NewsPageContentProps {
  initialData?: NewsApiResponse;
}

/**
 * NewsPageContent — компонент страницы новостей
 * Работает с данными от API через React Query
 */
export function NewsPageContent({ initialData }: NewsPageContentProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialData?.page || 1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  // Используем данные из API или моковые (если API недоступно)
  const news = initialData?.data || [];
  const total = initialData?.total || 0;
  const totalPages = initialData?.totalPages || 1;

  // Обработчик клика на новость
  const handleNewsClick = (id: string) => {
    router.push(`/news/${id}`);
  };

  // Обработчик изменения страницы
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // В реальной реализации здесь будет вызов API или роутинг
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Категории для фильтра (пока без фильтрации на бэкенде)
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
