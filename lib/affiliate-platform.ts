export type AffiliatePlatform = 'rakuten' | 'a8';

// Identify the actual tracking destination, never a hostname embedded in a query.
// A store's partnership alone does not make an arbitrary product URL attributable.
export function getAffiliatePlatform(href: string): AffiliatePlatform | null {
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:') return null;
    if (url.hostname === 'px.a8.net') return 'a8';
    if (url.hostname === 'afl.rakuten.co.jp' || url.hostname.endsWith('.afl.rakuten.co.jp')) return 'rakuten';
  } catch { /* malformed or relative destination */ }
  return null;
}
