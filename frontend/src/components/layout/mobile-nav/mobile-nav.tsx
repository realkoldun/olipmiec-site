'use client';

import { useEffect } from 'react';
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
  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in">
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-xs',
          'flex flex-col bg-background shadow-xl',
          'animate-in slide-in-from-right duration-300'
        )}
      >
        {/* Header мобильного меню */}
        <div className="flex items-center justify-between border-b p-4">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-2xl">🏆</span>
            <span className="text-foreground">Олимпиец</span>
          </span>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col">
            {mainNavigation.map((item, index) => (
              <li
                key={item.href}
                className="border-b border-border/50"
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
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
