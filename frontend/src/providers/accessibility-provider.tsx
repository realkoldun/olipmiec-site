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
    
    console.log('[Provider] Applying fontSize:', fontSize);

    // Контраст - используем классы на body
    body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    body.classList.add(`contrast-${contrast}`);

    // Размер шрифта - применяем напрямую к body
    body.style.fontSize = `${fontSize}px`;
    
    // Применяем ко всем текстовым элементам
    const textElements = body.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, li, td, th, label, div');
    textElements.forEach(el => {
      (el as HTMLElement).style.fontSize = `${fontSize}px`;
    });
    
    console.log('[Provider] Applied to', textElements.length, 'elements');
    
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
