/**
 * 楽天APIの口コミ抜粋には「<a href=...>つづきはこちら</a>」のようなHTMLが含まれるため、
 * リンクごと取り除いてプレーンテキストにする（アフィリエイトなしの外部リンクを出さないため）
 */
export function stripHtml(text: string): string {
  return text
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}
