/**
 * Навигационные элементы для header
 */
export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const mainNavigation: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Новости', href: '/news', description: 'Последние события школы' },
  { label: 'Секции', href: '/sections', description: 'Спортивные секции' },
  { label: 'Тренеры', href: '/trainers', description: 'Наши тренеры' },
  { label: 'Почётная доска', href: '/honor-board', description: 'Наши достижения' },
  { label: 'Документы', href: '/documents', description: 'Официальные документы' },
  { label: 'Контакты', href: '/contacts' },
];

/**
 * Навигация для footer
 */
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const footerSections: FooterSection[] = [
  {
    title: 'Навигация',
    links: [
      { label: 'Главная', href: '/' },
      { label: 'Новости', href: '/news' },
      { label: 'Секции', href: '/sections' },
      { label: 'Тренеры', href: '/trainers' },
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

/**
 * Контактная информация
 */
export const contactInfo = {
  name: 'СДЮШОР "Олимпиец"',
  address: 'г. Витебск, ул. Спортивная, 1',
  phone: '+375 (212) XX-XX-XX',
  email: 'info@olimpiyec.by',
  hours: 'Пн-Пт: 9:00 - 18:00',
};
