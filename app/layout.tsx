import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AffiliateClickTracker from '@/components/AffiliateClickTracker';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-HQG2DVFTZG';

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
    default: '目のことなら、レンズナビ。コンタクト・眼鏡・アイケア・レーシック総合情報',
    template: '%s | レンズナビ',
  },
  description: 'コンタクトレンズの最安値比較から眼鏡選び・VRゴーグル・レーシック・ドライアイ対策まで。目に関するすべての情報が揃う総合サイト「レンズナビ」。',
  keywords: ['コンタクトレンズ', '最安値', '眼鏡 選び方', 'VRゴーグル 視力', 'レーシック 費用', 'ドライアイ 目薬', 'ホットアイマスク おすすめ', 'アイケア'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'レンズナビ',
    url: 'https://lens-navi.jp',
    description: 'コンタクトレンズの最安値比較から眼鏡・VRゴーグル・レーシック・アイケアまで。目に関するすべての情報が揃う総合サイト。',
  },
  twitter: {
    card: 'summary',
    title: '目のことなら、レンズナビ。',
    description: 'コンタクトレンズの最安値比較から眼鏡・VRゴーグル・レーシック・アイケアまで。目に関するすべての情報が揃う総合サイト。',
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
        description: 'コンタクトレンズの最安値比較から眼鏡・VRゴーグル・レーシック・アイケアまで、目に関するすべての情報が揃う総合サイト。',
      },
    ],
  };

  return (
    <html lang="ja">
      <head>
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${notoSansJP.className} bg-gray-50 text-gray-900`}>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
        <AffiliateClickTracker />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
