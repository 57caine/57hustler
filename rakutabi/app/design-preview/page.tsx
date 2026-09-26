import type { Metadata } from 'next';
import HotelCard from '@/components/HotelCard';
import { FeatureTags, Rating } from '@/components/ui';
import { SEASONAL_FEATURES, SITE_CATCH } from '@/lib/site-config';
import { getAllHotels } from '@/lib/hotels';

/**
 * 季節4パターンの配色を並べて確認するためのページ（オーナー確認用。サイト内からはリンクしていない）。
 * 色は app/globals.css の [data-season] ブロックで定義している。
 */
export const metadata: Metadata = { title: '配色プレビュー', robots: { index: false, follow: false } };

// Tailwindが検出できるよう、クラス名は完全な文字列で書く
const SWATCHES: [string, string][] = [
  ['主色', 'bg-season'],
  ['淡色', 'bg-season-soft'],
  ['補助色', 'bg-season-accent'],
  ['背景', 'bg-season-surface'],
  ['ヒーロー始点', 'bg-season-hero-from'],
  ['ヒーロー終点', 'bg-season-hero-to'],
  ['予約ボタン', 'bg-cta'],
];

export default function DesignPreviewPage() {
  const sample = getAllHotels().find((h) => h.imageUrl && h.reviewAverage != null);
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-2">配色プレビュー（季節4パターン）</h1>
        <p className="text-sm text-gray-600">
          サイト全体は、ビルド時点の季節（日本時間の月）の配色で表示されます。色コードは app/globals.css で一括管理しています。
        </p>
      </div>
      {SEASONAL_FEATURES.map((f) => (
        <section key={f.season} data-season={f.season} className="rounded-3xl overflow-hidden ring-1 ring-black/10 bg-season-surface">
          <div className="bg-gradient-to-br from-season-hero-from to-season-hero-to px-8 py-12 text-white">
            <p className="text-sm opacity-90">{f.label}（{f.season}）</p>
            <p className="font-serif text-3xl font-bold">{SITE_CATCH}</p>
          </div>
          <div className="p-8 grid md:grid-cols-[1fr_320px] gap-8 items-start">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-season">見出し（明朝体・主色）</h2>
              <p className="text-sm">本文はゴシック体（Noto Sans JP）です。<span className="text-season-accent">補助色のテキスト</span></p>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="bg-cta text-white font-bold rounded-lg px-4 py-2.5 text-sm">楽天トラベルで予約</span>
                <span className="border border-season text-season font-bold rounded-lg px-4 py-2.5 text-sm">宿の詳細を見る</span>
              </div>
              <FeatureTags conditions={['onsen', 'meal', 'kids', 'view']} />
              <Rating average={4.52} count={1234} />
              <div className="flex gap-2 text-xs">
                {SWATCHES.map(([label, cls]) => (
                  <div key={label} className="text-center">
                    <div className={`w-12 h-12 rounded-lg ring-1 ring-black/10 ${cls}`} />
                    <p className="mt-1 text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            {sample && <HotelCard hotel={sample} />}
          </div>
        </section>
      ))}
    </div>
  );
}
