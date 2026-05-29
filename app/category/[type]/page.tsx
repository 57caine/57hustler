import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
  getPricesForProduct,
} from '@/lib/products';
import ProductCard from '@/components/ProductCard';

type Props = { params: Promise<{ type: string }> };

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ type: c.slug }));
}

const categoryMeta: Record<string, { title: string; description: string }> = {
  '1day': {
    title: 'ワンデーコンタクトレンズ 最安値比較【2025年版・全商品対応】',
    description: '1日使い捨てコンタクトレンズの最安値を送料込みで比較。アキュビュー・デイリーズ・バイオトゥルーなど人気全商品の価格を一覧で確認。',
  },
  '2week': {
    title: '2週間コンタクトレンズ 最安値比較【2025年版】',
    description: '2週間交換コンタクトレンズの最安値を送料込みで比較。アキュビューオアシス・シード2ウィークピュアなど人気全商品の価格を一覧で確認。',
  },
  monthly: {
    title: 'マンスリーコンタクトレンズ 最安値比較【2025年版】',
    description: '1ヶ月交換コンタクトレンズの最安値を送料込みで比較。バイオフィニティ・エアオプティクスなど人気全商品の価格を一覧で確認。',
  },
  color: {
    title: 'カラコン 最安値比較【2025年版・度あり・度なし対応】',
    description: 'カラーコンタクトレンズの最安値を送料込みで比較。GEO・フレッシュルックなど人気全商品の価格を一覧で確認。度あり・度なし両方対応。',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const meta = categoryMeta[type];
  if (meta) return { title: meta.title, description: meta.description };
  const category = getCategoryBySlug(type);
  if (!category) return {};
  return {
    title: `${category.name}コンタクト 最安値比較`,
    description: `${category.name}コンタクトレンズの最安値を比較。${category.description}`,
  };
}

const categoryGuide: Record<string, { heading: string; points: string[]; note: string }> = {
  '1day': {
    heading: 'ワンデーコンタクトを選ぶポイント',
    points: [
      '毎日新しいレンズを使うので衛生面で安心。ケア用品が不要でコストと手間を削減',
      '乱視（トーリック）・遠近両用・カラーなど用途に合わせたラインナップが豊富',
      '価格は1箱（30枚）あたり1,800〜5,000円が目安。送料込み最安値はショップにより大きく異なる',
      '高含水・シリコーンハイドロゲル素材はドライアイの方に特におすすめ',
    ],
    note: '処方箋が不要なショップを利用すると、眼科に行かず同じ商品をリピート購入できて便利です。',
  },
  '2week': {
    heading: '2週間コンタクトを選ぶポイント',
    points: [
      '1日使い捨てよりコストを抑えられる。1箱（6枚）あたり1,500〜3,500円が目安',
      'ケア用品（洗浄・保存液）が別途必要。MPS（マルチパーパスソリューション）が一般的',
      '乱視用・遠近両用ラインも充実。BC・DIAのサイズ確認が重要',
      '2週間を過ぎての使用は汚れ・感染リスクが高まるため厳守を',
    ],
    note: '2週間タイプはまとめ買いでさらにコスト削減が可能。送料無料ラインを意識して購入枚数を調整しましょう。',
  },
  monthly: {
    heading: 'マンスリーコンタクトを選ぶポイント',
    points: [
      '1ヶ月交換タイプはランニングコストが最も安い。1箱（2〜6枚）あたり2,000〜4,500円が目安',
      'ケア用品（洗浄・保存液）の維持費も見込んで総コストを計算しよう',
      'シリコーンハイドロゲル素材（バイオフィニティ・エアオプティクス等）は長時間装用に向いている',
      '乱視用・遠近両用ラインも展開あり。処方箋の度数・BCを正確に確認',
    ],
    note: 'マンスリーは長期間使用するため、素材の酸素透過性にも注目。Dk/t値が高いほど目への負担が少ない。',
  },
  color: {
    heading: 'カラコンを選ぶポイント',
    points: [
      '度あり（PWR/±範囲確認必須）と度なし（PLANO）を間違えないよう注意',
      'DIA（レンズ直径）は大きいほど目が大きく見えるが、角膜を覆う面積が増えて負担も増加',
      '含水率・素材もチェック。使い捨てタイプは衛生管理が楽',
      '初めてのカラコンは必ず眼科で処方を受け、サイズと度数を確認してから購入を',
    ],
    note: 'カラコンは医療機器（高度管理医療機器）です。必ずショップの説明を確認し、使用期限・装用時間を守ってください。',
  },
};

export default async function CategoryPage({ params }: Props) {
  const { type } = await params;
  const category = getCategoryBySlug(type);
  if (!category) notFound();

  const products = getProductsByCategory(type);
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

  const guide = categoryGuide[type];
  const BASE = 'https://lens-navi.jp';
  const categoryLabel: Record<string, string> = {
    '1day': 'ワンデー',
    '2week': 'ツーウィーク',
    monthly: 'マンスリー',
    color: 'カラコン',
  };
  const label = categoryLabel[type] ?? category.name;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: BASE },
          { '@type': 'ListItem', position: 2, name: label, item: `${BASE}/category/${type}` },
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
        <span className="text-gray-800">{label}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {label}コンタクトレンズ 最安値比較
      </h1>
      <p className="text-gray-600 mb-6">{category.description}</p>

      {guide && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-8">
          <h2 className="text-base font-bold text-slate-800 mb-3">{guide.heading}</h2>
          <ul className="space-y-2 mb-4">
            {guide.points.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-gray-700">
                <span className="text-slate-400 shrink-0 mt-0.5">▸</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-600 bg-white rounded-lg p-3 border border-slate-200">{guide.note}</p>
        </div>
      )}

      {productsWithPrices.length === 0 ? (
        <p className="text-gray-500">このカテゴリの商品はありません。</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{productsWithPrices.length}商品を表示中（人気順）</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productsWithPrices.map((product, index) => (
              <ProductCard key={product.id} product={product} rank={index + 1} />
            ))}
          </div>
        </>
      )}

      <div className="mt-10 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        ※ 価格は税込・送料別。最終更新: {new Date().toLocaleDateString('ja-JP')} | 最新価格は各ショップでご確認ください。
      </div>
    </div>
  );
}
