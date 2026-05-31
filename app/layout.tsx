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

export const metadata: Metadata = {
  metadataBase: new URL('https://lens-navi.jp'),
  verification: {
    google: 'ms0YnowygFYwPKk3oWjnPGoyx0Jpox_yJAzBU8mVaA8',
  },
  title: {
    default: 'コンタクトレンズ最安値比較 | レンズナビ',
    template: '%s | レンズナビ',
  },
  description: 'アキュビュー、デイリーズ、シードなど人気コンタクトレンズの最安値を比較。スマイルコンタクト、アイシティなど主要ショップの価格を毎日自動更新。',
  keywords: ['コンタクトレンズ', '最安値', '価格比較', 'アキュビュー', 'ワンデー', 'カラコン', '通販'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'レンズナビ',
    url: 'https://lens-navi.jp',
    description: 'アキュビュー、デイリーズ、シードなど人気コンタクトレンズの最安値を比較。スマイルコンタクト、アイシティなど主要ショップの価格を毎日自動更新。',
  },
  twitter: {
    card: 'summary',
    title: 'コンタクトレンズ最安値比較 | レンズナビ',
    description: 'アキュビュー、デイリーズ、シードなど人気コンタクトレンズの最安値を比較。主要ショップの価格を毎日自動更新。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://lens-navi.jp/#website',
        url: 'https://lens-navi.jp',
        name: 'レンズナビ',
        description: 'コンタクトレンズの最安値を比較するサイト',
        inLanguage: 'ja',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://lens-navi.jp/ranking',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://lens-navi.jp/#organization',
        name: 'レンズナビ',
        url: 'https://lens-navi.jp',
        description: 'コンタクトレンズの最安値比較サイト。アキュビュー・デイリーズ・シードなど人気商品を24店舗で比較。',
      },
    ],
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${notoSansJP.className} bg-gray-50 text-gray-900`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HQG2DVFTZG"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HQG2DVFTZG', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
