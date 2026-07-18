'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function getAffiliatePlatform(href: string): 'rakuten' | null {
  if (href.includes('rakuten.co.jp') || href.includes('afl.rakuten')) return 'rakuten';
  return null;
}

export default function AffiliateClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (!target?.href) return;
      const platform = getAffiliatePlatform(target.href);
      if (!platform || !window.gtag) return;

      window.gtag('event', 'affiliate_click', {
        affiliate_platform: platform,
        link_url: target.href,
        link_text: target.innerText?.trim().slice(0, 100) || '',
        page_path: pathname,
      });
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
}
