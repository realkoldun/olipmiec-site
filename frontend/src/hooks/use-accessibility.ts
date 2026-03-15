'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility-store';

/**
 * Hook для применения настроек доступности
 */
export function useAccessibility() {
  const { contrast, fontSize, fontScale, zoom, magnifierEnabled } = useAccessibilityStore();

  // Применение контраста
  useEffect(() => {
    const root = document.documentElement;
    
    // Удаляем все классы контраста
    root.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    
    // Добавляем текущий режим
    root.classList.add(`contrast-${contrast}`);
    
    // Сохраняем в data-атрибут для CSS
    root.setAttribute('data-contrast', contrast);
  }, [contrast]);

  // Применение размера шрифта
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--user-font-size', `${fontSize}px`);
    root.setAttribute('data-font-size', fontSize.toString());
  }, [fontSize]);

  // Применение масштаба текста
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--user-font-scale', fontScale.toString());
    root.setAttribute('data-font-scale', fontScale.toString());
  }, [fontScale]);

  // Применение масштаба страницы
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--user-zoom', zoom.toString());
    root.setAttribute('data-zoom', zoom.toString());
  }, [zoom]);

  // Применение лупы
  useEffect(() => {
    const root = document.documentElement;
    
    if (magnifierEnabled) {
      root.classList.add('magnifier-enabled');
    } else {
      root.classList.remove('magnifier-enabled');
    }
    
    root.setAttribute('data-magnifier', magnifierEnabled.toString());
  }, [magnifierEnabled]);

  return {
    contrast,
    fontSize,
    fontScale,
    zoom,
    magnifierEnabled,
  };
}
