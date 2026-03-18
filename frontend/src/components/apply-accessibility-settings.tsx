'use client';

import { useEffect } from 'react';

/**
 * Компонент для применения настроек доступности
 * Применяет настройки шрифта и контраста из localStorage
 */
export function ApplyAccessibilitySettings() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('accessibility-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        const fontSize = settings.state?.fontSize || 16;
        const contrast = settings.state?.contrast || 'normal';

        // Применяем шрифт
        document.body.style.setProperty('font-size', `${fontSize}px`, 'important');
        const textElements = document.body.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, li, td, th, label, div, input, textarea');
        textElements.forEach(el => {
          (el as HTMLElement).style.setProperty('font-size', `${fontSize}px`, 'important');
        });

        // Применяем контраст
        document.body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
        document.body.classList.add(`contrast-${contrast}`);
      }
    } catch {
      // Игнорируем ошибки
    }
  }, []);

  return null;
}
