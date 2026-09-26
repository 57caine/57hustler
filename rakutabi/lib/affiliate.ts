/**
 * 楽天アフィリエイトID。vercel.app での需要検証（2026-09-26〜）の間は、オーナー指示により
 * lens-navi用の既存IDを流用する（本事業専用IDの新規発行は見送り）。
 * 専用IDに切り替える場合は GitHub Secrets の RAKUTABI_RAKUTEN_AFFILIATE_ID に登録すれば、
 * 宿のデータ取得（lib/rakuten-travel.ts）ではそちらが優先される。
 * アフィリエイトIDは楽天のアフィリエイトURLにそのまま含まれる公開情報のため、コードに直接記載している。
 */
export const LENS_NAVI_AFFILIATE_ID = '5567171b.a80702dc.5567171c.a1d1b6fc';

/**
 * 楽天トラベルのトップページへのアフィリエイトリンク（ヒーロー・バナーの「楽天トラベルで探す」用）。
 * 楽天APIが返す宿のアフィリエイトURLと同じ hb.afl.rakuten.co.jp/hgc/{ID}/?pc={遷移先} の形式。
 */
export const RAKUTEN_TRAVEL_TOP_URL = `https://hb.afl.rakuten.co.jp/hgc/${LENS_NAVI_AFFILIATE_ID}/?pc=${encodeURIComponent('https://travel.rakuten.co.jp/')}`;
