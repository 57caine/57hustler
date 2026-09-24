import type { Metadata } from 'next';
import HoikuHeader from '@/components/hoiku/HoikuHeader';
import HoikuFooter from '@/components/hoiku/HoikuFooter';
import { HOIKU_BASE_URL, HOIKU_INDEXABLE, HOIKU_SITE_NAME } from '@/lib/hoiku/config';

// /hoiku 配下専用レイアウト。資格ナビ本体のヘッダー・フッター・JSON-LD（app/(shikaku)/layout.tsx）は適用されない
export const metadata: Metadata = {
  title: {
    // absolute: 親（ルート）レイアウトの「%s | 資格ナビ」テンプレートを適用させない
    absolute: `保育士転職サイト比較【2026年版】おすすめランキング｜${HOIKU_SITE_NAME}`,
    template: `%s｜${HOIKU_SITE_NAME}`,
  },
  description:
    '保育士バンク！・ジョブメドレー・マイナビ保育士など、保育士向け転職サービスを比較。対応エリア・サポート内容・目的別の選び方を紹介します。',
  alternates: { canonical: HOIKU_BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: HOIKU_SITE_NAME,
    url: HOIKU_BASE_URL,
  },
  robots: HOIKU_INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

export default function HoikuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HoikuHeader />
      <main className="min-h-screen">{children}</main>
      <HoikuFooter />
    </>
  );
}
