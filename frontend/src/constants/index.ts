/**
 * Основные константы приложения
 * Централизованное хранилище всех конфигурационных значений
 */

// ============================================================================
// ИНФОРМАЦИЯ О САЙТЕ
// ============================================================================

export const SITE_INFO = {
  name: 'СДЮШОР "Олимпиец"',
  shortName: 'Олимпиец',
  description: 'Спортивная школа олимпийского резерва',
  emoji: '🏆',
  foundingYear: 1976,
} as const;

// ============================================================================
// КОНТАКТНАЯ ИНФОРМАЦИЯ
// ============================================================================

export const CONTACTS = {
  name: 'СДЮШОР "Олимпиец"',
  address: 'г. Витебск, ул. Спортивная, 1',
  phone: '+375 (212) XX-XX-XX',
  email: 'info@olimpiyec.by',
  hours: 'Пн-Пт: 9:00 - 18:00',
} as const;

// ============================================================================
// НАВИГАЦИЯ
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

/** Основная навигация в header */
export const MAIN_NAVIGATION: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Новости', href: '/news', description: 'Последние события школы' },
  { label: 'Секции', href: '/sections', description: 'Спортивные секции' },
  { label: 'Руководство', href: '/management', description: 'Руководящий состав' },
  { label: 'Почётная доска', href: '/honor-board', description: 'Наши достижения' },
  { label: 'Документы', href: '/documents', description: 'Официальные документы' },
  { label: 'Контакты', href: '/contacts' },
];

/** Навигация в footer */
export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Навигация',
    links: [
      { label: 'Главная', href: '/' },
      { label: 'Новости', href: '/news' },
      { label: 'Секции', href: '/sections' },
      { label: 'Руководство', href: '/management' },
    ],
  },
  {
    title: 'Информация',
    links: [
      { label: 'Документы', href: '/documents' },
      { label: 'Почётная доска', href: '/honor-board' },
      { label: 'Контакты', href: '/contacts' },
    ],
  },
  {
    title: 'Секции',
    links: [
      { label: 'Футбол', href: '/sections/football' },
      { label: 'Баскетбол', href: '/sections/basketball' },
      { label: 'Волейбол', href: '/sections/volleyball' },
      { label: 'Плавание', href: '/sections/swimming' },
    ],
  },
];

// ============================================================================
// API КОНФИГУРАЦИЯ
// ============================================================================

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// ============================================================================
// ПАГИНАЦИЯ
// ============================================================================

export const PAGINATION = {
  /** Количество новостей на странице по умолчанию */
  defaultPageSize: 10,
  /** Минимальный размер страницы */
  minPageSize: 5,
  /** Максимальный размер страницы */
  maxPageSize: 50,
  /** Количество новостей на главной странице */
  homePageSize: 6,
  /** Количество последних новостей для виджета */
  latestNewsLimit: 5,
} as const;

// ============================================================================
// ПОИСК
// ============================================================================

export const SEARCH_CONFIG = {
  /** Минимальная длина поискового запроса */
  minQueryLength: 2,
  /** Максимальная длина поискового запроса */
  maxQueryLength: 100,
  /** Количество результатов по умолчанию */
  defaultLimit: 20,
  /** Максимальное количество результатов */
  maxLimit: 100,
  /** Время задержки перед поиском (ms) */
  debounceMs: 300,
} as const;

export type SearchItemType = 'news' | 'section' | 'trainer' | 'document' | 'all';

export const SEARCH_ITEM_TYPES: SearchItemType[] = ['news', 'section', 'trainer', 'document'];

// ============================================================================
// ДОСТУПНОСТЬ
// ============================================================================

export type ContrastMode = 'normal' | 'high' | 'dark';

export const ACCESSIBILITY_DEFAULTS = {
  /** Базовый размер шрифта (px) */
  fontSize: 14,
  /** Минимальный размер шрифта (px) */
  minFontSize: 12,
  /** Максимальный размер шрифта (px) */
  maxFontSize: 24,
  /** Масштаб текста по умолчанию */
  fontScale: 1,
  /** Минимальный масштаб текста */
  minFontScale: 0.8,
  /** Максимальный масштаб текста */
  maxFontScale: 2,
  /** Режим контраста по умолчанию */
  contrast: 'normal' as ContrastMode,
  /** Масштаб страницы по умолчанию */
  zoom: 1,
  /** Минимальный масштаб страницы */
  minZoom: 1,
  /** Максимальный масштаб страницы */
  maxZoom: 3,
  /** Лупа включена по умолчанию */
  magnifierEnabled: false,
  /** Увеличение лупы по умолчанию */
  magnifierZoom: 3,
  /** Минимальное увеличение лупы */
  minMagnifierZoom: 2,
  /** Максимальное увеличение лупы */
  maxMagnifierZoom: 10,
  /** Озвучка включена по умолчанию */
  voiceEnabled: false,
  /** Скорость озвучки по умолчанию */
  voiceRate: 1,
  /** Минимальная скорость озвучки */
  minVoiceRate: 0.5,
  /** Максимальная скорость озвучки */
  maxVoiceRate: 2,
} as const;

// ============================================================================
// ТЕМЫ
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';

export const THEME_CONFIG = {
  /** Тема по умолчанию */
  default: 'system' as Theme,
  /** Ключ для хранения в localStorage */
  storageKey: 'theme',
} as const;

// ============================================================================
// КЭШИРОВАНИЕ (React Query)
// ============================================================================

export const CACHE_CONFIG = {
  /** Время актуальности данных (ms) */
  staleTime: 5 * 60 * 1000, // 5 минут
  /** Время жизни в кэше (ms) */
  gcTime: 30 * 60 * 1000, // 30 минут
  /** Количество повторных попыток */
  retries: 3,
  /** Задержка между попытками (ms) */
  retryDelay: 1000,
} as const;

// ============================================================================
// МЕДИА
// ============================================================================

export const MEDIA_CONFIG = {
  /** Брейкпоинты (px) */
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1400,
  },
  /** Максимальная ширина контейнера (px) */
  maxContainerWidth: 1400,
  /** Высота header (px) */
  headerHeight: 64,
} as const;

// ============================================================================
// TELEGRAM (для синхронизации новостей)
// ============================================================================

export const TELEGRAM_CONFIG = {
  /** Количество сообщений для синхронизации за один раз */
  syncLimit: 100,
  /** Максимальное количество страниц для парсинга */
  maxPages: 10,
  /** Интервал автоматической синхронизации (секунды) */
  syncInterval: 300,
} as const;

// ============================================================================
// УТИЛИТЫ
// ============================================================================

/** Получить текущий год для footer */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/** Получить год основания школы */
export function getFoundingYear(): number {
  return SITE_INFO.foundingYear;
}

/** Рассчитать количество лет существования школы */
export function getSchoolAge(): number {
  return getCurrentYear() - SITE_INFO.foundingYear;
}
