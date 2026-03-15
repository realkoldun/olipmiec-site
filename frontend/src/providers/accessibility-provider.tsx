'use client';

import { useEffect, useState } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility-store';

/**
 * AccessibilityProvider — провайдер настроек доступности
 * Применяет настройки к документу
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom } = useAccessibilityStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Ждём загрузки настроек из localStorage
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Применение настроек доступности
  useEffect(() => {
    if (!isLoaded) return;
    
    const body = document.body;
    
    console.log('[Provider] Applying fontSize:', fontSize);

    // Контраст - используем классы на body
    body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    body.classList.add(`contrast-${contrast}`);

    // Размер шрифта - применяем напрямую к body и всем элементам
    body.style.setProperty('font-size', `${fontSize}px`, 'important');
    
    const textElements = body.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, li, td, th, label, div, input, textarea');
    textElements.forEach(el => {
      (el as HTMLElement).style.setProperty('font-size', `${fontSize}px`, 'important');
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
  }, [isLoaded, contrast, fontSize, fontScale, zoom, magnifierEnabled, magnifierZoom]);

  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
}
