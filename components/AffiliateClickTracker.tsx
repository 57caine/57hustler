'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type AffiliatePlatform = 'rakuten' | 'a8';

function getAffiliatePlatform(href: string): AffiliatePlatform | null {
  if (href.includes('afl.rakuten.co.jp') || href.includes('hb.afl.rakuten')) return 'rakuten';
  if (href.includes('px.a8.net')) return 'a8';
  return null;
}

function getCategory(pathname: string): string {
  const [, segment, slug = ''] = pathname.split('/');
  if (['vr', 'megane', 'eye-care', 'lasik', 'karakon', 'eye-goods'].includes(segment)) return segment;
  if (segment === 'column') {
    if (/vr|meta-quest|smart-glass|xr|apple-vision/.test(slug)) return 'vr';
    if (/megane|blue-light|sunglass|glare|reading-glass|sport-eye/.test(slug)) return 'megane';
    if (/eye-care|dryeye|hot-eye|lutein|eyestrain|floater|glaucoma|uv-eye|eye-stretch|eye-mask/.test(slug)) return 'eye-care';
    if (/lasik|icl|smile|ortho|multifocal/.test(slug)) return 'lasik';
    if (/karakon|korea-kara/.test(slug)) return 'karakon';
    if (/eye-goods|eye-roller|eye-cream|eyelash|smart-eyewear/.test(slug)) return 'eye-goods';
  }
  return 'contact';
}

// GA4イベント: affiliate_click
// パラメータ: affiliate_platform (rakuten|a8), link_url, link_text, page_path, category
// 計測対象: rel="sponsored" が付いたリンク（A8・楽天アフィリエイトリンクの必須属性）
export default function AffiliateClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (!target?.href) return;

      const rel = target.getAttribute('rel') ?? '';
      if (!rel.includes('sponsored')) return;

      const platform = getAffiliatePlatform(target.href);
      if (!platform || !window.gtag) return;

      window.gtag('event', 'affiliate_click', {
        affiliate_platform: platform,
        link_url: target.href,
        link_text: target.innerText?.trim().slice(0, 100) || '',
        page_path: pathname,
        category: getCategory(pathname),
      });
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
}
