import type { Preview } from '@storybook/react';
import { useAccessibilityStore } from '../src/stores/accessibility-store';
import { useEffect } from 'react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
      ],
    },

    layout: 'fullscreen',
  },

  tags: ['autodocs'],

  // Глобальные декораторы
  decorators: [
    // Декоратор для применения настроек доступности при загрузке
    (Story) => {
      useEffect(() => {
        // Применяем настройки из localStorage
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
        } catch (e) {
          // Игнорируем ошибки
        }
      }, []);
      
      // Подписываемся на изменения store
      useEffect(() => {
        const unsubscribe = useAccessibilityStore.subscribe((state) => {
          const fontSize = state.fontSize;
          const contrast = state.contrast;
          
          // Применяем шрифт
          document.body.style.setProperty('font-size', `${fontSize}px`, 'important');
          const textElements = document.body.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, li, td, th, label, div, input, textarea');
          textElements.forEach(el => {
            (el as HTMLElement).style.setProperty('font-size', `${fontSize}px`, 'important');
          });
          
          // Применяем контраст
          document.body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
          document.body.classList.add(`contrast-${contrast}`);
        });
        
        return () => unsubscribe();
      }, []);
      
      return (
        <div className="story-wrapper" style={{ minHeight: '100vh' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
