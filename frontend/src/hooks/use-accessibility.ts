'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility-store';

export function useAccessibility() {
  const { contrast, fontSize, fontScale, zoom, magnifierEnabled } = useAccessibilityStore();

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');

    root.classList.add(`contrast-${contrast}`);

    root.setAttribute('data-contrast', contrast);
  }, [contrast]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--user-font-size', `${fontSize}px`);
    root.setAttribute('data-font-size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--user-font-scale', fontScale.toString());
    root.setAttribute('data-font-scale', fontScale.toString());
  }, [fontScale]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--user-zoom', zoom.toString());
    root.setAttribute('data-zoom', zoom.toString());
  }, [zoom]);

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
