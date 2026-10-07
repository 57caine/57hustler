'use server';

import { createClient } from '../server';
import { ActionError, requireString, optionalString, requireNumber, optionalInt, requireUuid, requireEnum } from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

// DBの実CHECK制約(2026-10-07にSupabase SQL Editorで確認済み)に合わせている。
// - future_expenses_category_check: category はこの5値のみ
// - future_expenses_estimated_jpy_check: estimated_jpy >= 0
// - future_expenses_source_check: source は 'assumption' 固定の1値のみ
//   (選択肢が1つしかないため、owner_idと同様にclientからは受け取らず常に
//   サーバー側で固定する)
const CATEGORY = ['housing', 'property_maintenance', 'tax', 'major_purchase', 'other'] as const;
const SOURCE = 'assumption' as const;

function requireNonNegativeNumber(v: FormDataEntryValue | null, field: string): number {
  const n = requireNumber(v, field);
  if (n < 0) throw new ActionError(`${field}は0以上で入力してください`);
  return n;
}

function readFields(formData: FormData) {
  return {
    category: requireEnum(formData.get('category'), 'カテゴリ', CATEGORY),
    label: requireString(formData.get('label'), 'ラベル', 200),
    estimated_jpy: requireNonNegativeNumber(formData.get('estimated_jpy'), '見積額'),
    target_year: optionalInt(formData.get('target_year'), '対象年'),
    note: optionalString(formData.get('note'), 'メモ', 500),
    source: SOURCE,
  };
}

export async function insertFutureExpense(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase.from('future_expenses').insert({ owner_id: user.id, ...fields });
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function updateFutureExpense(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase
      .from('future_expenses')
      .update(fields)
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function deleteFutureExpense(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const supabase = await createClient();
    const { error } = await supabase
      .from('future_expenses')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}
