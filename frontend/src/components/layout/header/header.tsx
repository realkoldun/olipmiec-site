'use client';

import { useState } from 'react';
import { Menu, Search, Accessibility } from 'lucide-react';
import { cn } from '@/utils/cn';
import { mainNavigation } from '../navigation';
import './header.styles.css';

export interface HeaderProps {
  /** Показывать поиск */
  showSearch?: boolean;
  /** Показывать кнопку доступности */
  showAccessibility?: boolean;
  /** Фиксированный header */
  fixed?: boolean;
}

/**
 * Header — шапка сайта с навигацией, поиском и доступностью
 */
export function Header({
  showSearch = true,
  showAccessibility = true,
  fixed = true,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={cn('header', fixed && 'header--fixed')}>
      <div className="header__container">
        {/* Логотип */}
        <a href="/" className="header__logo">
          <span className="header__logo-icon">🏆</span>
          <span className="header__logo-text">
            <span className="header__logo-title">Олимпиец</span>
            <span className="header__logo-subtitle">СДЮШОР</span>
          </span>
        </a>

        {/* Десктопная навигация */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            {mainNavigation.map((item) => (
              <li key={item.href} className="header__nav-item">
                <a
                  href={item.href}
                  className="header__nav-link"
                  title={item.description}
                  onClick={(e) => e.preventDefault()}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Действия справа */}
        <div className="header__actions">
          {/* Поиск */}
          {showSearch && (
            <>
              <button
                className="header__action-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Открыть поиск"
              >
                <Search className="header__action-icon" />
              </button>
              {searchOpen && (
                <div className="header__search">
                  <input
                    type="search"
                    placeholder="Поиск..."
                    className="header__search-input"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              )}
            </>
          )}

          {/* Доступность */}
          {showAccessibility && (
            <button
              className="header__action-btn"
              aria-label="Настройки доступности"
              title="Настройки доступности"
            >
              <Accessibility className="header__action-icon" />
            </button>
          )}

          {/* Мобильное меню */}
          <button
            className="header__action-btn header__action-btn--mobile"
            aria-label="Открыть меню"
          >
            <Menu className="header__action-icon" />
          </button>
        </div>
      </div>
    </header>
  );
}
