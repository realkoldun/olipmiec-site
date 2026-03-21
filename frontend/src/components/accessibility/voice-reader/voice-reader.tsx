'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { Volume2, VolumeX, Pause, Play, Square, Settings2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button/button';
import { useAccessibilityStore } from '@/stores/accessibility-store';

export interface VoiceReaderProps {
  className?: string;
  /** Текст для озвучки */
  text?: string;
  /** Показывать расширенные настройки */
  showAdvancedSettings?: boolean;
}

/**
 * VoiceReader — компонент озвучки текста
 * 
 * Особенности:
 * - Кастомное управление воспроизведением
 * - Выбор скорости речи
 * - Визуальная индикация состояния
 * - Интеграция с accessibility store
 */
export function VoiceReader({
  className,
  text = '',
  showAdvancedSettings = false,
}: VoiceReaderProps) {
  const {
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    currentVoice,
    speak,
    stop,
    pause,
    resume,
    setRate,
  } = useSpeechSynthesis();

  const { voiceEnabled, voiceRate, setVoiceEnabled, setVoiceRate } = useAccessibilityStore();
  const [showSettings, setShowSettings] = useState(false);
  const [barHeights, setBarHeights] = useState<number[]>([8, 12, 8, 12, 8]);

  // Анимация полосок визуализатора
  useEffect(() => {
    if (!isSpeaking || isPaused) return;

    const interval = setInterval(() => {
      setBarHeights(prev => prev.map(() => Math.random() * 16 + 8));
    }, 150);

    return () => clearInterval(interval);
  }, [isSpeaking, isPaused]);

  // Обработчик начала/остановки озвучки
  const handleToggleSpeak = useCallback(() => {
    if (!text) return;

    if (isSpeaking) {
      stop();
      if (voiceEnabled) {
        setVoiceEnabled(false);
      }
    } else {
      speak(text, { rate: voiceRate });
      setVoiceEnabled(true);
    }
  }, [text, isSpeaking, speak, stop, voiceRate, voiceEnabled, setVoiceEnabled]);

  // Обработчик паузы/продолжения
  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  // Обработчик остановки
  const handleStop = useCallback(() => {
    stop();
    setVoiceEnabled(false);
  }, [stop, setVoiceEnabled]);

  // Обработчик изменения скорости
  const handleRateChange = useCallback((newRate: number) => {
    setRate(newRate);
    setVoiceRate(newRate);
    
    // Если сейчас говорит, перезапускаем с новой скоростью
    if (isSpeaking && text) {
      stop();
      setTimeout(() => speak(text, { rate: newRate }), 50);
    }
  }, [isSpeaking, text, setRate, setVoiceRate, stop, speak]);

  // Если Web Speech API не поддерживается
  if (!isSupported) {
    return (
      <div className={cn('p-3 rounded-md bg-muted/50 border', className)}>
        <p className="text-sm text-muted-foreground">
          Синтез речи не поддерживается в вашем браузере
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <Volume2 className="h-5 w-5 text-primary animate-pulse" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">Озвучка текста</span>
        </div>

        {/* Кнопка настроек */}
        {showAdvancedSettings && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 p-0"
            aria-label="Настройки озвучки"
            aria-expanded={showSettings}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Кнопки управления */}
      <div className="flex items-center gap-2">
        {/* Кнопка играть/пауза */}
        <Button
          variant={isSpeaking ? 'primary' : 'outline'}
          size="icon"
          className="h-10 w-10"
          onClick={handleToggleSpeak}
          disabled={!text}
          aria-label={isSpeaking ? 'Остановить озвучку' : 'Начать озвучку'}
        >
          {isSpeaking ? (
            <Square className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        {/* Кнопка паузы/продолжения */}
        {isSpeaking && (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={handleTogglePause}
            disabled={!isSpeaking}
            aria-label={isPaused ? 'Продолжить' : 'Пауза'}
          >
            {isPaused ? (
              <Play className="h-5 w-5" />
            ) : (
              <Pause className="h-5 w-5" />
            )}
          </Button>
        )}

        {/* Кнопка остановки */}
        {isSpeaking && (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={handleStop}
            aria-label="Остановить"
          >
            <VolumeX className="h-5 w-5" />
          </Button>
        )}

        {/* Индикатор состояния */}
        {isSpeaking && (
          <div className="flex-1 flex items-center gap-1 ml-2">
            <div className="flex gap-0.5">
              {barHeights.map((height, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1 bg-primary rounded-full transition-all duration-150',
                    isPaused ? 'h-2' : 'animate-bounce'
                  )}
                  style={{
                    height: isPaused ? '8px' : `${height}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              {isPaused ? 'На паузе' : 'Озвучка...'}
            </span>
          </div>
        )}
      </div>

      {/* Расширенные настройки */}
      {showSettings && (
        <div className="p-3 rounded-md bg-muted/50 border space-y-3">
          {/* Скорость речи */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Скорость речи</label>
              <span className="text-xs text-muted-foreground">{voiceRate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceRate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
                         [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              aria-label="Скорость речи"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Медленно</span>
              <span>Быстро</span>
            </div>
          </div>

          {/* Выбранный голос */}
          {currentVoice && (
            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Голос:</strong> {currentVoice.name}
              </p>
              <p>
                <strong>Язык:</strong> {currentVoice.lang}
              </p>
            </div>
          )}

          {/* Доступные голоса (если их несколько) */}
          {voices.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs font-medium">Доступные голоса:</label>
              <select
                value={currentVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  if (voice) {
                    // Здесь можно добавить установку голоса через хук
                    console.log('Выбран голос:', voice.name);
                  }
                }}
                className="w-full p-2 text-xs border rounded-md bg-background"
                aria-label="Выбор голоса"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Подсказка если нет текста */}
      {!text && (
        <p className="text-xs text-muted-foreground">
          Выберите текст для озвучки на странице
        </p>
      )}
    </div>
  );
}
