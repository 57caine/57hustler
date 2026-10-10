import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TriangleAlert } from 'lucide-react';
import { getAllBCValues, getProductsByBC, getProductWithPrices } from '@/lib/products';
import { calcTotalPrice } from '@/lib/products';

type Props = { params: Promise<{ value: string }> };

const VALID_BC = ['8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '9.0'];

const BC_GUIDE: Record<string, { title: string; desc: string; note: string }> = {
  '8.4': {
    title: 'BC8.4のコンタクトレンズ一覧｜対応製品と価格を比較',
    desc: 'BC8.4に対応するコンタクトレンズを一覧で確認。装用期間・DIA・価格を比較し、眼科で指定された製品・規格と一致するか確認しましょう。',
    note: 'BCが同じでも製品によって装用感は異なります。BCの数値だけで適合を判断せず、眼科で確認した製品・規格に従ってください。',
  },
  '8.5': {
    title: 'BC 8.5のコンタクトレンズ おすすめ一覧',
    desc: 'BC 8.5は日本人に最も多いBC値のひとつ。アキュビューオアシス ワンデー・デイリーズ トータルワン・1デイ アキュビュー モイストなど人気商品が集中しています。',
    note: '日本人の標準的な角膜カーブに合いやすく、選択肢が豊富なBC値です。',
  },
  '8.6': {
    title: 'BC 8.6のコンタクトレンズ おすすめ一覧',
    desc: 'BC 8.6は対応商品数が最多のBC値。メニコン・バイオフィニティ・クラリティワンデー・バイオトゥルーワンデーなど、幅広いブランドから選べます。',
    note: 'スタンダードなBC値で、最も多くの商品が対応しています。',
  },
  '8.7': {
    title: 'BC 8.7のコンタクトレンズ おすすめ一覧',
    desc: 'BC 8.7はやや緩やかなカーブのBC値。デイリーズ アクア コンフォートプラスやGEOカラコン系に多いBC値です。',
    note: '角膜のカーブが比較的緩やかな方に処方されやすいBC値です。',
  },
  '8.8': {
    title: 'BC 8.8のコンタクトレンズ おすすめ一覧',
    desc: 'BC 8.8はシード製品を中心とした緩やかなBC値。ワンデーピュア うるおいプラス・ネオサイト ワンデーシリコーンUVなど、シード愛用者向けの商品が揃います。',
    note: '主にシードブランドのコンタクトレンズに多いBC値です。',
  },
};

export async function generateStaticParams() {
  return getAllBCValues().map((value) => ({ value }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { value } = await params;
  const guide = BC_GUIDE[value];
  if (!guide) return {};
  return {
    title: `${guide.title} | レンズナビ`,
    description: guide.desc,
    alternates: { canonical: `https://lens-navi.jp/bc/${value}` },
    keywords: [`コンタクト BC${value}`, `BC${value} コンタクト`, `ベースカーブ${value}`, `BC ${value} おすすめ`],
  };
}

export default async function BCValuePage({ params }: Props) {
  const { value } = await params;

  if (!VALID_BC.includes(value)) notFound();

  const products = getProductsByBC(value);
  if (products.length === 0) notFound();

  const guide = BC_GUIDE[value] ?? {
    title: `BC ${value}のコンタクトレンズ一覧`,
    desc: `BC ${value}に対応したコンタクトレンズの一覧です。`,
    note: '',
  };

  const productsWithPrices = products
    .map((p) => getProductWithPrices(p.slug))
    .filter(Boolean)
    .sort((a, b) => (b!.popularity ?? 0) - (a!.popularity ?? 0));

  const allBCValues = getAllBCValues();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://lens-navi.jp' },
          { '@type': 'ListItem', position: 2, name: 'BCで選ぶ', item: 'https://lens-navi.jp/bc' },
          { '@type': 'ListItem', position: 3, name: `BC ${value}`, item: `https://lens-navi.jp/bc/${value}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `BC ${value} コンタクトレンズ一覧`,
        numberOfItems: productsWithPrices.length,
        itemListElement: productsWithPrices.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p!.name,
          url: `https://lens-navi.jp/product/${p!.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/bc" className="hover:text-slate-700">BCで選ぶ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">BC {value}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {guide.title}
      </h1>
      <p className="text-gray-600 text-sm mb-2">{guide.desc}</p>
      {guide.note && (
        <p className="text-xs text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 mb-6">
          ℹ️ {guide.note}
        </p>
      )}

      {value === '8.4' && (
        <div className="mb-6 rounded-lg border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
          <p className="font-semibold mb-2">BC8.4のコンタクトを探す前に</p>
          <p className="leading-relaxed">BC（ベースカーブ）はレンズの曲率を表す数値です。BC8.4という数字だけで商品を決めず、眼科で確認した製品名・度数・DIA・装用期間と照合してください。</p>
          <p className="mt-2">初めて通販を利用する場合は、<Link href="/column/contact-net-kounyu-guide" className="text-sky-700 underline underline-offset-2">コンタクトのネット購入ガイド</Link>も参考にしてください。</p>
        </div>
      )}

      {/* BC切り替えタブ */}
      <div className="flex gap-2 flex-wrap mb-8">
        {allBCValues.map((bc) => (
          <Link key={bc} href={`/bc/${bc}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              bc === value
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
            }`}>
            BC {bc}
          </Link>
        ))}
      </div>

      {/* 商品一覧 */}
      <p className="text-xs text-gray-400 mb-4">{productsWithPrices.length}商品 ／ 人気順</p>
      <div className="space-y-4">
        {productsWithPrices.map((product, i) => {
          if (!product) return null;
          const cheapest = product.prices[0];
          const totalPrice = cheapest ? calcTotalPrice(cheapest.price, cheapest.store) : null;

          return (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-sky-50 text-sky-600 font-bold text-xl w-10 h-10 flex items-center justify-center rounded-lg shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">{product.brandName}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      BC {product.bc} / DIA {product.dia}
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-base leading-snug mb-2">
                    <Link href={`/product/${product.slug}`} className="hover:text-sky-700 transition-colors">
                      {product.name}
                    </Link>
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {totalPrice ? (
                      <div>
                        <span className="text-xs text-gray-400">最安値（送料込）</span>
                        <p className="text-lg font-bold text-sky-700">
                          ¥{totalPrice.toLocaleString()}
                          <span className="text-xs font-normal text-gray-400 ml-1">〜</span>
                        </p>
                        {cheapest && (
                          <p className="text-xs text-gray-400">{cheapest.store.name}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">価格情報なし</p>
                    )}
                    <Link href={`/product/${product.slug}`}
                      className="shrink-0 bg-sky-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors">
                      価格を比較 →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 注意事項 */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800 font-bold mb-1 flex items-center gap-1.5">
          <TriangleAlert className="w-4 h-4 flex-shrink-0" />
          BCは必ず処方箋に従って選んでください
        </p>
        <p className="text-xs text-amber-700 leading-relaxed">
          BCは眼科での検査・処方が必要です。自己判断でBCを変えるとレンズのずれ・不快感・角膜への負担につながります。
          初めてコンタクトを購入する方は必ず眼科を受診してください。
        </p>
      </div>

    </div>
  );
}
