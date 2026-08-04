import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const BASE = 'https://shop.lens-navi.jp';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'ショップナビ | アイケアグッズ専門ストア',
    template: '%s | ショップナビ',
  },
  description: 'ホットアイマスク・ブルーライトカットメガネなど、目もとのケアグッズを取り扱うオンラインストアです。',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: 'ショップナビ',
        description: 'アイケアグッズ専門オンラインストア',
        inLanguage: 'ja',
      },
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'ショップナビ',
        url: BASE,
        description: '目もとのケアグッズを取り扱うオンラインストア。',
      },
    ],
  };

  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${notoSansJP.className} bg-white text-gray-900`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
