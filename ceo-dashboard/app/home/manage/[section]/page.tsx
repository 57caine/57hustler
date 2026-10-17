import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getHomeData } from '@/lib/supabase/home-data';
import { formatJpy } from '@/lib/home-metrics';
import { configs, type Field } from '../_config';

export const dynamic = 'force-dynamic';
type Row = Record<string, unknown> & { id: string };
const style = { background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 10px', width: '100%' };

function Input({ field, value, family }: { field: Field; value: unknown; family: { id: string; name: string }[] }) {
  const options = field.type === 'family' ? family.map((f) => [f.id, f.name] as const) : field.options;
  const defaultValue = value == null ? (options?.[0]?.[0] ?? '') : String(value);
  const id = `field-${field.name}`;
  return <div>
    <label htmlFor={id} className="block text-xs font-bold mb-1" style={{ color: 'var(--muted)' }}>{field.label}{field.required ? '（必須）' : ''}</label>
    {options ? <select id={id} name={field.name} required={field.required} defaultValue={defaultValue} style={style}>
      {options.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
    </select> : field.type === 'textarea' ? <textarea id={id} name={field.name} maxLength={field.maxLength} rows={3} defaultValue={defaultValue} style={style} /> :
      <input id={id} name={field.name} type={field.type ?? 'text'} required={field.required} maxLength={field.maxLength} min={field.min} max={field.max} step={field.step} inputMode={field.type === 'number' ? 'decimal' : undefined} defaultValue={defaultValue} style={style} />}
  </div>;
}

export default async function ManagePage({ params, searchParams }: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ edit?: string; delete?: string; error?: string; saved?: string; deleted?: string }>;
}) {
  if (!await getCurrentUser()) redirect('/login');
  const { section } = await params;
  if (!Object.hasOwn(configs, section)) notFound();
  const config = configs[section];
  const sp = await searchParams;
  const data = await getHomeData();
  const path = `/home/manage/${section}`;
  const rows: Row[] = section === 'settings'
    ? (data.ownerSettings.row ? [{ ...data.ownerSettings.row, id: 'settings' }] : [])
    : data[config.dataKey!].rows as unknown as Row[];
  const error = section === 'settings' ? data.ownerSettings.error : data[config.dataKey!].error;
  const selectedId = sp.delete ?? sp.edit;
  const selected = selectedId ? rows.find((row) => row.id === selectedId) : undefined;
  const editing = section === 'settings' ? rows[0] : selected;
  const familyReady = section !== 'education' || (!data.familyMembers.error && data.familyMembers.rows.length > 0);

  const editingId = editing?.id;
  const deleteId = sp.delete && selected ? selected.id : undefined;

  async function save(form: FormData) {
    'use server';
    // Update IDs come from the server-selected own row, not from a hidden input.
    if (editingId) form.set('id', editingId);
    const result = await (editingId ? configs[section].update(form) : configs[section].insert(form));
    const query = result.ok ? new URLSearchParams({ saved: '1' }) : new URLSearchParams({ error: result.error, ...(editingId && section !== 'settings' ? { edit: editingId } : {}) });
    redirect(`${path}?${query}`);
  }
  async function remove() {
    'use server';
    if (!deleteId) redirect(path);
    const form = new FormData();
    form.set('id', deleteId);
    const result = await configs[section].remove(form);
    redirect(`${path}?${new URLSearchParams(result.ok ? { deleted: '1' } : { error: result.error })}`);
  }

  return <div className="space-y-4 pb-10">
    <h1 className="text-xl font-bold">{config.title}</h1>
    <p className="text-sm" style={{ color: 'var(--muted)' }}>{config.description}</p>
    {sp.saved && <p role="status" className="text-sm" style={{ color: '#22c55e' }}>保存しました</p>}
    {sp.deleted && <p role="status" className="text-sm" style={{ color: '#22c55e' }}>削除しました</p>}
    {sp.error && <p role="alert" className="text-sm" style={{ color: '#ef4444' }}>{sp.error}</p>}
    {error ? <p role="alert">読み込みに失敗しました。しばらくしてから再度お試しください。</p> : selectedId && !selected ? <p>対象のデータが見つかりませんでした。</p> : sp.delete && selected ?
      <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--surface)' }}>
        <h2 className="font-bold">削除の確認</h2>
        <p>{section === 'settings' ? '毎月の生活費' : String(selected[config.labelKey])}を削除します。元に戻せません。</p>
        {section === 'family' && <p className="text-sm" style={{ color: '#ef4444' }}>この家族に登録した教育費も一緒に削除されます（{data.educationCosts.error ? '件数を確認できません' : `${data.educationCosts.rows.filter((cost) => cost.family_member_id === selected.id).length}件`}）。</p>}
        <form action={remove}><button type="submit" className="rounded-md px-4 py-2 font-bold" style={{ background: '#ef4444', color: '#fff' }}>削除する</button></form>
        <Link href={path}>キャンセル</Link>
      </div> : <>
        {!familyReady ? <p className="text-sm">先に<Link href="/home/manage/family" style={{ color: 'var(--accent)' }}>家族を登録</Link>してください。家族情報を読み込めない場合は、しばらくしてから再度お試しください。</p> :
          <form action={save} className="rounded-xl p-4 space-y-3" style={{ background: 'var(--surface)' }}>
            <h2 className="font-bold">{editing ? '登録内容を編集' : '新しく登録'}</h2>
            {config.fields.map((field) => <Input key={field.name} field={field} value={editing?.[field.name]} family={data.familyMembers.rows} />)}
            <button type="submit" className="w-full rounded-md py-2.5 font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>{editing ? '更新する' : '登録する'}</button>
            {sp.edit && <Link href={path} className="inline-block text-sm">編集をやめる</Link>}
          </form>}
        <div className="space-y-2">
          <h2 className="font-bold">登録済み</h2>
          {rows.length === 0 && <p className="text-sm" style={{ color: 'var(--muted)' }}>まだ登録されていません</p>}
          {rows.map((row) => <div key={row.id} className="rounded-xl p-4 space-y-2" style={{ background: 'var(--surface)' }}>
            <p className="font-bold break-words">{section === 'settings' ? '毎月の生活費' : String(row[config.labelKey])}</p>
            {config.amountKey && <p>{formatJpy(Number(row[config.amountKey]))}{section === 'income' || section === 'settings' ? ' / 月' : ''}</p>}
            {section === 'education' && <p className="text-sm">対象：{data.familyMembers.rows.find((f) => f.id === row.family_member_id)?.name ?? '家族情報を確認してください'}</p>}
            <div className="flex gap-4 text-sm">
              {section !== 'settings' && <Link href={`${path}?edit=${row.id}`} style={{ color: 'var(--accent)' }}>編集</Link>}
              <Link href={`${path}?delete=${row.id}`} style={{ color: '#ef4444' }}>削除</Link>
            </div>
          </div>)}
        </div>
      </>}
    <Link href="/home" className="inline-block text-sm" style={{ color: 'var(--accent)' }}>← CEO HOMEへ戻る</Link>
  </div>;
}
