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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name}コンタクト 最安値比較`,
    description: `${brand.name}（${brand.manufacturer}）のコンタクトレンズ最安値を比較。`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const products = getProductsByBrand(slug);
  const productsWithPrices = products.map((product) => {
    const prices = getPricesForProduct(product.id);
    return {
      ...product,
      prices,
      lowestPrice: prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null,
      highestPrice: prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : null,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{brand.name}</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {brand.name}コンタクトレンズ
        </h1>
        <p className="text-gray-500">{brand.manufacturer} | {brand.country}</p>
      </div>

      {productsWithPrices.length === 0 ? (
        <p className="text-gray-500">このブランドの商品はありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsWithPrices.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
