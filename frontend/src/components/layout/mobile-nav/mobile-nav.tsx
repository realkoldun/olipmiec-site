'use client';

import { useEffect, useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { mainNavigation } from '../navigation';

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * MobileNav — мобильное навигационное меню (бургер)
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const firstLinkRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Закрытие по ESC и при изменении размера экрана
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleResize = () => {
      // lg breakpoint = 1024px
      if (window.innerWidth >= 1024 && open) {
        onClose();
      }
    };

    // Trap focus внутри меню
    const handleTabKey = (e: KeyboardEvent) => {
      if (!open || e.key !== 'Tab') return;

      const focusableElements = document.querySelectorAll(
        '.mobile-nav button, .mobile-nav a, .mobile-nav [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('keydown', handleTabKey);
      // Блокируем прокрутку основной страницы, но не внутри меню
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('resize', handleResize);

      // Анимация открытия
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      // Фокус на навигационный контейнер для включения прокрутки
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('keydown', handleTabKey);
      document.documentElement.style.overflow = '';
      window.removeEventListener('resize', handleResize);
      setIsVisible(false);
    };
  }, [open, onClose]);

  // Обработчик закрытия с анимацией
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsVisible(false);
    }, 300);
  };

  // Обработчик клика на ссылку
  const handleLinkClick = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleClose();
    // Небольшая задержка для завершения анимации закрытия
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  // Если меню закрыто и идёт анимация закрытия, не рендерим
  if (!open && !isClosing) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/80',
        'transition-opacity duration-300 ease-in-out',
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div
        className={cn(
          'mobile-nav fixed inset-y-0 right-0 z-50 w-full max-w-xs',
          'flex flex-col bg-background shadow-xl',
          'transition-transform duration-300 ease-out',
          isVisible && !isClosing ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          height: '100vh',
          maxHeight: '100vh',
        }}
      >
        {/* Header мобильного меню */}
        <div className="flex items-center justify-between border-b p-4 shrink-0">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-2xl">🏆</span>
            <span className="text-foreground">Олимпиец</span>
          </span>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Навигация */}
        <div
          ref={firstLinkRef}
          tabIndex={-1}
          className="flex-1 overflow-y-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
            overflowY: 'auto' as const,
            minHeight: '0',
            outline: 'none',
          }}
        >
          <nav className="py-4">
            <ul className="flex flex-col">
              {mainNavigation.map((item) => (
                <li
                  key={item.href}
                  className="border-b border-border/50"
                >
                  <a
                    href={item.href}
                    onClick={handleLinkClick(item.href)}
                    className="flex flex-col gap-1 p-4 text-foreground hover:bg-accent/50 transition-colors min-h-[60px]"
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    {item.description && (
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
