import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import AffiliateClickTracker from '@/components/AffiliateClickTracker';
import Analytics from '@/components/Analytics';
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: { default: SITE_NAME, template: `%s｜${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  // 独自ドメイン設定＋オーナー承認（PET_BOUSAI_INDEXABLE=true）までは全ページ noindex
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between gap-3">
            <Link href="/" className="font-bold text-brand-800 text-base leading-tight">
              {SITE_NAME}
            </Link>
            <Link href="/checklist" className="text-xs text-brand-700 underline whitespace-nowrap">
              持ち物チェックリスト
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 pb-16">{children}</main>
        <footer className="border-t border-gray-200 bg-gray-50 text-sm">
          <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
            <p className="text-xs leading-relaxed text-gray-600">
              当サイトは楽天アフィリエイトを利用しており、商品の紹介には広告が含まれます。
              公的な情報は環境省の資料をもとに記載し、各ページに出典を示しています。
            </p>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              <Link href="/about" className="underline text-gray-700">運営者情報・広告について</Link>
              <Link href="/privacy" className="underline text-gray-700">プライバシーポリシー</Link>
              <Link href="/sources" className="underline text-gray-700">出典・参考資料</Link>
            </nav>
            <p className="text-xs text-gray-500">© 2026 {SITE_NAME}</p>
          </div>
        </footer>
        <AffiliateClickTracker />
        <Analytics />
      </body>
    </html>
  );
}
