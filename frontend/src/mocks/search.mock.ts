import type { SearchIndexItem } from '@/types/search';
import { searchIndexService } from '@/services/search-index.service';
import { mockNews as newsMock } from './news.mock';
import { mockSections } from './sections.mock';
import { mockTrainers } from './trainers.mock';
import { mockDocuments } from './documents.mock';

/**
 * Конвертация новостей из news.mock в формат SearchIndexItem
 */
function convertNewsToSearchItems() {
  return newsMock.map((news) => ({
    id: news.id,
    type: 'news' as const,
    title: news.title,
    content: news.content,
    tags: news.tags,
    url: `/news/${news.id}`,
    createdAt: news.createdAt,
    excerpt: news.excerpt || news.content.slice(0, 100),
  }));
}

/**
 * Моковые данные для поиска
 */
const mockNews = convertNewsToSearchItems();

// Секции
export const mockSections: SearchIndexItem[] = [
  {
    id: 'section-1',
    type: 'section',
    title: 'Футбол',
    content: `
Футбольная секция для детей и подростков. Обучение технике удара, 
тактике игры, командному взаимодействию. Участие в городских и 
областных соревнованиях. Тренеры: Сергей Козлов, Дмитрий Иванов.
    `.trim(),
    tags: ['футбол', 'игровые виды', 'командный спорт'],
    url: '/sections/football',
    excerpt: 'Футбольная секция для детей и подростков...',
  },
  {
    id: 'section-2',
    type: 'section',
    title: 'Плавание',
    content: `
Секция плавания для всех возрастных групп. Обучение стилям: 
кроль, брасс, баттерфляй, на спине. Укрепление здоровья, 
развитие выносливости. Бассейн 25 метров.
    `.trim(),
    tags: ['плавание', 'бассейн', 'здоровье'],
    url: '/sections/swimming',
    excerpt: 'Секция плавания для всех возрастов...',
  },
  {
    id: 'section-3',
    type: 'section',
    title: 'Легкая атлетика',
    content: `
Секция легкой атлетики: бег на короткие и длинные дистанции, 
прыжки в высоту и длину, метание снарядов. Подготовка к 
соревнованиям различного уровня.
    `.trim(),
    tags: ['легкая атлетика', 'бег', 'прыжки', 'соревнования'],
    url: '/sections/athletics',
    excerpt: 'Секция легкой атлетики...',
  },
  {
    id: 'section-4',
    type: 'section',
    title: 'Баскетбол',
    content: `
Баскетбольная секция для мальчиков и девочек. Обучение технике 
ведения, броска, защиты. Командные тренировки и товарищеские 
матчи.
    `.trim(),
    tags: ['баскетбол', 'игровые виды', 'командный спорт'],
    url: '/sections/basketball',
    excerpt: 'Баскетбольная секция...',
  },
];

// Тренеры
export const mockTrainers: SearchIndexItem[] = [
  {
    id: 'trainer-1',
    type: 'trainer',
    title: 'Козлов Сергей Иванович — тренер по футболу',
    content: `
Главный тренер футбольной секции. Мастер спорта по футболу. 
Опыт работы 15 лет. Воспитанники: чемпионы области 2023, 2024. 
Образование: высшее, Витебский государственный университет.
    `.trim(),
    tags: ['футбол', 'тренер', 'мастер спорта'],
    url: '/trainers/kozlov',
    excerpt: 'Тренер по футболу, мастер спорта...',
  },
  {
    id: 'trainer-2',
    type: 'trainer',
    title: 'Сидорова Анна Петровна — тренер по плаванию',
    content: `
Тренер по плаванию высшей категории. Кандидат в мастера спорта. 
Опыт работы 10 лет. Специализация: обучение детей, спортивное 
плавание.
    `.trim(),
    tags: ['плавание', 'тренер', 'высшая категория'],
    url: '/trainers/sidorova',
    excerpt: 'Тренер по плаванию...',
  },
  {
    id: 'trainer-3',
    type: 'trainer',
    title: 'Иванов Дмитрий Александрович — тренер по легкой атлетике',
    content: `
Тренер по легкой атлетике. Мастер спорта международного класса. 
Опыт работы 20 лет. Подготовил более 50 кандидатов в мастера 
спорта.
    `.trim(),
    tags: ['легкая атлетика', 'тренер', 'мастер спорта'],
    url: '/trainers/ivanov',
    excerpt: 'Тренер по легкой атлетике...',
  },
];

// Документы
export const mockDocuments: SearchIndexItem[] = [
  {
    id: 'doc-1',
    type: 'document',
    title: 'Положение о секции футбола',
    content: `
Документ регламентирует правила приема в футбольную секцию, 
расписание занятий, требования к спортсменам, права и 
обязанности тренеров и воспитанников.
    `.trim(),
    tags: ['положение', 'футбол', 'документ', 'правила'],
    url: '/documents/football-regulations',
    excerpt: 'Положение о секции футбола...',
  },
  {
    id: 'doc-2',
    type: 'document',
    title: 'Расписание занятий на март 2025',
    content: `
Актуальное расписание тренировок всех секций СДЮШОР 
«Олимпиец» на март 2025 года. Время занятий, номера кабинетов 
и спортивных залов.
    `.trim(),
    tags: ['расписание', 'март', '2025', 'тренировки'],
    url: '/documents/schedule-march-2025',
    createdAt: '2025-03-01',
    excerpt: 'Расписание занятий на март 2025...',
  },
  {
    id: 'doc-3',
    type: 'document',
    title: 'Заявление на зачисление в секцию',
    content: `
Бланк заявления для зачисления ребенка в спортивную секцию. 
Необходимо заполнить и подать в администрацию школы вместе 
с медицинскими документами.
    `.trim(),
    tags: ['заявление', 'бланк', 'зачисление', 'документ'],
    url: '/documents/application-form',
    excerpt: 'Заявление на зачисление...',
  },
];

/**
 * Инициализация поискового индекса
 * Вызывается при запуске приложения
 */
export function initializeSearchIndex(): void {
  const allItems = [
    ...mockNews,
    ...mockSections,
    ...mockTrainers,
    ...mockDocuments,
  ];

  searchIndexService.indexMany(allItems);

  console.log('Поисковый индекс инициализирован:', {
    total: allItems.length,
    news: mockNews.length,
    sections: mockSections.length,
    trainers: mockTrainers.length,
    documents: mockDocuments.length,
  });
}
