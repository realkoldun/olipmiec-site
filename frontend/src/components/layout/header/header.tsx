'use client';

import { useState } from 'react';
import { Menu, Search, Accessibility } from 'lucide-react';
import { cn } from '@/utils/cn';
import { mainNavigation } from '../navigation';
import { MobileNav } from '../mobile-nav/mobile-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { AccessibilityPanel } from '@/components/accessibility';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Обработчик открытия/закрытия поиска
  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  // Обработчик закрытия поиска
  const closeSearch = () => {
    setSearchOpen(false);
  };

  // Обработчик открытия мобильного меню
  const openMobileNav = () => {
    setMobileNavOpen(true);
  };

  // Обработчик закрытия мобильного меню
  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  // Обработчик клика на ссылку навигации
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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
          <a href="/" onClick={handleNavClick} className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <span className="text-2xl">🏆</span>
            <span className="flex flex-col">
              <span className="text-lg font-bold leading-none">Олимпиец</span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">СДЮШОР</span>
            </span>
          </a>

          {/* Десктопная навигация */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {mainNavigation.map((item) => (
                <li key={item.href} className="relative">
                  <a
                    href={item.href}
                    onClick={handleNavClick}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                    title={item.description}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Действия справа */}
          <div className="flex items-center gap-2">
            {/* Поиск */}
            {showSearch && (
              <>
                <button
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={toggleSearch}
                  aria-label="Открыть поиск"
                >
                  <Search className="h-5 w-5" />
                </button>
                {searchOpen && (
                  <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-full max-w-md flex items-center gap-2 rounded-md border bg-background p-2 shadow-lg animate-in fade-in slide-in-from-top-2">
                    <input
                      type="search"
                      placeholder="Поиск..."
                      className="flex-1 h-10 px-3 text-sm outline-none"
                      autoFocus
                      onBlur={closeSearch}
                    />
                  </div>
                )}
              </>
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
    </>
  );
}
