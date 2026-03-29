/**
 * Навигационные элементы для header
 * @deprecated Используйте MAIN_NAVIGATION из @/constants
 */
export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

/**
 * Навигация для footer
 * @deprecated Используйте FOOTER_SECTIONS из @/constants
 */
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Экспортируем из constants для обратной совместимости
export { MAIN_NAVIGATION as mainNavigation, FOOTER_SECTIONS as footerSections, CONTACTS as contactInfo } from '@/constants';
