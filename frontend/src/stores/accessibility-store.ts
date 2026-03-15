import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Режимы контраста
 */
export type ContrastMode = 'normal' | 'high' | 'dark';

/**
 * Состояние настроек доступности
 */
export interface AccessibilityState {
  /** Размер шрифта (12-24px) */
  fontSize: number;
  /** Масштаб текста (0.8-2.0) */
  fontScale: number;
  /** Режим контраста */
  contrast: ContrastMode;
  /** Масштаб страницы (1-3) */
  zoom: number;
  /** Лупа включена */
  magnifierEnabled: boolean;
  /** Увеличение лупы (2-10) */
  magnifierZoom: number;
  /** Озвучка включена */
  voiceEnabled: boolean;
  /** Скорость озвучки (0.5-2.0) */
  voiceRate: number;
  
  // Actions
  setFontSize: (size: number) => void;
  setFontScale: (scale: number) => void;
  setContrast: (mode: ContrastMode) => void;
  setZoom: (zoom: number) => void;
  setMagnifierEnabled: (enabled: boolean) => void;
  setMagnifierZoom: (zoom: number) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setVoiceRate: (rate: number) => void;
  reset: () => void;
}

/**
 * Значения по умолчанию
 */
const defaultState: Omit<AccessibilityState, AccessibilityActions> = {
  fontSize: 16,
  fontScale: 1,
  contrast: 'normal',
  zoom: 1,
  magnifierEnabled: false,
  magnifierZoom: 3,
  voiceEnabled: false,
  voiceRate: 1,
};

type AccessibilityActions = 
  | 'setFontSize'
  | 'setFontScale'
  | 'setContrast'
  | 'setZoom'
  | 'setMagnifierEnabled'
  | 'setMagnifierZoom'
  | 'setVoiceEnabled'
  | 'setVoiceRate'
  | 'reset';

/**
 * Accessibility Store
 * Хранит настройки доступности в localStorage
 */
export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      setFontSize: (size) => set({ fontSize: Math.max(12, Math.min(24, size)) }),
      setFontScale: (scale) => set({ fontScale: Math.max(0.8, Math.min(2, scale)) }),
      setContrast: (mode) => set({ contrast: mode }),
      setZoom: (zoom) => set({ zoom: Math.max(1, Math.min(3, zoom)) }),
      setMagnifierEnabled: (enabled) => set({ magnifierEnabled: enabled }),
      setMagnifierZoom: (zoom) => set({ magnifierZoom: Math.max(2, Math.min(10, zoom)) }),
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      setVoiceRate: (rate) => set({ voiceRate: Math.max(0.5, Math.min(2, rate)) }),
      reset: () => set(defaultState),
    }),
    {
      name: 'accessibility-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fontSize: state.fontSize,
        fontScale: state.fontScale,
        contrast: state.contrast,
        zoom: state.zoom,
        magnifierEnabled: state.magnifierEnabled,
        magnifierZoom: state.magnifierZoom,
        voiceEnabled: state.voiceEnabled,
        voiceRate: state.voiceRate,
      }),
    }
  )
);
