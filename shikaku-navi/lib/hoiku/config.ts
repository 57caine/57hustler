// 保育士転職ナビ（/hoiku）のサイト設定
//
// 【インデックス制御】
// 骨格段階（ダミーリンク・プレースホルダー文言が残っている状態）で検索エンジンに
// 評価されると、薄いコンテンツとして shikaku.lens-navi.jp ドメイン全体の評価に
// 悪影響が出るおそれがあるため、コンテンツが揃うまでは noindex にしておく。
// 公開準備が整ったら true に切り替えると、以下が連動して有効になる。
//   - /hoiku の robots メタが index,follow になる
//   - /hoiku/sitemap.xml に URL が載る
//   - robots.txt に /hoiku/sitemap.xml が追記される
export const HOIKU_INDEXABLE = false;

export const HOIKU_BASE_URL = 'https://shikaku.lens-navi.jp/hoiku';
export const HOIKU_SITE_NAME = '保育士転職ナビ';
export const HOIKU_LAST_UPDATED = '2026年9月';
