// /assets配下の表示用ラベル変換（DB上のenum値 → 日本語表示）。
// 技術用語をそのまま画面に出さないための小さな変換のみ。データアクセスは含まない。

export function kindLabel(kind: 'asset' | 'liability'): string {
  return kind === 'asset' ? '資産' : '負債';
}

export function sourceLabel(source: 'user_input' | 'assumption'): string {
  return source === 'user_input' ? '実際に確認した金額' : 'おおよその推定';
}

export function earmarkLabel(earmark: string | null): string {
  if (earmark === 'education') return '教育費';
  return '指定なし';
}
