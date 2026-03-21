'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Menu, Search, Accessibility } from 'lucide-react';
import { cn } from '@/utils/cn';
import { mainNavigation } from '../navigation';
import { MobileNav } from '../mobile-nav/mobile-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { AccessibilityPanel } from '@/components/accessibility';
import { useSearch } from '@/hooks/use-search';

// Динамический импорт SearchModal для уменьшения начального бандла
const SearchModal = dynamic(
  () => import('@/components/search').then((mod) => mod.SearchModal),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded-lg bg-background p-6 shadow-lg">
          <div className="animate-pulse text-muted-foreground">Загрузка поиска...</div>
        </div>
      </div>
    ),
  }
);

export interface HeaderProps {
  /** Показывать поиск */
  showSearch?: boolean;
  /** Показывать кнопку доступности */
  showAccessibility?: boolean;
  /** Показывать переключатель темы */
  showThemeToggle?: boolean;
  /** Показывать панель доступности */
  showAccessibilityPanel?: boolean;
  /** Фиксированный header */
  fixed?: boolean;
}

/**
 * Header — шапка сайта с навигацией, поиском и доступностью
 */
export function Header({
  showSearch = true,
  showAccessibility = true,
  showThemeToggle = true,
  showAccessibilityPanel = true,
  fixed = true,
}: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isSearchOpen, openSearch, closeSearch } = useSearch();

  // Обработчик открытия мобильного меню
  const openMobileNav = () => {
    setMobileNavOpen(true);
  };

  // Обработчик закрытия мобильного меню
  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          fixed && 'fixed'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 max-w-[1400px]">
          {/* Логотип */}
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🏆</span>
            <span className="flex flex-col">
              <span className="text-lg font-bold leading-none">Олимпиец</span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">СДЮШОР</span>
            </span>
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {mainNavigation.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                    title={item.description}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Действия справа */}
          <div className="flex items-center gap-2">
            {/* Поиск */}
            {showSearch && (
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={openSearch}
                aria-label="Открыть поиск"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* Доступность */}
            {showAccessibility && (
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Настройки доступности"
                title="Настройки доступности"
                onClick={() => {
                  // Открываем панель доступности при клике
                  const event = new CustomEvent('open-accessibility-panel');
                  window.dispatchEvent(event);
                }}
              >
                <Accessibility className="h-5 w-5" />
              </button>
            )}

            {/* Переключатель темы */}
            {showThemeToggle && <ThemeToggle />}

            {/* Мобильное меню */}
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
              onClick={openMobileNav}
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Мобильная навигация */}
      <MobileNav open={mobileNavOpen} onClose={closeMobileNav} />

      {/* Панель доступности */}
      {showAccessibilityPanel && <AccessibilityPanel />}

      {/* Модальное окно поиска */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}
