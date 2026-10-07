import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getNetWorthItem } from '@/lib/supabase/assets-data';
import { deleteNetWorthItem } from '@/lib/supabase/writes/net-worth-items';
import { formatJpy } from '@/lib/home-metrics';
import { kindLabel } from '../../_labels';

// 誤操作防止のため、削除は専用の確認ページを経由してから実行する
// (一覧から直接ワンクリックで削除できないようにする)
export const dynamic = 'force-dynamic';

export default async function DeleteAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const { row, error } = await getNetWorthItem(id);

  async function doDelete(formData: FormData) {
    'use server';
    const result = await deleteNetWorthItem(formData);
    if (result.ok) {
      redirect('/assets?deleted=1');
    }
    redirect(`/assets?${new URLSearchParams({ error: result.error }).toString()}`);
  }

  return (
    <div className="space-y-4 pb-10">
      <h1 className="text-xl font-bold">削除の確認</h1>

      {error ? (
        <p className="text-sm" style={{ color: '#ef4444' }}>
          読み込みに失敗しました。しばらくしてから再度お試しください。
        </p>
      ) : !row ? (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          対象のデータが見つかりませんでした
        </p>
      ) : (
        <>
          <div
            className="rounded-xl px-4 py-3.5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{row.label}</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
              {kindLabel(row.kind)}　{row.category}
            </p>
            <div className="text-base font-bold font-mono mt-1" style={{ color: 'var(--text)' }}>
              {formatJpy(row.value_jpy)}
            </div>
          </div>

          <p className="text-sm" style={{ color: 'var(--text)' }}>
            このデータを削除します。この操作は元に戻せません。本当に削除しますか？
          </p>

          <form action={doDelete} className="flex gap-2">
            <input type="hidden" name="id" value={row.id} />
            <button
              type="submit"
              className="text-sm px-3 py-2 rounded-md font-bold"
              style={{ background: '#ef4444', color: '#fff' }}
            >
              削除する
            </button>
            <Link
              href="/assets"
              className="text-sm px-3 py-2 rounded-md font-bold"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              キャンセル
            </Link>
          </form>
        </>
      )}
    </div>
  );
}
