/**
 * 楽天への送客クリックの簡易カウント（GA4未導入のため。2026-09-26 オーナー指示）
 *
 * 保存先は Vercel Blob。クリック1回ごとに空に近い小さなファイルを1つ作り、
 * ファイル名（pathname）に「日付・施設番号・ボタンの位置」を埋め込む。
 * 集計はファイル名の一覧だけで行い、ファイルの中身は読まない（読み取り回数を抑えるため）。
 *
 *   clicks/{YYYY-MM-DD(JST)}/{hotelNo}/{placement}-xxxx.json
 *
 * Vercel Blob が未接続（BLOB_READ_WRITE_TOKEN / BLOB_STORE_ID が無い）場合は記録をスキップする。
 * 記録の成否にかかわらず、利用者の楽天への遷移は妨げない（クリック側は sendBeacon で送るだけ）。
 */
import { list, put } from '@vercel/blob';

export const PLACEMENTS = ['card', 'hotel-main', 'plan', 'review'] as const;
export type Placement = (typeof PLACEMENTS)[number];

export const PLACEMENT_LABELS: Record<Placement, string> = {
  card: '一覧カードの予約ボタン',
  'hotel-main': '個別ページの予約ボタン',
  plan: 'プラン料金タブの予約ボタン',
  review: '口コミタブのリンク',
};

export function isBlobConfigured(): boolean {
  // 接続方式により、読み書きトークン or ストアID（VercelのOIDCトークンと組み合わせて認証）のどちらかが入る
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function todayJst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * healthcheck: 公開後の動作確認用（GitHub Actions から送る）。clicks/ とは別の場所に保存し、集計には含めない
 */
export async function recordClick(hotelNo: number, placement: Placement | 'healthcheck', page: string): Promise<void> {
  const pathname = placement === 'healthcheck'
    ? `healthcheck/${todayJst()}.json`
    : `clicks/${todayJst()}/${hotelNo}/${placement}.json`;
  const body = JSON.stringify({ hotelNo, placement, page, at: new Date().toISOString() });
  const options = { addRandomSuffix: true, contentType: 'application/json' } as const;
  try {
    await put(pathname, body, { ...options, access: 'private' });
  } catch {
    // ストアが公開設定で作られている場合は private で書けないため public で書く（中身はクリック日時のみ）
    await put(pathname, body, { ...options, access: 'public' });
  }
}

export interface ClickRow {
  date: string;
  hotelNo: number;
  placement: string;
}

/** 記録済みクリックを全件（ファイル名から）読み出す */
export async function listClicks(): Promise<ClickRow[]> {
  const rows: ClickRow[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: 'clicks/', cursor, limit: 1000 });
    for (const b of res.blobs) {
      const [, date, hotelNo, file] = b.pathname.split('/');
      if (!date || !hotelNo || !file) continue;
      rows.push({ date, hotelNo: Number(hotelNo), placement: file.replace(/-[^-]*\.json$/, '').replace(/\.json$/, '') });
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return rows;
}
