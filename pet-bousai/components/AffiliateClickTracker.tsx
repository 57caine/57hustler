'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4イベント affiliate_click を送る。
 * 対象: rel に sponsored を含むリンク（＝楽天アフィリエイトリンク）
 * パラメータ: page_path, item_id（楽天の商品コード）, position（card / table）, product_name, product_category, destination
 * （個人情報は送らない）
 * GA4イベント product_compare_click: ページ内の「比較表を見る」リンク（data-compare-link）のクリック。比較表への遷移を数える
 * ※ page_path は gtag の予約パラメータのため、GA4 では独自項目にならず、自動で付く page_location（ページパス）として記録される
 * GA4 未導入（window.gtag が無い）ときは何もしない。
 */
export default function AffiliateClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest('a');
      if (!a) return;
      if (a.hasAttribute('data-compare-link')) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'product_compare_click', { page_path: pathname, link_location: a.dataset.compareLink ?? '' });
        }
        return;
      }
      const rel = a.getAttribute('rel') ?? '';
      if (!rel.split(/\s+/).includes('sponsored')) return;
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', 'affiliate_click', {
        page_path: pathname,
        item_id: a.dataset.itemId ?? '',
        position: a.dataset.position ?? '',
        product_name: a.dataset.productName ?? '',
        product_category: a.dataset.productCategory ?? '',
        destination: a.dataset.destination ?? 'rakuten',
      });
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
}
