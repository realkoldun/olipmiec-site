import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';

export interface SiteLayoutProps {
  children: React.ReactNode;
}

/**
 * SiteLayout — общий layout для всех страниц
 * Header и Footer всегда видны, меняется только контент между ними
 */
export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header — фиксированный, не перерисовывается */}
      <Header />

      {/* Основной контент — меняется при навигации */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer — фиксированный, не перерисовывается */}
      <Footer />
    </div>
  );
}
