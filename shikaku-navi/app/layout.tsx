import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const BASE = 'https://shikaku-navi.jp';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: '資格ナビ｜資格取得・通信講座を徹底比較【2025年版】',
    template: '%s | 資格ナビ',
  },
  description: 'スタディング・フォーサイト・アガルートなど人気資格通信講座10社を徹底比較。宅建・簿記・FP・社労士など国家資格の通信講座を費用・合格率・学習スタイルで比較できます。',
  keywords: ['資格通信講座', '比較', '宅建', '簿記', 'FP', '社労士', '行政書士', 'スタディング', 'フォーサイト', 'アガルート'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: '資格ナビ',
  },
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
        name: '資格ナビ',
        description: '資格取得・通信講座比較サイト',
        inLanguage: 'ja',
      },
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: '資格ナビ',
        url: BASE,
        description: '資格通信講座の費用・合格率・学習スタイルを比較するサイト。',
      },
    ],
  };

  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${notoSansJP.className} bg-gray-50 text-gray-900`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX', { page_path: window.location.pathname });
        `}</Script>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
