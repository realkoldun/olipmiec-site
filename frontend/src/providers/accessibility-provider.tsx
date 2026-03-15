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
    
    // Контраст - используем data-атрибут
    root.setAttribute('data-contrast', contrast);
    
    // Размер шрифта
    root.style.setProperty('--user-font-size', `${fontSize}px`);
    
    // Масштаб текста
    root.style.setProperty('--user-font-scale', fontScale.toString());
    
    // Масштаб страницы
    root.style.setProperty('--user-zoom', zoom.toString());
    
    // Лупа
    if (magnifierEnabled) {
      root.classList.add('magnifier-enabled');
    } else {
      root.classList.remove('magnifier-enabled');
    }
    root.style.setProperty('--magnifier-zoom', magnifierZoom.toString());
  }, [contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom]);

  return <>{children}</>;
}
