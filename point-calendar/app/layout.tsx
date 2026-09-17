import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ポイントアップ日カレンダー（仮）',
    template: '%s | ポイントアップ日カレンダー（仮）',
  },
  description: '楽天お買い物マラソン・スーパーセールなど、ポイントアップ日・キャンペーン期間をまとめて確認できるカレンダー。エントリー忘れを防ぎます。',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} bg-gray-50 text-gray-900`}>
        <header className="bg-gradient-to-br from-sky-500 to-blue-600 text-white">
          <div className="max-w-3xl mx-auto px-4 py-5">
            <p className="text-sky-100 text-xs font-medium uppercase tracking-widest mb-1">
              Point Up Calendar (Prototype)
            </p>
            <h1 className="text-xl font-bold">ポイントアップ日カレンダー（仮）</h1>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gray-200 text-xs text-gray-500 py-6">
          <div className="max-w-3xl mx-auto px-4">
            プロトタイプ版です。掲載データは手入力の種データであり、自動取得は未実装です。
          </div>
        </footer>
      </body>
    </html>
  );
}
