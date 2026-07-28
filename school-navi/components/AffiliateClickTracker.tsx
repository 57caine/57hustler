'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// school-navi 全ページのカテゴリは 'school' 固定
// GA4イベント: affiliate_click
// パラメータ: affiliate_platform (a8), link_url, link_text, page_path, category
export default function AffiliateClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (!target?.href) return;

      const rel = target.getAttribute('rel') ?? '';
      if (!rel.includes('sponsored')) return;

      const isA8 = target.href.includes('px.a8.net');
      if (!isA8 || !window.gtag) return;

      window.gtag('event', 'affiliate_click', {
        affiliate_platform: 'a8',
        link_url: target.href,
        link_text: target.innerText?.trim().slice(0, 100) || '',
        page_path: pathname,
        category: 'school',
      });
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
}
