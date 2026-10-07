import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/auth';
import { insertNetWorthItem } from '@/lib/supabase/writes/net-worth-items';
import AssetForm from '../_AssetForm';

export const dynamic = 'force-dynamic';

export default async function NewAssetPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const sp = await searchParams;

  async function doInsert(formData: FormData) {
    'use server';
    const result = await insertNetWorthItem(formData);
    if (result.ok) {
      redirect('/assets');
    }
    redirect(`/assets/new?${new URLSearchParams({ error: result.error }).toString()}`);
  }

  return (
    <div className="space-y-4 pb-10">
      <div>
        <h1 className="text-xl font-bold">資産を追加</h1>
        <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
          あなた自身の資産・負債として登録されます
        </p>
      </div>

      {sp.error && (
        <p className="text-sm font-bold" style={{ color: '#ef4444' }}>{sp.error}</p>
      )}

      <AssetForm action={doInsert} submitLabel="登録する" />

      <Link href="/assets" className="text-sm inline-block" style={{ color: 'var(--muted)' }}>
        ← キャンセルしてASSETSへ戻る
      </Link>
    </div>
  );
}
