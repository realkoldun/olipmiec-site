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
      // Функция применения контраста
      const applyContrast = (contrast: string) => {
        console.log('[Storybook] Applying contrast:', contrast);
        const body = document.body;
        body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
        body.classList.add(`contrast-${contrast}`);
        console.log('[Storybook] Body classes:', body.classList);
      };
      
      // Получаем текущий контраст из store
      const currentContrast = useAccessibilityStore.getState().contrast;
      console.log('[Storybook] Initial contrast:', currentContrast);
      applyContrast(currentContrast);
      
      // Подписываемся на изменения store
      const unsubscribe = useAccessibilityStore.subscribe(
        (state) => state.contrast,
        (contrast) => {
          console.log('[Storybook] Contrast subscription:', contrast);
          applyContrast(contrast);
        }
      );
      
      // Очистка при размонтировании
      return () => {
        unsubscribe();
      };
    },
  ],
};

export default preview;
