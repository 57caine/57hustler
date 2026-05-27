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

export const metadata: Metadata = {
  metadataBase: new URL('https://57hustler-1vt8.vercel.app'),
  verification: {
    google: 'ms0YnowygFYwPKk3oWjnPGoyx0Jpox_yJAzBU8mVaA8',
  },
  title: {
    default: 'コンタクトレンズ最安値比較 | コンタクト最安値.com',
    template: '%s | コンタクト最安値.com',
  },
  description: 'アキュビュー、デイリーズ、シードなど人気コンタクトレンズの最安値を比較。スマイルコンタクト、アイシティなど主要ショップの価格を毎日自動更新。',
  keywords: ['コンタクトレンズ', '最安値', '価格比較', 'アキュビュー', 'ワンデー', 'カラコン', '通販'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'コンタクト最安値.com',
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
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} bg-gray-50 text-gray-900`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
