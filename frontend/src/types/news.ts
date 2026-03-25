/**
 * Типы для модуля новостей
 */

/**
 * Категория новости
 */
export type NewsCategory = 'sport' | 'announcement' | 'event' | 'news';

/**
 * Новость
 */
export interface NewsItem {
  /** Уникальный идентификатор */
  id: string;
  /** Заголовок */
  title: string;
  /** Содержимое */
  content: string;
  /** Краткое описание (анонс) */
  excerpt?: string;
  /** Изображение */
  image?: string;
  /** Автор */
  author?: string;
  /** Дата создания */
  createdAt: string;
  /** Дата обновления */
  updatedAt?: string;
  /** Теги */
  tags: string[];
  /** Категория */
  category?: NewsCategory;
  /** Опубликовано */
  published: boolean;
  /** Количество просмотров */
  views?: number;
}

/**
 * Параметры для получения новостей
 */
export interface NewsQuery {
  /** Номер страницы */
  page?: number;
  /** Количество на странице */
  limit?: number;
  /** Категория */
  category?: string;
  /** Тег */
  tag?: string;
  /** Сортировка */
  sortBy?: 'date' | 'title' | 'views';
  /** Порядок */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Результат запроса новостей
 */
export interface NewsResponse {
  /** Новости */
  items: NewsItem[];
  /** Общее количество */
  total: number;
  /** Текущая страница */
  page: number;
  /** Количество страниц */
  totalPages: number;
}
