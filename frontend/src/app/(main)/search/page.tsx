'use client';

import { useEffect } from 'react';
import { SearchBar } from '@/components/search';
import { SearchResults } from '@/components/search';
import { initializeSearchIndex } from '@/mocks/search.mock';

/**
 * Страница поиска
 * 
 * Особенности:
 * - Инициализация поискового индекса при загрузке
 * - Поиск по всем типам контента
 * - Фильтрация по типу
 * - Горячие клавиши Ctrl+K
 */
export default function SearchPage() {
  // Инициализация поискового индекса
  useEffect(() => {
    initializeSearchIndex();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-[1400px]">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Поиск по сайту</h1>
        <p className="text-muted-foreground">
          Найдите нужную информацию среди новостей, секций, тренеров и документов
        </p>
      </div>

      {/* Строка поиска */}
      <div className="mb-8">
        <SearchBar
          autoSearch
          debounceMs={300}
          placeholder="Введите поисковый запрос..."
          size="lg"
        />
      </div>

      {/* Результаты */}
      <SearchResults
        onItemClick={(url) => {
          window.location.href = url;
        }}
      />
    </div>
  );
}
