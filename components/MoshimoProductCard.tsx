import type { MoshimoProduct } from '@/lib/moshimo';

// もしもアフィリエイト「かんたんリンク」から抽出した商品データを、
// 画像付きの商品紹介カードとして表示する。
// imageUrlが無い場合は画像を省略し、テキスト+CTAボタンのみで表示する
// （既存の他カードと同じフォールバック挙動）。
export default function MoshimoProductCard({ product }: { product: MoshimoProduct }) {
  return (
    <div className="my-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
      {product.imageUrl && (
        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm font-medium text-gray-800 leading-snug mb-3 line-clamp-3">
          {product.name}
        </p>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="block w-full text-center text-sm font-bold text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: product.buttonColor }}
        >
          {product.buttonText} →
        </a>
      </div>
    </div>
  );
}
