import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBCValues, getProductsByBC } from '@/lib/products';

export const metadata: Metadata = {
  title: 'ベースカーブ（BC）で選ぶコンタクトレンズ | レンズナビ',
  description: 'BC 8.4・8.5・8.6・8.7・8.8別のコンタクトレンズおすすめ一覧。ベースカーブとは何か・自分のBCの調べ方から、BC値別おすすめ商品まで解説。',
};

const BC_DESC: Record<string, string> = {
  '8.4': 'アキュビュー系・マイデイなど比較的カーブのきついレンズ。角膜曲率が小さめの方に合いやすい。',
  '8.5': 'アキュビューオアシス・デイリーズトータルワンなど人気No.1クラスのBC値。日本人に最も多いBC。',
  '8.6': '最多商品数を誇るスタンダードBC。メニコン・バイオフィニティ・クラリティなど幅広い選択肢。',
  '8.7': 'デイリーズアクア・GEOカラコンなど緩やかカーブのレンズ。角膜が比較的フラットな方向け。',
  '8.8': 'シード製品を中心とした緩やかなBC。ワンデーピュア・ネオサイトなどシード愛用者向け。',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://lens-navi.jp' },
    { '@type': 'ListItem', position: 2, name: 'BCで選ぶ', item: 'https://lens-navi.jp/bc' },
  ],
};

export default function BCIndexPage() {
  const bcValues = getAllBCValues();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">BCで選ぶ</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        ベースカーブ（BC）で選ぶコンタクトレンズ
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        コンタクトレンズのBCは処方箋に記載されています。BC値別に対応商品とおすすめをまとめました。
      </p>

      {/* BCとは？ */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 mb-8">
        <h2 className="font-bold text-sky-800 mb-2">ベースカーブ（BC）とは？</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          BCはレンズの曲率（カーブの大きさ）を表す数値（mm）です。
          数値が小さいほどカーブがきつく、大きいほど緩やかです。
          眼科の処方箋に記載されているBCに合った商品を選ぶことが重要です。
          自己判断でBCを変えると、ずれやすさ・不快感・角膜への負担につながります。
        </p>
      </div>

      {/* BC別一覧 */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">BC値別 対応商品数</h2>
      <div className="space-y-4 mb-10">
        {bcValues.map((bc) => {
          const products = getProductsByBC(bc);
          return (
            <Link key={bc} href={`/bc/${bc}`} className="block group">
              <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-sky-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-sky-600 text-white font-bold px-4 py-1.5 rounded-lg text-lg min-w-[80px] text-center">
                      BC {bc}
                    </span>
                    <span className="text-sm text-gray-500">{products.length}商品</span>
                  </div>
                  <span className="text-sky-600 text-sm font-medium group-hover:underline">一覧を見る →</span>
                </div>
                <p className="text-sm text-gray-600">{BC_DESC[bc] ?? ''}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 関連コラム */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-800 mb-3">BC関連コラム</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/column/dosu-mikata" className="text-sky-700 hover:underline">
              コンタクトレンズの度数（PWR）の見方・読み方を徹底解説
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
