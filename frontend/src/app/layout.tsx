import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import '@/styles/globals.css';
import { AccessibilityProvider } from '@/providers/accessibility-provider';
import { SearchProvider } from '@/providers/search-provider';

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'СДЮШОР "Олимпиец" - г. Витебск',
  description: 'Спортивная школа олимпийского резерва',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ApplyAccessibilitySettings />
        <AccessibilityProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}

// Компонент для применения настроек доступности
function ApplyAccessibilitySettings() {
  'use client';
  
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
