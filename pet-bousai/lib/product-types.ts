/**
 * 比較表の「タイプ」列。商品名（ショップが付けた名前）に含まれる語だけで機械的に分類する。
 * 当サイトが仕様を確認・推測したものではないため、判別できない場合は「商品ページで確認」とする。
 */

type Rule = [RegExp, string];

const RULES: Record<string, Rule[]> = {
  'dog-carrier': [
    [/リュック|バックパック/, 'リュック型'],
    [/ハード|クレート|コンテナ/, 'ハード型（クレート）'],
    [/カート|キャスター/, 'キャスター付き'],
    [/ショルダー|トート|スリング|バッグ/, 'バッグ型'],
  ],
  'dog-bowl': [
    [/シリコン/, 'シリコン製'],
    [/ナイロン|布|ポリエステル|オックスフォード|キャンバス/, '布・樹脂繊維製'],
    [/ステンレス/, 'ステンレス製'],
    [/プラスチック|PP|ABS|樹脂/, 'プラスチック製'],
  ],
  'water-bottle': [
    [/ボトル|水筒/, 'ボトル一体型'],
    [/ノズル/, 'ノズル（ペットボトル取り付け）'],
  ],
  'dog-sheet': [
    [/厚型|厚手/, '厚型'],
    [/薄型|薄手/, '薄型'],
    [/ワイド|ジャンボ|大判/, '大判'],
    [/レギュラー/, 'レギュラー'],
  ],
  'dog-waste-bag': [
    [/防臭|消臭/, '臭い対策をうたう袋'],
    [/ロール/, 'ロール型'],
    [/ポーチ|ケース/, 'ケース付き'],
  ],
  'dog-manner-pouch': [
    [/三角/, '三角型'],
    [/ボトル/, 'ボトル型'],
    [/ポーチ/, 'ポーチ型'],
  ],
};

export const UNKNOWN_TYPE = '商品ページで確認';

export function classifyType(groupId: string, name: string): string {
  for (const [re, label] of RULES[groupId] ?? []) if (re.test(name)) return label;
  return UNKNOWN_TYPE;
}

export function hasTypeRules(groupId: string): boolean {
  return (RULES[groupId]?.length ?? 0) > 0;
}
