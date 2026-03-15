'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility-store';

/**
 * AccessibilityProvider — провайдер настроек доступности
 * Применяет настройки к документу
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom } = useAccessibilityStore();

  // Применение настроек доступности
  useEffect(() => {
    const root = document.documentElement;
    
    // Контраст
    root.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    root.classList.add(`contrast-${contrast}`);
    root.setAttribute('data-contrast', contrast);
    
    // Размер шрифта
    root.style.setProperty('--user-font-size', `${fontSize}px`);
    root.setAttribute('data-font-size', fontSize.toString());
    
    // Масштаб текста
    root.style.setProperty('--user-font-scale', fontScale.toString());
    root.setAttribute('data-font-scale', fontScale.toString());
    
    // Масштаб страницы
    root.style.setProperty('--user-zoom', zoom.toString());
    root.setAttribute('data-zoom', zoom.toString());
    
    // Лупа
    if (magnifierEnabled) {
      root.classList.add('magnifier-enabled');
    } else {
      root.classList.remove('magnifier-enabled');
    }
    root.setAttribute('data-magnifier', magnifierEnabled.toString());
    root.style.setProperty('--magnifier-zoom', magnifierZoom.toString());
  }, [contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom]);

  return <>{children}</>;
}
