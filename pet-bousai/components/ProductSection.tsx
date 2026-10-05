import { getGroup } from '@/lib/product-groups';
import { formatFetchedDate, loadProducts } from '@/lib/products';

/**
 * 楽天市場の商品紹介（広告）。公的情報の枠とは分けて、ページ後半に置く。
 * - 価格は表示しない（毎日の更新をしないため、古い価格を出さない）
 * - 並びは楽天の検索結果の標準順で、当サイトによる順位付けではない
 * - 1商品＝1リンク。カード全体が商品ページへのリンクで、商品名を必ず表示する
 */
export default function ProductSection({ groupIds, intro }: { groupIds: string[]; intro?: string }) {
  const data = loadProducts();
  return (
    <section className="mt-10 border-t-4 border-gray-200 pt-6" data-product-section>
      <p className="inline-block rounded bg-gray-700 px-2 py-0.5 text-xs font-bold text-white">広告</p>
      <h2 className="mt-2 text-lg font-bold">楽天市場で用品を探す</h2>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        {intro ?? 'ここから先は楽天市場の商品紹介（広告）です。'}
        掲載順は楽天市場の検索結果の標準順で、当サイトによるおすすめ順位ではありません。
        価格・在庫・仕様・サイズは、リンク先の商品ページで確認してください。
      </p>
      {groupIds.map((id) => {
        const group = getGroup(id);
        const items = data?.groups[id] ?? [];
        return (
          <div key={id} className="mt-6">
            <h3 className="text-base font-bold">{group.label}</h3>
            {items.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500" data-products-empty>
                商品情報は公開時に楽天市場から取得します。
              </p>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((p) => (
                  <li key={p.itemCode}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      data-affiliate
                      data-product-name={p.name.slice(0, 100)}
                      data-product-category={group.category}
                      data-destination="rakuten"
                      className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-brand-600 transition-colors"
                    >
                      {/* 楽天APIが提供する画像URLをそのまま表示する（加工しない） */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imageUrl}
                        alt=""
                        width={96}
                        height={96}
                        loading="lazy"
                        className="h-24 w-24 flex-none rounded object-contain bg-gray-50"
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-medium leading-snug line-clamp-3">{p.name}</span>
                        <span className="mt-1 text-xs text-gray-500 truncate">{p.shopName}</span>
                        <span className="mt-auto pt-2 text-xs font-bold text-brand-700">楽天市場で商品ページを見る →</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
      {data && (
        <p className="mt-4 text-xs text-gray-500" data-products-fetched>
          商品情報の取得日：{formatFetchedDate(data.fetchedAt)}（楽天市場 商品検索APIより）
        </p>
      )}
    </section>
  );
}
