'use client';

import { cn } from '@/utils/cn';

export interface SearchHighlightProps {
  /** Текст для подсветки */
  text: string;
  /** Слова для подсветки */
  query: string;
  /** Максимальная длина текста */
  maxLength?: number;
}

/**
 * SearchHighlight — компонент для подсветки совпадений в тексте
 *
 * @example
 * ```tsx
 * <SearchHighlight text="Поиск по сайту" query="поиск" />
 * // Результат: <span>...</span><mark>Поиск</mark><span> по сайту</span>
 * ```
 */
export function SearchHighlight({
  text,
  query,
  maxLength = 150,
}: SearchHighlightProps) {
  if (!text || !query) {
    return <span>{truncate(text, maxLength)}</span>;
  }

  // Нормализуем запрос
  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  if (queryWords.length === 0) {
    return <span>{truncate(text, maxLength)}</span>;
  }

  // Находим часть текста с совпадениями
  const normalizedText = normalizeText(text);
  let startIndex = 0;

  for (const word of queryWords) {
    const index = normalizedText.indexOf(word);
    if (index !== -1 && (startIndex === 0 || index < startIndex)) {
      startIndex = index;
    }
  }

  // Вырезаем контекст
  const contextStart = Math.max(0, startIndex - 30);
  const contextEnd = Math.min(text.length, startIndex + maxLength);
  let context = text.slice(contextStart, contextEnd);

  if (contextStart > 0) {
    context = '...' + context;
  }
  if (contextEnd < text.length) {
    context = context + '...';
  }

  // Подсвечиваем совпадения
  const parts = highlightText(context, queryWords);

  return <span className={cn('text-sm')}>{parts}</span>;
}

/**
 * Подсветка текста
 */
function highlightText(text: string, words: string[]): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const textToHighlight = text;
  let keyIndex = 0;

  // Сортируем слова по длине (длинные primero)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  // Создаем regex для всех слов
  const escapedWords = sortedWords.map(escapeRegex);
  const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');

  // Разбиваем текст на части
  const splitParts = textToHighlight.split(regex);

  splitParts.forEach((part) => {
    const isMatch = sortedWords.some(
      (word) => normalizeText(part) === normalizeText(word)
    );

    if (isMatch) {
      parts.push(
        <mark key={keyIndex++} className="bg-yellow-200 text-foreground font-medium">
          {part}
        </mark>
      );
    } else if (part) {
      parts.push(<span key={keyIndex++}>{part}</span>);
    }
  });

  return parts;
}

/**
 * Нормализация текста
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Усечение текста
 */
function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Экранирование regex
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
