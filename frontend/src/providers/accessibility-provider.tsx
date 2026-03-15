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
    const body = document.body;
    
    // Контраст - используем классы на body
    body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    body.classList.add(`contrast-${contrast}`);
    
    // Размер шрифта для body
    body.style.setProperty('--user-font-size', `${fontSize}px`, 'important');
    
    // Масштаб текста - применяем ко всем элементам
    body.style.setProperty('--user-font-scale', fontScale.toString());
    
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
  }, [contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom]);

  return <>{children}</>;
}
