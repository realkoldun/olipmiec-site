import type { Preview } from '@storybook/react';
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
    // Декоратор для применения настроек доступности
    (Story) => {
      // Функция применения контраста
      const applyContrast = (contrast: string) => {
        const body = document.body;
        body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
        body.classList.add(`contrast-${contrast}`);
      };
      
      // Применяем текущие настройки при монтировании
      try {
        const stored = localStorage.getItem('accessibility-settings');
        if (stored) {
          const settings = JSON.parse(stored);
          if (settings.state?.contrast) {
            applyContrast(settings.state.contrast);
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
      
      // Слушаем изменения настроек
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'accessibility-settings') {
          const settings = JSON.parse(e.newValue || '{}');
          if (settings.state?.contrast) {
            applyContrast(settings.state.contrast);
          }
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return (
        <div className="story-wrapper" style={{ minHeight: '100vh' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
