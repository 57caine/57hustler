// Inspect rendered anchors only; serialized React data is not a clickable purchase CTA.
export function inspectPurchaseCtas(html) {
  const counts = { a8: 0, rakuten: 0 };
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = Object.fromEntries([...match[1].matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m => [m[1].toLowerCase(), m[3]]));
    if (!(attrs.rel ?? '').split(/\s+/).includes('sponsored')) continue;
    const label = match[2].replace(/<[^>]*>/g, '');
    if (!/販売価格を確認|このショップで1箱の価格を確認/.test(label)) continue;
    try {
      const url = new URL(attrs.href?.replaceAll('&amp;', '&'));
      if (url.protocol !== 'https:') continue;
      if (url.hostname === 'px.a8.net') counts.a8++;
      if (url.hostname === 'afl.rakuten.co.jp' || url.hostname.endsWith('.afl.rakuten.co.jp')) counts.rakuten++;
    } catch { /* Missing or malformed href is not a purchase link. */ }
  }
  return counts;
}


// Require an actual comparison anchor in article content, not navigation or React data.
// The existing live check also verifies /category/1day itself responds successfully.
export function hasColumnComparisonLink(html) {
  const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const articles = [...rendered.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)];
  for (const [, article] of articles) {
    for (const match of article.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
      const attrs = Object.fromEntries([...match[1].matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)]
        .map(m => [m[1].toLowerCase(), m[3]]));
      if (!attrs.href || !match[2].replace(/<[^>]*>/g, '').trim()) continue;
      try {
        const url = new URL(attrs.href.replaceAll('&amp;', '&'), 'https://www.lens-navi.jp');
        if (url.protocol === 'https:' && url.hostname === 'www.lens-navi.jp' &&
            !url.port && !url.username && !url.password && url.pathname === '/category/1day') return true;
      } catch { /* Invalid href does not establish a usable comparison path. */ }
    }
  }
  return false;
}
