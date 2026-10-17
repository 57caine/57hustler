import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getNetWorthItem } from '@/lib/supabase/assets-data';
import { updateNetWorthItem } from '@/lib/supabase/writes/net-worth-items';
import AssetForm from '../../_AssetForm';

export const dynamic = 'force-dynamic';

export default async function EditAssetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const sp = await searchParams;
  const { row, error } = await getNetWorthItem(id);

  async function doUpdate(formData: FormData) {
    'use server';
    const result = await updateNetWorthItem(formData);
    if (result.ok) {
      redirect('/assets');
    }
    redirect(`/assets/${id}/edit?${new URLSearchParams({ error: result.error }).toString()}`);
  }

  return (
    <div className="space-y-4 pb-10">
      <div>
        <h1 className="text-xl font-bold">資産を編集</h1>
      </div>

      {sp.error && (
        <p className="text-sm font-bold" style={{ color: '#ef4444' }}>{sp.error}</p>
      )}

      {error ? (
        <p className="text-sm" style={{ color: '#ef4444' }}>
          読み込みに失敗しました。しばらくしてから再度お試しください。
        </p>
      ) : !row ? (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          対象のデータが見つかりませんでした
        </p>
      ) : (
        <AssetForm action={doUpdate} defaultValues={row} submitLabel="更新する" />
      )}

      <Link href="/assets" className="text-sm inline-block" style={{ color: 'var(--muted)' }}>
        ← ASSETSへ戻る
      </Link>
    </div>
  );
}
