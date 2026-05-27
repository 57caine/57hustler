import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProductsWithPrices } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'コンタクトレンズ人気ランキング',
  description:
    '売れ筋コンタクトレンズランキング。アキュビュー、デイリーズなど人気商品の最安値を比較。',
};

export default function RankingPage() {
  const ranked = getAllProductsWithPrices().sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">人気ランキング</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        🏆 コンタクトレンズ 人気ランキング
      </h1>
      <p className="text-gray-600 mb-8">
        当サイトで最も閲覧されているコンタクトレンズのランキングです。
      </p>

      <div className="space-y-3">
        {ranked.map((product, index) => (
          <ProductCard key={product.id} product={product} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
