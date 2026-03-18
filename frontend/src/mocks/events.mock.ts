import type { EventItem } from '@/types/event';

/**
 * Генерация URL тестового изображения
 * Использует placehold.co для заглушек с текстом
 * Работает в Беларуси без ограничений
 */
function getTestImage(width: number, height: number, text: string): string {
  const encodedText = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}/10b981/ffffff?text=${encodedText}&font=roboto`;
}

/**
 * Моковые данные для мероприятий
 */
export const mockEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'Областные соревнования по легкой атлетике',
    description: `
Приглашаем всех желающих посетить областные соревнования по 
легкой атлетике среди юношей и девушек.

В программе:
- Бег на 100, 200, 400 метров
- Бег на средние дистанции (800, 1500 метров)
- Прыжки в высоту и длину
- Метание мяча

Вход свободный!
    `.trim(),
    excerpt: 'Областные соревнования по легкой атлетике среди юношей и девушек',
    image: getTestImage(800, 450, 'Легкая атлетика'),
    startDate: '2025-04-15',
    endDate: '2025-04-17',
    startTime: '10:00',
    location: 'Стадион "Олимпиец", ул. Спортивная 1',
    organizer: 'СДЮШОР "Олимпиец"',
    tags: ['соревнования', 'легкая атлетика', 'областные'],
    category: 'competition',
    published: true,
    participants: 150,
    maxParticipants: 200,
    registrationOpen: true,
    price: 'Бесплатно',
    contact: '+375 (212) 12-34-56',
  },
  {
    id: 'event-2',
    title: 'День открытых дверей',
    description: `
Приглашаем детей и родителей посетить День открытых дверей в 
СДЮШОР "Олимпиец".

В программе:
- Знакомство с тренерами
- Посещение тренировок
- Экскурсия по спортивным залам
- Консультации по расписанию занятий
- Помощь в оформлении документов

Приходите, будем рады видеть вас!
    `.trim(),
    excerpt: 'Приглашаем на День открытых дверей!',
    image: getTestImage(800, 450, 'День открытых дверей'),
    startDate: '2025-03-25',
    startTime: '10:00',
    location: 'СДЮШОР "Олимпиец", ул. Спортивная 1',
    organizer: 'Администрация школы',
    tags: ['день открытых дверей', 'мероприятие', 'знакомство'],
    category: 'open-day',
    published: true,
    participants: 0,
    registrationOpen: false,
    price: 'Бесплатно',
    contact: '+375 (212) 12-34-56',
  },
  {
    id: 'event-3',
    title: 'Городской турнир по футболу',
    description: `
Ежегодный городской турнир по футболу среди детских команд.

Возрастные категории:
- 2015-2016 г.р.
- 2017-2018 г.р.
- 2019-2020 г.р.

Победители награждаются кубками и медалями!
    `.trim(),
    excerpt: 'Городской турнир по футболу среди детских команд',
    image: getTestImage(800, 450, 'Футбольный турнир'),
    startDate: '2025-05-01',
    endDate: '2025-05-03',
    startTime: '09:00',
    location: 'Стадион "Олимпиец", поле №1',
    organizer: 'Федерация футбола г. Витебска',
    tags: ['футбол', 'турнир', 'городской', 'дети'],
    category: 'competition',
    published: true,
    participants: 120,
    maxParticipants: 150,
    registrationOpen: true,
    price: 'Бесплатно',
    contact: 'football@olympic.by',
  },
  {
    id: 'event-4',
    title: 'Тренировочный сбор по плаванию',
    description: `
Учебно-тренировочный сбор для спортсменов разрядников.

Программа сбора:
- Утренняя тренировка (ОФП)
- Тренировка в бассейне
- Видеоанализ техники
- Лекции по тактике плавания

Тренер: Елена Сидорова, КМС по плаванию
    `.trim(),
    excerpt: 'Учебно-тренировочный сбор для спортсменов-разрядников',
    image: getTestImage(800, 450, 'Плавание'),
    startDate: '2025-06-01',
    endDate: '2025-06-14',
    startTime: '08:00',
    location: 'Бассейн "Олимпиец"',
    organizer: 'СДЮШОР "Олимпиец"',
    tags: ['плавание', 'тренировка', 'сбор', 'разрядники'],
    category: 'training',
    published: true,
    participants: 25,
    maxParticipants: 30,
    registrationOpen: true,
    price: '50 BYN',
    contact: 'swimming@olympic.by',
  },
  {
    id: 'event-5',
    title: 'Праздник "Мама, папа, я — спортивная семья!"',
    description: `
Семейный спортивный праздник для детей и родителей.

В программе:
- Веселые старты
- Эстафеты
- Конкурсы
- Награждение призами

Приходите всей семьей!
    `.trim(),
    excerpt: 'Семейный спортивный праздник',
    image: getTestImage(800, 450, 'Семейный праздник'),
    startDate: '2025-06-08',
    startTime: '12:00',
    location: 'Спортзал "Олимпиец"',
    organizer: 'СДЮШОР "Олимпиец"',
    tags: ['праздник', 'семья', 'веселые старты', 'дети'],
    category: 'holiday',
    published: true,
    participants: 0,
    maxParticipants: 50,
    registrationOpen: true,
    price: 'Бесплатно',
    contact: '+375 (212) 12-34-56',
  },
  {
    id: 'event-6',
    title: 'Мастер-класс по баскетболу от профессионалов',
    description: `
Уникальная возможность посетить мастер-класс от игроков 
профессиональной баскетбольной команды.

В программе:
- Отработка техники броска
- Работа с мячом
- Тактические упражнения
- Автограф-сессия

Тренеры: игроки БК "Витебск"
    `.trim(),
    excerpt: 'Мастер-класс от игроков БК "Витебск"',
    image: getTestImage(800, 450, 'Баскетбол'),
    startDate: '2025-04-20',
    startTime: '14:00',
    location: 'Баскетбольный зал "Олимпиец"',
    organizer: 'БК "Витебск" совместно с СДЮШОР "Олимпиец"',
    tags: ['баскетбол', 'мастер-класс', 'профессионалы'],
    category: 'training',
    published: true,
    participants: 0,
    maxParticipants: 40,
    registrationOpen: true,
    price: '15 BYN',
    contact: 'basketball@olympic.by',
  },
];

/**
 * Получить мероприятия с фильтрацией
 */
export function getEvents({
  category,
  tag,
  upcoming = true,
}: {
  category?: EventItem['category'];
  tag?: string;
  upcoming?: boolean;
}): EventItem[] {
  let filtered = mockEvents.filter((event) => event.published);

  if (category) {
    filtered = filtered.filter((event) => event.category === category);
  }

  if (tag) {
    filtered = filtered.filter((event) => event.tags.includes(tag));
  }

  if (upcoming) {
    const now = new Date();
    filtered = filtered.filter((event) => new Date(event.startDate) >= now);
  }

  // Сортировка по дате
  filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return filtered;
}

/**
 * Получить мероприятие по ID
 */
export function getEventById(id: string): EventItem | undefined {
  return mockEvents.find((event) => event.id === id);
}

/**
 * Проверить, открыта ли регистрация
 */
export function isRegistrationOpen(event: EventItem): boolean {
  if (!event.registrationOpen) return false;
  if (!event.maxParticipants) return true;
  return (event.participants || 0) < event.maxParticipants;
}
