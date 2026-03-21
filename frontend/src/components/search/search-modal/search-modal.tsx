'use client';

import { useEffect, useCallback } from 'react';
import type { MouseEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SearchBar } from '@/components/search';
import { SearchResults } from '@/components/search';
import { Button } from '@/components/ui/button/button';
import { useSearch } from '@/hooks/use-search';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SearchModal — модальное окно поиска
 */
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { closeSearch } = useSearch();

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Закрытие при клике вне области
  const handleBackdropClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
        closeSearch();
      }
    },
    [onClose, closeSearch]
  );

  // Обработчик клика на результат
  const handleItemClick = useCallback((url: string) => {
    // Переход по URL
    window.location.href = url;
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center',
        'bg-black/50 backdrop-blur-sm',
        'animate-in fade-in duration-200'
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'w-full max-w-2xl mt-20 mx-4',
          'bg-background rounded-lg shadow-2xl',
          'border',
          'animate-in zoom-in-95 duration-200'
        )}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Поиск по сайту</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="Закрыть поиск"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Строка поиска */}
        <div className="p-4 border-b">
          <SearchBar
            autoSearch
            debounceMs={300}
            placeholder="Введите поисковый запрос..."
            size="lg"
          />
        </div>

        {/* Результаты */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <SearchResults onItemClick={handleItemClick} />
        </div>
      </div>
    </div>
  );
}
