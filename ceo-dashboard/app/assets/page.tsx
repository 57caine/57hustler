import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getNetWorthItems } from '@/lib/supabase/assets-data';
import { formatJpy } from '@/lib/home-metrics';
import { kindLabel, categoryLabel } from './_labels';

// ログイン中の本人の資産・負債(net_worth_items)だけを一覧表示する。
// 架空データ・サンプル金額は表示しない(DBが空ならempty state)。
export const dynamic = 'force-dynamic';

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const sp = await searchParams;
  const { rows, error } = await getNetWorthItems();

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
            57hustler CEO
          </div>
          <h1 className="text-xl font-bold">ASSETS</h1>
          <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
            あなたの資産・負債（net_worth_items）
          </p>
        </div>
        <Link
          href="/assets/new"
          className="shrink-0 text-sm px-3 py-1.5 rounded-md font-bold"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          ＋ 追加
        </Link>
      </div>

      {sp.deleted && (
        <p className="text-sm font-bold" style={{ color: '#22c55e' }}>削除しました</p>
      )}
      {sp.error && (
        <p className="text-sm font-bold" style={{ color: '#ef4444' }}>{sp.error}</p>
      )}

      {error ? (
        <p className="text-sm" style={{ color: '#ef4444' }}>
          読み込みに失敗しました。しばらくしてから再度お試しください。
        </p>
      ) : rows.length === 0 ? (
        <div
          className="rounded-xl px-4 py-6 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--muted)' }}>まだ資産データがありません</p>
          <Link href="/assets/new" className="text-sm mt-3 inline-block" style={{ color: 'var(--accent)' }}>
            最初の資産を登録する →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((item) => (
            <div
              key={item.id}
              className="rounded-xl px-4 py-3.5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{item.label}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{
                        background: item.kind === 'asset' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: item.kind === 'asset' ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {kindLabel(item.kind)}
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    {categoryLabel(item.category)}　基準日: {item.as_of_date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold font-mono" style={{ color: 'var(--text)' }}>
                    {formatJpy(item.value_jpy)}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <Link href={`/assets/${item.id}/edit`} className="text-[12px]" style={{ color: 'var(--accent)' }}>
                  編集
                </Link>
                <Link href={`/assets/${item.id}/delete`} className="text-[12px]" style={{ color: '#ef4444' }}>
                  削除
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/home" className="text-sm inline-block" style={{ color: 'var(--muted)' }}>
        ← CEO HOMEへ戻る
      </Link>
    </div>
  );
}
