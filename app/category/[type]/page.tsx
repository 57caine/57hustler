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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const category = getCategoryBySlug(type);
  if (!category) return {};
  return {
    title: `${category.name}コンタクト 最安値比較`,
    description: `${category.name}コンタクトレンズの最安値を比較。${category.description}`,
  };
}

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{category.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {category.name}コンタクトレンズ 最安値比較
      </h1>
      <p className="text-gray-600 mb-8">{category.description}</p>

      {productsWithPrices.length === 0 ? (
        <p className="text-gray-500">このカテゴリの商品はありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsWithPrices.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
