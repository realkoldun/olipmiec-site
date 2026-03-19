'use client';

import { useRouter } from 'next/navigation';
import { FileWarning, ArrowLeft, Home } from 'lucide-react';
import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';
import { Button } from '@/components/ui/button/button';

/**
 * NotFoundPage — страница ошибки 404
 *
 * Использует layout компоненты:
 * - Header
 * - Footer
 *
 * И UI компоненты:
 * - Button
 */
export function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Основной контент */}
      <main className="flex-1 pt-16">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 md:px-6 md:py-24 max-w-[1400px]">
          {/* Иконка ошибки */}
          <div className="mb-8 rounded-full bg-muted p-6">
            <FileWarning className="h-16 w-16 text-muted-foreground" data-testid="file-warning-icon" />
          </div>

          {/* Заголовок */}
          <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>

          {/* Подзаголовок */}
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Страница не найдена
          </h2>

          {/* Описание */}
          <p className="mb-8 max-w-md text-center text-lg text-muted-foreground">
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </p>

          {/* Кнопки навигации */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              variant="default"
              size="lg"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <Home className="h-5 w-5" />
              На главную
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Назад
            </Button>
          </div>

          {/* Дополнительные ссылки */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Возможно, вы искали:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Button
                variant="link"
                size="sm"
                onClick={() => router.push('/news')}
              >
                Новости
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => router.push('/sections')}
              >
                Секции
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => router.push('/trainers')}
              >
                Тренеры
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
