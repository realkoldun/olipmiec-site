import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AccessibilityProvider } from '@/providers/accessibility-provider';
import { SearchProvider } from '@/providers/search-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { SITE_INFO } from '@/constants';

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: SITE_INFO.name,
  description: SITE_INFO.description,
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
