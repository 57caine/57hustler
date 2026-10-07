import type { CSSProperties } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { insertNetWorthItem, updateNetWorthItem, deleteNetWorthItem } from '@/lib/supabase/writes/net-worth-items';

// STEP4: Server Actionsによる書き込み基盤の動作確認用、開発・検証専用の最小フォーム。
// 本格的な資産入力UIではない(STEP5以降の対象)。net_worth_itemsのみを対象に、
// 実際のServer Action(getCurrentUser→検証→owner_id強制→.eq('owner_id',...))を
// 経由してINSERT/UPDATE/DELETEが動くことを手動・自動テストで確認するためのページ。
// 認証はproxy.ts + getCurrentUser()で保護されているため、ログイン中の本人のみ到達できる。
export const dynamic = 'force-dynamic';

const inputStyle: CSSProperties = {
  background: 'var(--bg)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '6px 8px',
  fontSize: 13,
  width: '100%',
};

export default async function WriteTestPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const sp = await searchParams;

  async function doInsert(formData: FormData) {
    'use server';
    const result = await insertNetWorthItem(formData);
    const params = new URLSearchParams(result.ok ? { ok: 'INSERT成功' } : { error: result.error });
    redirect(`/home/write-test?${params.toString()}`);
  }

  async function doUpdate(formData: FormData) {
    'use server';
    const result = await updateNetWorthItem(formData);
    const params = new URLSearchParams(result.ok ? { ok: 'UPDATE成功' } : { error: result.error });
    redirect(`/home/write-test?${params.toString()}`);
  }

  async function doDelete(formData: FormData) {
    'use server';
    const result = await deleteNetWorthItem(formData);
    const params = new URLSearchParams(result.ok ? { ok: 'DELETE成功' } : { error: result.error });
    redirect(`/home/write-test?${params.toString()}`);
  }

  return (
    <div className="space-y-4 pb-10">
      <div>
        <h1 className="text-lg font-bold">STEP4 書き込み基盤 動作確認（開発用）</h1>
        <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
          本番の資産入力UIではありません。net_worth_itemsのINSERT/UPDATE/DELETEをServer
          Actions経由で動作確認するための最小フォームです。テスト時は label に
          RLS_TEST_TEMP 等のマーカーを付けた架空データのみを使ってください。
        </p>
      </div>

      {sp.ok && <p className="text-sm font-bold" style={{ color: '#22c55e' }}>OK: {sp.ok}</p>}
      {sp.error && <p className="text-sm font-bold" style={{ color: '#ef4444' }}>ERROR: {sp.error}</p>}

      <form
        action={doInsert}
        className="space-y-2 rounded-xl p-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>INSERT</p>
        <select name="kind" defaultValue="asset" style={inputStyle}>
          <option value="asset">asset</option>
          <option value="liability">liability</option>
        </select>
        <input name="category" placeholder="category" defaultValue="cash" style={inputStyle} />
        <input name="label" placeholder="label" defaultValue="RLS_TEST_TEMP" style={inputStyle} />
        <input name="value_jpy" placeholder="value_jpy" defaultValue="1" style={inputStyle} />
        <input name="as_of_date" type="date" defaultValue="2026-10-07" style={inputStyle} />
        <select name="source" defaultValue="user_input" style={inputStyle}>
          <option value="user_input">user_input</option>
          <option value="assumption">assumption</option>
        </select>
        <input name="earmark" placeholder="earmark (任意)" style={inputStyle} />
        <input name="note" placeholder="note (任意)" style={inputStyle} />
        <button type="submit" className="text-sm px-3 py-1.5 rounded font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
          INSERT実行
        </button>
      </form>

      <form
        action={doUpdate}
        className="space-y-2 rounded-xl p-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>UPDATE（idを指定）</p>
        <input name="id" placeholder="id (uuid)" style={inputStyle} />
        <select name="kind" defaultValue="asset" style={inputStyle}>
          <option value="asset">asset</option>
          <option value="liability">liability</option>
        </select>
        <input name="category" placeholder="category" defaultValue="cash" style={inputStyle} />
        <input name="label" placeholder="label" defaultValue="RLS_TEST_TEMP_updated" style={inputStyle} />
        <input name="value_jpy" placeholder="value_jpy" defaultValue="2" style={inputStyle} />
        <input name="as_of_date" type="date" defaultValue="2026-10-07" style={inputStyle} />
        <select name="source" defaultValue="user_input" style={inputStyle}>
          <option value="user_input">user_input</option>
          <option value="assumption">assumption</option>
        </select>
        <input name="earmark" placeholder="earmark (任意)" style={inputStyle} />
        <input name="note" placeholder="note (任意)" style={inputStyle} />
        <button type="submit" className="text-sm px-3 py-1.5 rounded font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
          UPDATE実行
        </button>
      </form>

      <form
        action={doDelete}
        className="space-y-2 rounded-xl p-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs font-bold" style={{ color: '#ef4444' }}>DELETE（idを指定）</p>
        <input name="id" placeholder="id (uuid)" style={inputStyle} />
        <button type="submit" className="text-sm px-3 py-1.5 rounded font-bold" style={{ background: '#ef4444', color: '#fff' }}>
          DELETE実行
        </button>
      </form>
    </div>
  );
}
