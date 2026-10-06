/**
 * ページごとに表示する楽天市場の商品グループ。
 * scripts/fetch-products.ts がこの定義を読み、楽天市場の商品検索APIから商品を取得する（公開時のみ実行）。
 * 商品の並びは楽天の検索結果の標準順で、当サイトが順位付けしたものではない。
 */

export interface ProductGroup {
  id: string;
  /** 見出し（どんな用品か） */
  label: string;
  /** GA4 の product_category に送る値 */
  category: string;
  keywords: string[];
  /** 表示件数の上限 */
  limit: number;
  /** 商品名に含まれている必要がある語（検索結果に混ざる別の動物用・無関係な商品を除く） */
  mustMatch: RegExp;
}

const DOG = /犬|いぬ|イヌ|ドッグ|DOG/i;
const CAT = /猫|ねこ|ネコ|キャット|CAT/i;

export const PRODUCT_GROUPS: ProductGroup[] = [
  { id: 'dog-id-tag', label: '犬用の迷子札', category: 'id-tag', keywords: ['犬 迷子札'], limit: 4, mustMatch: /迷子札|ネームタグ|ネームプレート|名札/ },
  { id: 'water-bottle', label: 'ペット用の携帯給水ボトル', category: 'water', keywords: ['ペット 給水ボトル 携帯'], limit: 4, mustMatch: /給水|ボトル|水筒|水飲み/ },
  { id: 'dog-manner-pouch', label: '犬用のマナーポーチ（排泄物の持ち運び用）', category: 'toilet', keywords: ['マナーポーチ 犬'], limit: 4, mustMatch: /マナーポーチ/ },
  { id: 'cat-id-tag', label: '猫用の迷子札・首輪', category: 'id-tag', keywords: ['猫 迷子札'], limit: 4, mustMatch: /迷子札|ネームタグ|ネームプレート|名札/ },
  { id: 'cat-net', label: '猫用のネット', category: 'net', keywords: ['猫 洗濯ネット'], limit: 4, mustMatch: /ネット/ },
  { id: 'small-carrier', label: 'うさぎ・モルモット用のキャリー', category: 'carrier', keywords: ['うさぎ キャリー', 'モルモット キャリー'], limit: 6, mustMatch: /(うさぎ|ウサギ|モルモット|小動物).*(キャリー|おでかけ|バッグ)|(キャリー|おでかけ|バッグ).*(うさぎ|ウサギ|モルモット|小動物)/ },
  { id: 'dog-carrier', label: '犬用のキャリー（リュック型・ハード型）', category: 'carrier', keywords: ['犬 避難 リュック', '犬 キャリー ハード'], limit: 6, mustMatch: DOG },
  { id: 'cat-carrier', label: '猫用のハードキャリー', category: 'carrier', keywords: ['猫 キャリー ハード'], limit: 4, mustMatch: CAT },
  { id: 'cat-cage', label: '折りたたみできる猫用ケージ', category: 'cage', keywords: ['折りたたみ ケージ 猫'], limit: 4, mustMatch: CAT },
  { id: 'cat-toilet', label: '折りたたみできる猫用トイレ', category: 'toilet', keywords: ['猫 簡易トイレ 折りたたみ'], limit: 6, mustMatch: /(猫|ねこ|ネコ|キャット).*トイレ|トイレ.*(猫|ねこ|ネコ|キャット)/ },
  { id: 'pet-set', label: 'ペット用の防災セット', category: 'set', keywords: ['ペット 防災セット'], limit: 4, mustMatch: /防災セット|避難セット|防災グッズ.*セット/ },
];

export function getGroup(id: string): ProductGroup {
  const g = PRODUCT_GROUPS.find((x) => x.id === id);
  if (!g) throw new Error(`unknown product group: ${id}`);
  return g;
}
