import type { Metadata } from 'next';
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCurrentSeason, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site-config';

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
  variable: '--font-noto-serif-jp',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}｜エリアとテーマで選ぶ宿泊予約ガイド`,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // 骨格段階のため、ドメイン確定・本公開までは検索エンジンにインデックスさせない
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, inLanguage: 'ja' },
      { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    ],
  };

  return (
    <html lang="ja" data-season={getCurrentSeason()} className={`${notoSans.variable} ${notoSerif.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
