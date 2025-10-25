import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'AstroSoul - Find Your Soulmate, Discover True Love Destiny 💕',
  description: 'Ancient Indian astrology wisdom × Modern AI warm interpretation, matching your perfect soulmate',
  keywords: 'soulmate, love matching, astrology pairing, true love prediction, Indian astrology, marriage analysis, love astrology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="custom-scrollbar">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}


