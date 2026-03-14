/**
 * Типографика для СДЮШОР "Олимпиец"
 * Поддержка доступности: увеличенные размеры шрифтов
 */
export const typography = {
  /**
   * Базовые размеры шрифтов (в rem)
   */
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px (default)
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  /**
   * Уровни доступности для изменения размера текста
   */
  accessibilitySizes: {
    normal: 1, // 100% - обычный размер
    large: 1.25, // 125% - увеличенный
    xlarge: 1.5, // 150% - большой
  },

  /**
   * Шрифты
   */
  fontFamilies: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },

  /**
   * Межстрочные интервалы
   */
  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  /**
   * Вес шрифта
   */
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

/**
 * Классы Tailwind для типографики
 */
export const typographyClasses = {
  h1: 'text-4xl font-bold tracking-tight lg:text-5xl',
  h2: 'text-3xl font-semibold tracking-tight lg:text-4xl',
  h3: 'text-2xl font-semibold tracking-tight lg:text-3xl',
  h4: 'text-xl font-semibold tracking-tight lg:text-2xl',
  h5: 'text-lg font-semibold tracking-tight',
  h6: 'text-base font-semibold tracking-tight',
  p: 'text-base leading-relaxed',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
  lead: 'text-xl text-muted-foreground',
};
