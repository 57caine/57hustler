import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllBrands,
  getBrandBySlug,
  getProductsByBrand,
  getPricesForProduct,
} from '@/lib/products';
import ProductCard from '@/components/ProductCard';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBrands().map((b) => ({ slug: b.slug }));
}

const brandDescriptions: Record<string, { tagline: string; description: string; strengths: string[] }> = {
  acuvue: {
    tagline: '世界シェアNo.1コンタクトブランド',
    description: 'アキュビューは、ジョンソン・エンド・ジョンソン（米国）が開発・販売する世界最大シェアのコンタクトレンズブランドです。1日使い捨てを世界で初めて製品化した革新的なブランドで、HYDRALUXE・HYDRACLEARなど独自の保湿技術で「乾きにくさ」に定評があります。',
    strengths: ['世界最大シェア・最多の種類ラインナップ', '独自の保湿技術（HYDRALUXE）で乾きにくい', 'シリコーンハイドロゲル・UV保護など技術面で先進的', '乱視用・遠近両用・カラーラインも充実'],
  },
  alcon: {
    tagline: '水勾配テクノロジーを持つ眼科専門メーカー',
    description: 'アルコン（Alcon、スイス本社）は眼科医療機器・コンタクトレンズで世界をリードするメーカーです。デイリーズ トータルワンの「水勾配テクノロジー」は、レンズ表面の含水率を80%以上に高めた革新的技術。乾燥感が気になる方に特に支持されています。',
    strengths: ['デイリーズ トータルワンの水勾配テクノロジー', 'DAILIESシリーズで1日使い捨てのバリエーションが豊富', '眼科医療機器メーカーとしての高い信頼性', '遠近両用・乱視用ラインも完備'],
  },
  seed: {
    tagline: '国産コンタクトの老舗。安心の品質',
    description: 'シード（Seed）は東京都文京区に本社を置く日本の老舗コンタクトレンズメーカーです。1957年創業という長い歴史を持ち、国内シェアで高い実績を誇ります。ワンデー ピュア・2ウィーク ピュアなどシンプルで安定した品質が評価されています。',
    strengths: ['国内製造・国産ブランドの安心感', '豊富な度数レンジで幅広い視力に対応', 'コストパフォーマンスが高い', 'カラコン（アイコフレ）ラインも人気'],
  },
  menicon: {
    tagline: '国内最大のコンタクトメーカーが作る高品質レンズ',
    description: 'メニコン（Menicon）は愛知県名古屋市に本社を置く日本最大のコンタクトレンズ専業メーカーです。1951年創業と業界最長の歴史を誇り、独自のモノメット素材や高い酸素透過性を実現するレンズを多数開発。定期交換型コンタクトのパイオニアでもあります。',
    strengths: ['国内最大規模のコンタクト専業メーカー', '高い酸素透過性素材の開発で定評', '1日・2週間・マンスリーと交換サイクル全対応', 'メニコンメニーの定期配送サービスも展開'],
  },
  coopervision: {
    tagline: 'バイオフィニティ・クラリティで知られる米国大手',
    description: 'クーパービジョン（CooperVision、米国）はバイオフィニティ・プロクリアなどのブランドで知られるグローバルなコンタクトレンズメーカーです。シリコーンハイドロゲル素材の普及をリードし、乾燥感に配慮した製品設計が特徴。特に長時間装用が多い方に支持されています。',
    strengths: ['バイオフィニティの高い酸素透過率（Dk/t 160）', 'プロクリアの含水率57%で長時間潤い', 'マンスリー・2week中心の経済的なラインナップ', 'トーリック・マルチフォーカル対応も充実'],
  },
  bausch: {
    tagline: '眼科医療150年以上の歴史を持つ信頼ブランド',
    description: 'ボシュロム（Bausch + Lomb、米国）は1853年創業という160年以上の歴史を持つ眼科医療の老舗メーカーです。バイオトゥルーの「含水率78%（角膜と同じ水分量）」という設計思想や、ウルトラのMoistureSeal技術など、ドライアイ対策に強みを持つラインが豊富です。',
    strengths: ['バイオトゥルーの含水率78%で長時間快適', 'ウルトラシリーズのMoistureSeal技術', '眼科医療機器メーカーとしての信頼性', '乱視用・マンスリーラインも完備'],
  },
  geo: {
    tagline: '世界60カ国以上に展開するカラコン専門ブランド',
    description: 'GEO（GEO Medical、韓国）はカラーコンタクトレンズに特化した韓国発のブランドです。世界60カ国以上に輸出されており、豊富なカラーバリエーションと手頃な価格が人気の理由。度あり・度なし両方対応で、ナチュラル系から個性的なデザインまで幅広いラインナップを展開しています。',
    strengths: ['カラコン専門ブランドで種類が豊富', '手頃な価格と良質な品質のバランス', 'ナチュラル系から個性派まで幅広いデザイン', '度あり・度なし両方対応'],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  const desc = brandDescriptions[slug];
  return {
    title: `${brand.name}コンタクトレンズ 最安値比較【2026年版】`,
    description: desc?.description.slice(0, 120) ?? `${brand.name}（${brand.manufacturer}）のコンタクトレンズ最安値を比較。`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const brandInfo = brandDescriptions[slug];
  const products = getProductsByBrand(slug);
  const productsWithPrices = products
    .map((product) => {
      const prices = getPricesForProduct(product.id);
      return {
        ...product,
        prices,
        lowestPrice: prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null,
        highestPrice: prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : null,
      };
    })
    .sort((a, b) => b.popularity - a.popularity);

  const BASE = 'https://lens-navi.jp';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Brand',
        name: brand.name,
        description: brandInfo?.description,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: brand.name, item: `${BASE}/brand/${slug}` },
        ],
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{brand.name}</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 mb-1">{brand.country} | {brand.manufacturer}</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {brand.name}コンタクトレンズ
            </h1>
            {brandInfo && (
              <p className="text-sm font-medium text-slate-600 mb-3">{brandInfo.tagline}</p>
            )}
          </div>
        </div>

        {brandInfo && (
          <>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{brandInfo.description}</p>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">ブランドの強み</p>
              <ul className="grid sm:grid-cols-2 gap-1">
                {brandInfo.strengths.map((s) => (
                  <li key={s} className="flex gap-2 text-xs text-gray-700">
                    <span className="text-slate-400 shrink-0">▸</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {productsWithPrices.length === 0 ? (
        <p className="text-gray-500">このブランドの商品はありません。</p>
      ) : (
        <>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {brand.name}の商品一覧（{productsWithPrices.length}商品）
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productsWithPrices.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      <div className="mt-8 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        ※ 価格は税込・送料別の目安。最終更新: {new Date().toLocaleDateString('ja-JP')} | 最新価格は各ショップでご確認ください。
      </div>
    </div>
  );
}
