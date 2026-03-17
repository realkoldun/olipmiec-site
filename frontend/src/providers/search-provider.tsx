'use client';

import { useEffect } from 'react';
import { initializeSearchIndex } from '@/mocks/search.mock';

/**
 * SearchProvider — провайдер для инициализации поиска
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  // Инициализация поискового индекса при загрузке
  useEffect(() => {
    initializeSearchIndex();
  }, []);

  return <>{children}</>;
}
