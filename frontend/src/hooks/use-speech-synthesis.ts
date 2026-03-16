'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Опции для синтеза речи
 */
export interface SpeechOptions {
  /** Скорость речи (0.1 - 10) */
  rate?: number;
  /** Высота голоса (0 - 2) */
  pitch?: number;
  /** Громкость (0 - 1) */
  volume?: number;
  /** Язык (например, 'ru-RU') */
  lang?: string;
  /** Имя голоса (если нужно выбрать конкретный) */
  voiceName?: string;
}

/**
 * Результат работы хука
 */
export interface SpeechSynthesisResult {
  /** Говорит ли сейчас */
  isSpeaking: boolean;
  /** На паузе ли */
  isPaused: boolean;
  /** Доступен ли синтез речи в браузере */
  isSupported: boolean;
  /** Доступные голоса */
  voices: SpeechSynthesisVoice[];
  /** Текущий выбранный голос */
  currentVoice: SpeechSynthesisVoice | null;
  /** Начать озвучку текста */
  speak: (text: string, options?: SpeechOptions) => void;
  /** Остановить озвучку */
  stop: () => void;
  /** Поставить на паузу */
  pause: () => void;
  /** Продолжить после паузы */
  resume: () => void;
  /** Выбрать голос */
  setVoice: (voice: SpeechSynthesisVoice) => void;
  /** Установить скорость */
  setRate: (rate: number) => void;
  /** Установить высоту */
  setPitch: (pitch: number) => void;
  /** Установить громкость */
  setVolume: (volume: number) => void;
}

/**
 * Хук для работы с Web Speech API (синтез речи)
 * 
 * @example
 * ```tsx
 * const { speak, stop, isSpeaking } = useSpeechSynthesis();
 * 
 * <button onClick={() => speak('Привет!')}>
 *   {isSpeaking ? 'Остановить' : 'Озвучить'}
 * </button>
 * ```
 */
export function useSpeechSynthesis(): SpeechSynthesisResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRateState] = useState(1);
  const [pitch, setPitchState] = useState(1);
  const [volume, setVolumeState] = useState(1);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Загрузка доступных голосов
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Выбираем русский голос по умолчанию
      const russianVoice = availableVoices.find(
        voice => voice.lang === 'ru-RU' || voice.lang.startsWith('ru')
      );
      
      if (russianVoice) {
        setCurrentVoice(russianVoice);
      } else if (availableVoices.length > 0) {
        // Если нет русского, берем первый доступный
        setCurrentVoice(availableVoices[0]);
      }
    };

    loadVoices();

    // Некоторые браузеры загружают голоса асинхронно
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  // Обновление состояния озвучки
  useEffect(() => {
    if (!isSupported) return;

    const updateSpeakingState = () => {
      setIsSpeaking(window.speechSynthesis.speaking);
      setIsPaused(window.speechSynthesis.paused);
    };

    // Периодическая проверка состояния
    const interval = setInterval(updateSpeakingState, 100);

    return () => clearInterval(interval);
  }, [isSupported]);

  /**
   * Начать озвучку текста
   */
  const speak = useCallback((text: string, options?: SpeechOptions) => {
    if (!isSupported) {
      console.warn('Web Speech API не поддерживается в этом браузере');
      return;
    }

    // Если уже говорит и текст тот же, не делаем ничего
    if (isSpeaking) {
      // Если текст изменился, останавливаем и начинаем новый
      if (!isPaused) {
        window.speechSynthesis.cancel();
      }
    }

    // Создаем новое высказывание
    const utterance = new SpeechSynthesisUtterance(text);

    // Применяем опции
    if (options) {
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.lang !== undefined) utterance.lang = options.lang;
    }

    // Применяем текущие настройки
    utterance.rate = options?.rate ?? rate;
    utterance.pitch = options?.pitch ?? pitch;
    utterance.volume = options?.volume ?? volume;

    // Применяем голос
    if (options?.voiceName) {
      const voice = voices.find(v => v.name === options.voiceName);
      if (voice) utterance.voice = voice;
    } else if (currentVoice) {
      utterance.voice = currentVoice;
    } else {
      // Пытаемся найти русский голос
      const russianVoice = voices.find(v => v.lang === 'ru-RU' || v.lang.startsWith('ru'));
      if (russianVoice) utterance.voice = russianVoice;
    }

    // Обработчики событий
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      // Игнорируем ошибку 'interrupted' — это нормальное поведение при остановке
      if (event.error === 'interrupted') {
        setIsSpeaking(false);
        setIsPaused(false);
        return;
      }
      
      console.error('Ошибка синтеза речи:', event.error);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, currentVoice, voices, rate, pitch, volume, isSpeaking, isPaused]);

  /**
   * Остановить озвучку
   */
  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  /**
   * Поставить на паузу
   */
  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, isSpeaking]);

  /**
   * Продолжить после паузы
   */
  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isPaused]);

  /**
   * Выбрать голос
   */
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);

  /**
   * Установить скорость
   */
  const handleSetRate = useCallback((newRate: number) => {
    const clampedRate = Math.max(0.1, Math.min(10, newRate));
    setRateState(clampedRate);
  }, []);

  /**
   * Установить высоту
   */
  const handleSetPitch = useCallback((newPitch: number) => {
    const clampedPitch = Math.max(0, Math.min(2, newPitch));
    setPitchState(clampedPitch);
  }, []);

  /**
   * Установить громкость
   */
  const handleSetVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  }, []);

  return {
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    currentVoice,
    speak,
    stop,
    pause,
    resume,
    setVoice,
    setRate: handleSetRate,
    setPitch: handleSetPitch,
    setVolume: handleSetVolume,
  };
}
