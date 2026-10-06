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
 * パラメータ: page_path, product_name, product_category, destination（個人情報は送らない）
 * ※ page_path は gtag の予約パラメータのため、GA4 では独自項目にならず、自動で付く page_location（ページパス）として記録される
 * GA4 未導入（window.gtag が無い）ときは何もしない。
 */
export default function AffiliateClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest('a');
      if (!a) return;
      const rel = a.getAttribute('rel') ?? '';
      if (!rel.split(/\s+/).includes('sponsored')) return;
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', 'affiliate_click', {
        page_path: pathname,
        product_name: a.dataset.productName ?? '',
        product_category: a.dataset.productCategory ?? '',
        destination: a.dataset.destination ?? 'rakuten',
        transport_type: 'beacon',
      });
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
}
