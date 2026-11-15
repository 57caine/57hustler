// Build explicitly authorized first-party campaigns; keep destinations and attribution narrow.
export function buildOrganicMessage(post, brand) {
  if (typeof post.text !== 'string' || !post.text.trim() || post.text.length > 500 || /https?:\/\/|【PR】|#PR|アフィリエイト/i.test(post.text)) {
    throw new Error('Invalid organic draft text');
  }
  if (post.previousTexts !== undefined && (!Array.isArray(post.previousTexts) || post.previousTexts.length > 3 || post.previousTexts.some(t => typeof t !== 'string' || !t.trim() || t.length > 500))) {
    throw new Error('Invalid legacy draft history');
  }
  let message = post.text;
  if (post.url !== undefined) {
    if (!['lens', 'rakutabi'].includes(brand) || typeof post.url !== 'string') throw new Error('Unauthorized linked campaign');
    let url;
    try { url = new URL(post.url); } catch { throw new Error('Invalid article URL'); }
    const isLens = brand === 'lens';
    // One owner-authorized 24lens test: go directly to the verified buying guide,
    // avoiding an extra hop via an older article. All other Lens posts stay locked
    // to the original Lens Navi article allowlist.
    const direct24lens = isLens && post.day === 17 &&
      url.host === 'jarvis-affiliate.vercel.app' && url.pathname === '/lp/24lens-order-check/';
    const required = direct24lens
      ? {utm_source:'threads', utm_medium:'social', utm_campaign:'24lens_pilot', utm_content:'lens_day_17'}
      : isLens
      ? {utm_source:'threads', utm_medium:'social', utm_campaign:'lens_online_buying_202610', utm_content:'lens_day_'+post.day}
      : {utm_source:'threads', utm_medium:'social', utm_campaign:'rakutabi_ito_202610', utm_content:'rakutabi_day_9'};
    const destinationAllowed = isLens
      ? direct24lens || (url.host === 'www.lens-navi.jp' && /^\/column\/[a-z0-9-]+$/.test(url.pathname))
      : post.day === 9 && url.host === 'rakutabi-nine.vercel.app' && url.pathname === '/area/ito';
    if (url.protocol !== 'https:' || !destinationAllowed || url.username || url.password || url.hash) {
      throw new Error('Only authorized first-party destinations are permitted');
    }
    if ([...url.searchParams.keys()].length !== 4 || Object.entries(required).some(([key,value]) => url.searchParams.getAll(key).length !== 1 || url.searchParams.get(key) !== value)) {
      throw new Error('Article campaign attribution is missing or inconsistent');
    }
    message = '【PR】\n' + post.text + '\n\n' + url.href;
  }
  if (message.length > 500) throw new Error('Final Threads message exceeds 500 characters');
  return message;
}

export function isOrganicDuplicate(item, post, message) {
  return typeof item?.text === 'string' && (
    item.text === message || item.text === post.text || (post.previousTexts ?? []).includes(item.text) ||
    (typeof post.url === 'string' && item.text.includes(post.url))
  );
}
