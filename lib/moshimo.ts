// もしもアフィリエイト「かんたんリンク」の埋め込みコードから、
// 商品カード表示に必要なデータ（商品名・画像URL・正規のアフィリエイトクリックURL）
// を抽出する共通の変換処理。

export interface MoshimoProduct {
  name: string;
  imageUrl: string | null;
  affiliateUrl: string;
  buttonText: string;
  buttonColor: string;
}

interface MoshimoButtonLink {
  u_tx: string;
  u_bc: string;
  a_id: number;
  p_id: number;
  pl_id: number;
  pc_id: number;
}

interface MoshimoRawData {
  n: string;
  d: string;
  c_p: string;
  p: string[];
  b_l: MoshimoButtonLink[];
}

/**
 * もしもアフィリエイト管理画面の「かんたんリンク」からコピーした埋め込みコード
 * （<script>タグごとそのまま）を渡すと、商品カード表示用のデータを返す。
 *
 * 【重要】アフィリエイトリンクは msmaflink() の JSON内の u.u（素の商品ページURL）
 * をそのまま使うと成果が発生しない。b_l[0] の a_id/p_id/pc_id/pl_id から、
 * もしもアフィリエイトの正規クリック計測URL
 * （https://af.moshimo.com/af/c/click?a_id=...&p_id=...&pc_id=...&pl_id=...）
 * を組み立てて使うこと。
 *
 * p配列は商品写真だけでなく、クーポンバナーや売り切れバッジ画像が
 * 混ざっていることがあるため、先頭（p[0]）のみを商品画像として使う。
 */
export function parseMoshimoEmbedCode(embedCode: string): MoshimoProduct | null {
  const match = embedCode.match(/msmaflink\((\{[\s\S]*\})\)\s*;/);
  if (!match) return null;

  let raw: MoshimoRawData;
  try {
    raw = JSON.parse(match[1]) as MoshimoRawData;
  } catch {
    return null;
  }

  const link = raw.b_l?.[0];
  if (!link) return null;

  const imageUrl = raw.p?.[0] ? `${raw.d}${raw.c_p}${raw.p[0]}` : null;
  const affiliateUrl = `https://af.moshimo.com/af/c/click?a_id=${link.a_id}&p_id=${link.p_id}&pc_id=${link.pc_id}&pl_id=${link.pl_id}`;

  // 一部の商品フィードは商品名を "|...|" のように区切り記号で囲んでいるため、
  // 表示上そのまま出さないよう先頭・末尾の記号と余分な空白を取り除く
  const name = raw.n.trim().replace(/^\|+\s*/, '').replace(/\s*\|+$/, '');

  return {
    name,
    imageUrl,
    affiliateUrl,
    buttonText: link.u_tx || `${raw.n}を見る`,
    buttonColor: link.u_bc || '#bf0000',
  };
}
