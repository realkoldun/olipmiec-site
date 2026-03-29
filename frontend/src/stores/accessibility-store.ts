import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ACCESSIBILITY_DEFAULTS, type ContrastMode } from '@/constants';

/**
 * Состояние настроек доступности
 */
export interface AccessibilityState {
  /** Размер шрифта (12-24px, по умолчанию 14px для мобильных) */
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
 * Значения по умолчанию
 */
const defaultState: Omit<AccessibilityState, AccessibilityActions> = {
  fontSize: ACCESSIBILITY_DEFAULTS.fontSize,
  fontScale: ACCESSIBILITY_DEFAULTS.fontScale,
  contrast: ACCESSIBILITY_DEFAULTS.contrast,
  zoom: ACCESSIBILITY_DEFAULTS.zoom,
  magnifierEnabled: ACCESSIBILITY_DEFAULTS.magnifierEnabled,
  magnifierZoom: ACCESSIBILITY_DEFAULTS.magnifierZoom,
  voiceEnabled: ACCESSIBILITY_DEFAULTS.voiceEnabled,
  voiceRate: ACCESSIBILITY_DEFAULTS.voiceRate,
};

/**
 * Accessibility Store
 * Хранит настройки доступности в localStorage
 */
export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...defaultState,

      setFontSize: (size) => set({ 
        fontSize: Math.max(
          ACCESSIBILITY_DEFAULTS.minFontSize, 
          Math.min(ACCESSIBILITY_DEFAULTS.maxFontSize, size)
        ) 
      }),
      setFontScale: (scale) => set({ 
        fontScale: Math.max(
          ACCESSIBILITY_DEFAULTS.minFontScale, 
          Math.min(ACCESSIBILITY_DEFAULTS.maxFontScale, scale)
        ) 
      }),
      setContrast: (mode) => set({ contrast: mode }),
      setZoom: (zoom) => set({ 
        zoom: Math.max(
          ACCESSIBILITY_DEFAULTS.minZoom, 
          Math.min(ACCESSIBILITY_DEFAULTS.maxZoom, zoom)
        ) 
      }),
      setMagnifierEnabled: (enabled) => set({ magnifierEnabled: enabled }),
      setMagnifierZoom: (zoom) => set({ 
        magnifierZoom: Math.max(
          ACCESSIBILITY_DEFAULTS.minMagnifierZoom, 
          Math.min(ACCESSIBILITY_DEFAULTS.maxMagnifierZoom, zoom)
        ) 
      }),
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      setVoiceRate: (rate) => set({ 
        voiceRate: Math.max(
          ACCESSIBILITY_DEFAULTS.minVoiceRate, 
          Math.min(ACCESSIBILITY_DEFAULTS.maxVoiceRate, rate)
        ) 
      }),
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
