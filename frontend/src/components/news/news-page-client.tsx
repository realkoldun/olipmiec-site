'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { NewsItem } from '@/types/news';
import { NewsList } from '@/components/news/news-list';
import { Breadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs';
import { Button } from '@/components/ui/button/button';
import { SiteLayout } from '@/components/layout/site-layout';

export interface NewsPageClientProps {
  /** Все новости для фильтрации на клиенте */
  allNews: NewsItem[];
}

/**
 * NewsPageClient — клиентский компонент страницы новостей
 * Фильтрация и пагинация на клиенте
 */
export function NewsPageClient({ allNews }: NewsPageClientProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const itemsPerPage = 6;

  // Фильтрация новостей по категории
  const filteredNews = useMemo(() => {
    if (!selectedCategory) return allNews;
    return allNews.filter((news) => news.category === selectedCategory);
  }, [allNews, selectedCategory]);

  // Пагинация
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredNews.slice(start, end);
  }, [filteredNews, currentPage]);

  // Общее количество страниц для текущей категории
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  // Обработчик клика на новость
  const handleNewsClick = (id: string) => {
    router.push(`/news/${id}`);
  };

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Обработчик изменения категории
  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Сброс на первую страницу при смене категории
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
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Счетчик */}
        <div className="mb-4 text-sm text-muted-foreground">
          Найдено: {filteredNews.length} новостей
        </div>

        {/* Список новостей */}
        <NewsList
          news={paginatedNews}
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
