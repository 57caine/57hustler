// /assets配下の表示用ラベル変換（DB上のenum値 → 日本語表示）。
// 技術用語をそのまま画面に出さないための小さな変換のみ。データアクセスは含まない。

export function kindLabel(kind: 'asset' | 'liability'): string {
  return kind === 'asset' ? '資産' : '負債';
}

// net_worth_items.categoryの実CHECK制約(2026-10-07にSupabase SQL Editorで確認済み)
// に一致する6値のみ。ここにない値を新規に増やす場合は、まずDB側のCHECK制約を
// 確認すること(推測で値を追加しない)
export const CATEGORY_OPTIONS = [
  { value: 'home', label: '自宅' },
  { value: 'financial', label: '金融資産' },
  { value: 'business', label: '事業資産' },
  { value: 'cash', label: '現金' },
  { value: 'mortgage', label: '住宅・不動産ローン' },
  { value: 'other_liability', label: 'その他負債' },
] as const;

export function categoryLabel(category: string): string {
  return CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? category;
}

export function sourceLabel(source: 'user_input' | 'assumption'): string {
  return source === 'user_input' ? '実際に確認した金額' : 'おおよその推定';
}

export function earmarkLabel(earmark: string | null): string {
  if (earmark === 'education') return '教育費';
  return '指定なし';
}
