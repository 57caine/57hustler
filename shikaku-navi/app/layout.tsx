import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const BASE = 'https://shikaku.lens-navi.jp';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: '資格ナビ｜資格取得・通信講座を徹底比較【2026年版】',
    template: '%s | 資格ナビ',
  },
  description: 'スタディング・フォーサイト・アガルートなど人気資格通信講座10社を徹底比較。宅建・簿記・FP・社労士など国家資格の通信講座を費用・合格率・学習スタイルで比較できます。',
  keywords: ['資格通信講座', '比較', '宅建', '簿記', 'FP', '社労士', '行政書士', 'スタディング', 'フォーサイト', 'アガルート'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: '資格ナビ',
    url: BASE,
    description: 'スタディング・フォーサイト・アガルートなど人気資格通信講座10社を徹底比較。宅建・簿記・FP・社労士の通信講座を費用・合格率で比較。',
  },
  twitter: {
    card: 'summary',
    title: '資格ナビ｜資格取得・通信講座を徹底比較【2026年版】',
    description: 'スタディング・フォーサイト・アガルートなど人気資格通信講座10社を徹底比較。費用・合格率・学習スタイルで比較。',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} bg-gray-50 text-gray-900`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX', { page_path: window.location.pathname });
        `}</Script>
        {/* ヘッダー・フッター・サイト単位のJSON-LDは各ルートグループのlayoutで出し分ける
            （資格ナビ本体: app/(shikaku)/layout.tsx ／ 保育士転職ナビ: app/hoiku/layout.tsx） */}
        {children}
      </body>
    </html>
  );
}
