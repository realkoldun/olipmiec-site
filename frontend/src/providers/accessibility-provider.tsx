'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility-store';

/**
 * AccessibilityProvider — провайдер настроек доступности
 * Применяет настройки к документу
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom } = useAccessibilityStore();

  // Применение настроек доступности при изменении
  useEffect(() => {
    const applySettings = () => {
      const body = document.body;

      // Контраст - используем классы на body
      body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
      body.classList.add(`contrast-${contrast}`);

      // Размер шрифта - применяем напрямую к body и всем элементам
      body.style.setProperty('font-size', `${fontSize}px`, 'important');

      const textElements = body.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, li, td, th, label, div, input, textarea');
      textElements.forEach(el => {
        // Пропускаем элементы внутри мобильного меню, чтобы не ломать его layout
        if (el.closest('.mobile-nav')) return;
        (el as HTMLElement).style.setProperty('font-size', `${fontSize}px`, 'important');
      });

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

    // Применяем сразу
    applySettings();

    // Подписываемся на изменения store
    const unsubscribe = useAccessibilityStore.subscribe(() => {
      applySettings();
    });

    return unsubscribe;
  }, [contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom]);

  // Инициализация настроек из localStorage при первом запуске (для SSR гидратации)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('accessibility-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        const storedFontSize = settings.state?.fontSize;
        const storedContrast = settings.state?.contrast;

        if (storedFontSize) {
          document.body.style.setProperty('font-size', `${storedFontSize}px`, 'important');
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
