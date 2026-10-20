'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getAffiliatePlatform } from '@/lib/affiliate-platform';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
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

      // Intent events are separate from merchant clicks. No navigation interception.
      const growthEvent = target.dataset.growthEvent;
      if (growthEvent === 'comparison_navigation' || growthEvent === 'share_intent') {
        window.gtag?.('event', growthEvent, {
          page_path: pathname,
          source: target.dataset.growthSource || 'unknown',
          destination_path: new URL(target.href).pathname,
        });
        return;
      }
      const rel = target.getAttribute('rel') ?? '';
      if (!rel.includes('sponsored')) return;

      // Metadata is descriptive; the actual tracking host is authoritative.
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
