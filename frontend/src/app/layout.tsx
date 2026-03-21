import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AccessibilityProvider } from '@/providers/accessibility-provider';
import { SearchProvider } from '@/providers/search-provider';

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'СДЮШОР "Олимпиец" - г. Витебск',
  description: 'Спортивная школа олимпийского резерва',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <AccessibilityProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
