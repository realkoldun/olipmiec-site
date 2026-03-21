import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AccessibilityProvider } from '@/providers/accessibility-provider';
import { SearchProvider } from '@/providers/search-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';

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
        <ReactQueryProvider>
          <AccessibilityProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </AccessibilityProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
