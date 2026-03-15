import type { Preview } from '@storybook/react';
import { useAccessibilityStore } from '../src/stores/accessibility-store';
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
      // Применяем контраст из store
      const applyContrast = (contrast: string) => {
        const body = document.body;
        body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
        body.classList.add(`contrast-${contrast}`);
      };
      
      // Получаем текущий контраст и применяем
      const currentContrast = useAccessibilityStore.getState().contrast;
      applyContrast(currentContrast);
      
      // Подписываемся на изменения store
      useAccessibilityStore.subscribe(
        (state) => state.contrast,
        (contrast) => applyContrast(contrast)
      );
      
      return (
        <div className="story-wrapper" style={{ minHeight: '100vh' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
