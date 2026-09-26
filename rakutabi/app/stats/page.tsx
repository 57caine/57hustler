import type { Metadata } from 'next';
import { connection } from 'next/server';
import { isBlobConfigured, listClicks, PLACEMENT_LABELS, type ClickRow, type Placement } from '@/lib/click-log';
import { getHotel } from '@/lib/hotels';

/**
 * 送客クリックの集計ページ（オーナー確認用。サイト内からはリンクしていない・検索エンジン非公開）。
 * 開くたびに Vercel Blob の記録を数え直す。
 */
export const metadata: Metadata = { title: '送客クリック集計', robots: { index: false, follow: false } };

function countBy<T extends string | number>(rows: ClickRow[], key: (r: ClickRow) => T): [T, number][] {
  const m = new Map<T, number>();
  for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + 1);
  return [...m.entries()];
}

export default async function StatsPage() {
  await connection();

  if (!isBlobConfigured()) {
    return <Shell><p>クリックの記録先（Vercel Blob）が未接続のため、集計できません。</p></Shell>;
  }

  let rows: ClickRow[];
  try {
    rows = await listClicks();
  } catch (e) {
    return <Shell><p>記録の読み出しに失敗しました：{(e as Error).message}</p></Shell>;
  }

  const byDate = countBy(rows, (r) => r.date).sort((a, b) => b[0].localeCompare(a[0]));
  const byPlacement = countBy(rows, (r) => r.placement).sort((a, b) => b[1] - a[1]);
  const byHotel = countBy(rows, (r) => r.hotelNo).sort((a, b) => b[1] - a[1]).slice(0, 30);

  return (
    <Shell>
      <p className="text-4xl font-bold">{rows.length.toLocaleString('ja-JP')}<span className="text-base font-normal ml-1">クリック（累計）</span></p>
      <p className="text-xs text-gray-500">楽天トラベルへの予約ボタン・リンクのクリック数です（日付は日本時間）。楽天側で予約が成立したかどうかは、楽天アフィリエイトの管理画面でご確認ください。</p>

      <Table title="日別" head={['日付', 'クリック']} rows={byDate.map(([d, n]) => [d, n])} />
      <Table
        title="ボタンの位置別"
        head={['位置', 'クリック']}
        rows={byPlacement.map(([p, n]) => [PLACEMENT_LABELS[p as Placement] ?? p, n])}
      />
      <Table
        title="宿別（上位30件）"
        head={['宿', 'クリック']}
        rows={byHotel.map(([no, n]) => [no === 0 ? '（楽天トラベルのトップへ）' : getHotel(no)?.name ?? `施設番号${no}`, n])}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">送客クリック集計</h1>
      {children}
    </div>
  );
}

function Table({ title, head, rows }: { title: string; head: [string, string]; rows: (string | number)[][] }) {
  return (
    <section className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">まだクリックはありません。</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-black/5">
              <th className="py-2 font-medium">{head[0]}</th>
              <th className="py-2 font-medium text-right">{head[1]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([a, b]) => (
              <tr key={String(a)} className="border-b border-black/5 last:border-0">
                <td className="py-2">{a}</td>
                <td className="py-2 text-right font-medium">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
