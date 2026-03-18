/**
 * Типы для модуля мероприятий
 */

/**
 * Категория мероприятия
 */
export type EventCategory =
  | 'competition'    // Соревнования
  | 'training'       // Тренировки
  | 'holiday'        // Праздники
  | 'open-day'       // Дни открытых дверей
  | 'other';         // Другие

/**
 * Мероприятие
 */
export interface EventItem {
  /** Уникальный идентификатор */
  id: string;
  /** Название мероприятия */
  title: string;
  /** Описание */
  description: string;
  /** Краткое описание (анонс) */
  excerpt?: string;
  /** Изображение */
  image?: string;
  /** Дата начала */
  startDate: string;
  /** Дата окончания */
  endDate?: string;
  /** Время начала */
  startTime?: string;
  /** Место проведения */
  location?: string;
  /** Организатор */
  organizer?: string;
  /** Теги */
  tags: string[];
  /** Категория */
  category: EventCategory;
  /** Опубликовано */
  published: boolean;
  /** Количество участников */
  participants?: number;
  /** Максимальное количество участников */
  maxParticipants?: number;
  /** Регистрация открыта */
  registrationOpen?: boolean;
  /** Цена участия */
  price?: string;
  /** Контактная информация */
  contact?: string;
}

/**
 * Параметры для получения мероприятий
 */
export interface EventQuery {
  /** Номер страницы */
  page?: number;
  /** Количество на странице */
  limit?: number;
  /** Категория */
  category?: EventCategory;
  /** Тег */
  tag?: string;
  /** Только будущие */
  upcoming?: boolean;
  /** Сортировка */
  sortBy?: 'date' | 'title';
  /** Порядок */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Результат запроса мероприятий
 */
export interface EventResponse {
  /** Мероприятия */
  items: EventItem[];
  /** Общее количество */
  total: number;
  /** Текущая страница */
  page: number;
  /** Количество страниц */
  totalPages: number;
}
