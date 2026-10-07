'use server';

import { createClient } from '../server';
import { ActionError, requireString, optionalString, requireNumber, requireDate, requireEnum, requireUuid } from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

const KIND = ['asset', 'liability'] as const;
const SOURCE = ['user_input', 'assumption'] as const;

function readFields(formData: FormData) {
  return {
    kind: requireEnum(formData.get('kind'), '種別', KIND),
    category: requireString(formData.get('category'), 'カテゴリ', 100),
    label: requireString(formData.get('label'), 'ラベル', 200),
    value_jpy: requireNumber(formData.get('value_jpy'), '金額'),
    as_of_date: requireDate(formData.get('as_of_date'), '時点日付'),
    source: requireEnum(formData.get('source'), 'データ区分', SOURCE),
    earmark: optionalString(formData.get('earmark'), '使途', 50),
    note: optionalString(formData.get('note'), 'メモ', 500),
  };
}

export async function insertNetWorthItem(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase.from('net_worth_items').insert({ owner_id: user.id, ...fields });
    if (error) throw new ActionError(GENERIC_ERROR);
  }, ['/home', '/assets']);
}

export async function updateNetWorthItem(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const fields = readFields(formData);
    const supabase = await createClient();
    // RLSを最終防御としつつ、アプリ側でも所有者を明示的に絞る(defense in depth)
    const { error } = await supabase
      .from('net_worth_items')
      .update(fields)
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, ['/home', '/assets']);
}

export async function deleteNetWorthItem(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const supabase = await createClient();
    const { error } = await supabase
      .from('net_worth_items')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, ['/home', '/assets']);
}
