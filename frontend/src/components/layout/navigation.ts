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
