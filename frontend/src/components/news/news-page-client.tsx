'use client';

import { useRouter } from 'next/navigation';
import type { NewsItem } from '@/types/news';
import { NewsList } from '@/components/news/news-list';
import { Breadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs';
import { Button } from '@/components/ui/button/button';
import { SiteLayout } from '@/components/layout/site-layout';

export interface NewsPageClientProps {
  /** Новости для текущей страницы */
  news: NewsItem[];
  /** Текущая страница */
  page: number;
  /** Общее количество новостей */
  total: number;
  /** Общее количество страниц */
  totalPages: number;
  /** Текущая категория */
  category?: string;
}

/**
 * NewsPageClient — клиентский компонент страницы новостей
 * Пагинация на сервере через URL параметры
 */
export function NewsPageClient({
  news,
  page,
  total,
  totalPages,
  category,
}: NewsPageClientProps) {
  const router = useRouter();

  // Обработчик клика на новость
  const handleNewsClick = (id: string) => {
    router.push(`/news/${id}`);
  };

  // Обработчик изменения страницы — переход на сервер с новым page
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    if (category) params.set('category', category);
    router.push(`/news?${params.toString()}`);
  };

  // Обработчик изменения категории — переход на сервер с новым category
  const handleCategoryChange = (newCategory: string | undefined) => {
    const params = new URLSearchParams();
    params.set('page', '1'); // Сброс на первую страницу
    if (newCategory) params.set('category', newCategory);
    router.push(`/news?${params.toString()}`);
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
          {categories.map((cat) => (
            <Button
              key={String(cat.value)}
              variant={category === cat.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(cat.value)}
            >
              {cat.label}
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
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPagination={totalPages > 1}
        />
      </div>
    </SiteLayout>
  );
}
