'use client';

import { useEffect, useState } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility-store';

/**
 * AccessibilityProvider — провайдер настроек доступности
 * Применяет настройки к документу
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom } = useAccessibilityStore();
  const [isMounted, setIsMounted] = useState(false);

  // Применение настроек доступности при изменении
  useEffect(() => {
    // Применяем только после монтирования (избегаем гидратации)
    if (!isMounted) return;

    const applySettings = () => {
      const body = document.body;

      // Контраст - используем классы на body
      body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
      body.classList.add(`contrast-${contrast}`);

      // Размер шрифта - применяем только к body, не ко всем элементам
      body.style.setProperty('font-size', `${fontSize}px`);

      // Масштаб страницы
      document.documentElement.style.setProperty('--user-zoom', zoom.toString());
      document.documentElement.style.zoom = zoom.toString();

      // Лупа
      if (magnifierEnabled) {
        document.documentElement.classList.add('magnifier-enabled');
      } else {
        document.documentElement.classList.remove('magnifier-enabled');
      }
      document.documentElement.style.setProperty('--magnifier-zoom', magnifierZoom.toString());
    };

    applySettings();

    // Подписываемся на изменения store
    const unsubscribe = useAccessibilityStore.subscribe(() => {
      applySettings();
    });

    return unsubscribe;
  }, [contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom, isMounted]);

  // Помечаем как смонтированный после первой отрисовки
  useEffect(() => {
    setIsMounted(true);
    
    // Инициализация настроек из localStorage
    try {
      const stored = localStorage.getItem('accessibility-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        const storedFontSize = settings.state?.fontSize;
        const storedContrast = settings.state?.contrast;

        if (storedFontSize) {
          document.body.style.setProperty('font-size', `${storedFontSize}px`);
        }
        if (storedContrast) {
          document.body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
          document.body.classList.add(`contrast-${storedContrast}`);
        }
      }
    } catch {
      // Игнорируем ошибки
    }
  }, []);

  return <>{children}</>;
}
