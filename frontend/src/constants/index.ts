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
  address: '210029, г. Витебск, ул. Офицерская, 2-6',
  phone: '8 (0212) 66 93 96',
  fax: '8(0212) 66 93 96',
  email: 'olimpiets2013@yandex.by',
  unp: '390417394',
  hours: 'Пн-Пт: 9:00 - 18:00',
  founder: 'Федерация профсоюзов Беларуси',
  coordinates: {
    lat: 55.180037,
    lon: 30.223348,
  },
} as const;

// ============================================================================
// НАВИГАЦИЯ
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

/**
 * Данные члена руководства
 */
export interface LeadershipMember {
  name: string;
  position: string;
  phone?: string;
  reception?: string;
  address: string;
  room?: string;
  image?: string;
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
  { label: 'Услуги', href: '/sections', description: 'Спортивные услуги' },
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
      { label: 'Услуги', href: '/sections' },
      { label: 'Руководство', href: '/management' },
    ],
  },
];

// ============================================================================
// РУКОВОДСТВО
// ============================================================================

export const LEADERSHIP_DATA: LeadershipMember[] = [
  {
    name: 'Безлюдов Дмитрий Альбертович',
    position: 'Директор',
    phone: '8 (0212) 66 93 96',
    reception: 'вторник 9.00-11.00, пятница 14.00-16.00',
    address: 'г. Витебск, ул. Офицерская, д. 2, ком. 6',
    room: '6',
    image: 'https://sportfpb.by/upload/iblock/281/o41eibjan0q4v3kbtnj95owhcgbrdlcg.jpg',
  },
  {
    name: 'Китаева Ирина Викторовна',
    position: 'Заместитель директора по основной деятельности',
    phone: '8 (0212) 66 93 96',
    reception: 'понедельник 14.00-16.00, четверг 9.00-11.00',
    address: 'г. Витебск, ул. Офицерская, д. 2, ком. 6',
    room: '6',
    image: 'https://sportfpb.by/upload/iblock/dcf/ren4qyg00vmnvdzqpam01fjjfhtc5fwq.jpg',
  },
  {
    name: 'Вишнякова Ольга Алексеевна',
    position: 'Главный бухгалтер',
    phone: '',
    reception: '',
    address: 'г. Витебск, ул. Офицерская, д. 2',
    room: '',
    image: 'https://sportfpb.by/upload/iblock/133/o0vm06qdl20z85ezl6somo41cnhdhk24.jpg',
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

// ============================================================================
// УСЛУГИ (СЕКЦИИ)
// ============================================================================

export interface PriceItem {
  name: string;
  description: string;
  price: string;
}

export interface Service {
  title: string;
  description: string;
  icon: 'truck' | 'timer';
  prices: PriceItem[];
}

export const SERVICES_DATA: Service[] = [
  {
    title: 'Транспортные перевозки микроавтобусом МАЗ 281040',
    description: '16 пассажирских мест',
    icon: 'truck',
    prices: [
      {
        name: 'Работа микроавтобуса с водителем',
        description: '1 час',
        price: '31,95 руб.',
      },
      {
        name: 'Простой микроавтобуса с водителем',
        description: '1 час',
        price: '21,78 руб.',
      },
      {
        name: '1 км затрат с заправкой топливом',
        description: '1 км',
        price: '0,59 руб.',
      },
      {
        name: '1 км затрат без заправки топливом',
        description: '1 км',
        price: '0,06 руб.',
      },
    ],
  },
  {
    title: 'Транспортные перевозки грузопассажирским автомобилем ГАЗ 330023',
    description: 'Грузоподъемность 3,5 тонны, 4 пассажирских места',
    icon: 'truck',
    prices: [
      {
        name: 'Работа автомобиля с водителем',
        description: '1 час',
        price: '21,87 руб.',
      },
      {
        name: 'Простой автомобиля с водителем',
        description: '1 час',
        price: '15,02 руб.',
      },
      {
        name: '1 км с заправкой топливом',
        description: '1 км',
        price: '0,61 руб.',
      },
      {
        name: '1 км без заправки топливом',
        description: '1 км',
        price: '0,03 руб.',
      },
    ],
  },
  {
    title: 'Обеспечение хронометража соревнований',
    description: 'Электронная система «Старт-финиш»',
    icon: 'timer',
    prices: [
      {
        name: 'Обеспечение хронометража соревнований',
        description: 'по биатлону, лыжным гонкам, велоспорту, легкой атлетике',
        price: '15 руб./час',
      },
    ],
  },
];
