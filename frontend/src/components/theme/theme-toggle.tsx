'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAccessibilityStore } from '@/stores/accessibility-store';

export interface ThemeToggleProps {
  className?: string;
}

/**
 * ThemeToggle — переключатель светлой/тёмной темы
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { contrast } = useAccessibilityStore();
  const [showWarning, setShowWarning] = useState(false);

  // Инициализация темы при монтировании
  useEffect(() => {
    setIsMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  // Переключение темы
  const toggleTheme = () => {
    // Если включён режим контраста (не normal), показываем предупреждение
    if (contrast !== 'normal') {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Сохранение в localStorage
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  // Применение сохранённой темы
  useEffect(() => {
    if (!isMounted) return;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2',
          'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
        title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      >
        {isDark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      {/* Предупреждение */}
      {showWarning && (
        <div
          className={cn(
            'absolute top-full right-0 mt-2 p-3 rounded-lg shadow-lg',
            'bg-destructive text-destructive-foreground',
            'text-sm font-medium',
            'animate-in fade-in slide-in-from-top-2',
            'w-[250px] z-50'
          )}
          role="alert"
        >
          <p className="font-semibold mb-1">⚠️ Нельзя сменить тему</p>
          <p className="text-xs">
            Сначала отключите режим контраста в настройках доступности
          </p>
        </div>
      )}
    </div>
  );
}
