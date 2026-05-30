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

const BASE = 'https://nsplot.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'プログラミングスクール比較2025 | スクールナビ',
    template: '%s | スクールナビ',
  },
  description: 'TECH CAMP、DMM WEBCAMP、RUNTEQなど人気プログラミングスクール8校を徹底比較。料金・転職成功率・給付金対応を一覧で確認。未経験からエンジニア転職を目指す方に。',
  keywords: ['プログラミングスクール', '比較', '転職', 'TECH CAMP', 'DMM WEBCAMP', '未経験', '給付金', 'エンジニア'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'スクールナビ',
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
        name: 'スクールナビ',
        description: 'プログラミングスクール比較サイト',
        inLanguage: 'ja',
      },
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'スクールナビ',
        url: BASE,
        description: 'プログラミングスクールの料金・転職成功率・給付金対応を比較するサイト。',
      },
    ],
  };

  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${notoSansJP.className} bg-gray-50 text-gray-900`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-E7XQY6BT4Q" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-E7XQY6BT4Q', { page_path: window.location.pathname });
        `}</Script>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
