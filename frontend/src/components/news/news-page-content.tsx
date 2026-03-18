'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewsList } from '@/components/news/news-list';
import { getNews } from '@/mocks/news.mock';
import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';
import { Breadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs';
import { Button } from '@/components/ui/button/button';

/**
 * NewsPageContent — компонент страницы новостей
 *
 * Использует layout компоненты:
 * - Header
 * - Footer
 * - Breadcrumbs
 *
 * И UI компоненты:
 * - Button
 */
export function NewsPageContent() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const itemsPerPage = 6;

  // Получение новостей
  const { items: news, total, totalPages } = getNews({
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategory,
  });

  // Обработчик клика на новость
  const handleNewsClick = (id: string) => {
    router.push(`/news/${id}`);
  };

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Основной контент */}
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-[1400px]">
          {/* Хлебные крошки */}
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />

          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Новости</h1>
            <p className="text-muted-foreground">
              Последние события и объявления школы
            </p>
          </div>

          {/* Фильтры по категории */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={String(category.value)}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
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
            showPagination={true}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
