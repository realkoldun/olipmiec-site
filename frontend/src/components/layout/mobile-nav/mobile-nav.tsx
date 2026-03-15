'use client';

import { useEffect, useState } from 'react';
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
  const [isClosing, setIsClosing] = useState(false);

  // Закрытие по ESC и при изменении размера экрана
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [open, onClose]);

  // Обработчик закрытия с анимацией
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Обработчик клика на ссылку
  const handleLinkClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose();
  };

  // Если меню закрыто и идёт анимация закрытия, не рендерим
  if (!open && !isClosing) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/80 transition-opacity duration-300',
        isClosing ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-xs',
          'flex flex-col bg-background shadow-xl',
          'transition-transform duration-300 ease-out',
          isClosing ? 'translate-x-full' : 'translate-x-0'
        )}
      >
        {/* Header мобильного меню */}
        <div className="flex items-center justify-between border-b p-4">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-2xl">🏆</span>
            <span className="text-foreground">Олимпиец</span>
          </span>
          <button
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <ul className="flex flex-col">
            {mainNavigation.map((item) => (
              <li
                key={item.href}
                className="border-b border-border/50"
              >
                <a
                  href={item.href}
                  onClick={handleLinkClick(item.href)}
                  className="flex flex-col gap-1 p-4 text-foreground hover:bg-accent/50 transition-colors"
                >
                  <span className="text-base font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-sm text-muted-foreground">
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
  );
}
