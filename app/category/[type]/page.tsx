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
    title: 'ワンデーコンタクトレンズ 最安値比較【2026年版・全商品対応】',
    description: '1日使い捨てコンタクトレンズの最安値を送料込みで比較。アキュビュー・デイリーズ・バイオトゥルーなど人気全商品の価格を一覧で確認。',
  },
  '2week': {
    title: '2週間コンタクトレンズ 最安値比較【2026年版】',
    description: '2週間交換コンタクトレンズの最安値を送料込みで比較。アキュビューオアシス・シード2ウィークピュアなど人気全商品の価格を一覧で確認。',
  },
  monthly: {
    title: 'マンスリーコンタクトレンズ 最安値比較【2026年版】',
    description: '1ヶ月交換コンタクトレンズの最安値を送料込みで比較。バイオフィニティ・エアオプティクスなど人気全商品の価格を一覧で確認。',
  },
  color: {
    title: 'カラコン 最安値比較【2026年版・度あり・度なし対応】',
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

const categoryFaqs: Record<string, { q: string; a: string }[]> = {
  '1day': [
    { q: 'ワンデーコンタクトレンズはどこで最安値で買えますか？', a: '最安値はショップによって異なり日々変動します。当サイトでは24ショップの送料込み最安値をリアルタイムで比較しています。ページ上の価格比較表からその日の最安値をご確認ください。' },
    { q: 'ワンデーコンタクトレンズの相場はいくらですか？', a: 'ワンデーコンタクトの相場は1箱（30枚）あたり1,800〜5,000円です。ハイエンドモデル（デイリーズ トータルワン・アキュビュー オアシス）は3,000〜4,500円前後、コスパ重視モデル（アキュビュー モイスト・デイリーズ アクア）は1,800〜2,500円前後が目安です。' },
    { q: 'ワンデーと2weekコンタクトはどちらがコスパが良いですか？', a: '毎日使う場合は2week・マンスリーの方がランニングコストは安くなることが多いです。ただしケア用品代（月1,000〜2,000円）が別途かかります。週3〜4日以下の使用頻度なら2weekのコスパメリットが薄れるため、使用頻度で比較してください。' },
  ],
  '2week': [
    { q: '2週間コンタクトレンズで安いのはどれですか？', a: 'アキュビュー オアシス・シード 2ウィークピュア・メニコン2weekなどが人気の2weekレンズです。コスパ重視ならシードやメニコン系が比較的安く、乾きにくさ重視ならアキュビュー オアシスがおすすめです。通販最安値は当サイトの価格表でご確認ください。' },
    { q: '2weekコンタクトのケア用品は何を使えばいいですか？', a: 'MPS（マルチパーパスソリューション）が一般的です。レニュー・バイオトゥルー・オプティフリープラスなどが代表的な商品です。コンタクトを外したらすぐに洗浄・保存し、2週間を過ぎたら必ず交換してください。' },
    { q: '2週間コンタクトは水道水で洗えますか？', a: '絶対に水道水での洗浄・保存は行わないでください。水道水にはアカントアメーバなどの微生物が含まれており、角膜炎など深刻な目の病気の原因になります。必ず専用のケア用品（MPS）を使用してください。' },
  ],
  monthly: [
    { q: 'マンスリーコンタクトレンズで一番コスパが良いのはどれですか？', a: 'バイオフィニティ・エアオプティクスアクア・シード1monthピュアなどが人気です。シリコーンハイドロゲル素材（バイオフィニティ・エアオプティクス）は酸素透過率が高くコスパも良好。長時間装用が多い方には特におすすめです。' },
    { q: 'マンスリーコンタクトは本当に1ヶ月使えますか？', a: '「マンスリー」は使い始めから1ヶ月ではなく、開封から30日間（またはメーカー指定期間）が交換目安です。汚れ・タンパク質の蓄積により目への負担が増すため、期間を超えての使用は避けてください。' },
    { q: 'マンスリーとワンデーのコスト差はどのくらいですか？', a: '1日あたりのコストはマンスリーがワンデーの半額以下になることが多いです。ただしケア用品（月約1,000〜2,000円）を加えると差は縮まります。年間コストで比較するとマンスリーは15,000〜25,000円、ワンデーは25,000〜50,000円が目安です。' },
  ],
  color: [
    { q: 'カラコンは眼科の処方箋が必要ですか？', a: 'カラコンは度あり・度なしを問わず高度管理医療機器です。初めて使用する方・度数変更がある方は眼科で処方を受けることを強くおすすめします。同じ商品を継続購入する場合は処方箋不要で購入できるショップが多くあります。' },
    { q: '度なしカラコンは危険ですか？', a: '適切に使用すれば危険ではありません。しかし装用時間・使用期限を守らない・ケアが不十分な場合は角膜炎などのリスクがあります。必ず医療機器として認可されている製品を使用し、装用時間・使用期限を守ってください。' },
    { q: 'カラコンのDIAはどのくらいがおすすめですか？', a: '13.8〜14.2mmが自然な大きさとして人気です。14.5mm以上はよりドーリーな印象になりますが角膜を覆う面積が増えます。初めての方は14.0〜14.2mm程度から試すのがおすすめです。' },
  ],
};

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

  const faqs = categoryFaqs[type] ?? [];
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
      ...(faqs.length > 0 ? [{
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }] : []),
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

      {faqs.length > 0 && (
        <section className="mt-10 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="font-bold text-gray-900 text-sm mb-2">Q. {q}</p>
                <p className="text-sm text-gray-700 leading-relaxed">A. {a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        ※ 価格は税込・送料別。最終更新: {new Date().toLocaleDateString('ja-JP')} | 最新価格は各ショップでご確認ください。
      </div>
    </div>
  );
}
