'use server';

import { createClient } from '../server';
import { ActionError, requireString, optionalString, requireNumber, optionalInt, requireUuid } from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

function readFields(formData: FormData) {
  return {
    category: requireString(formData.get('category'), 'カテゴリ', 100),
    label: requireString(formData.get('label'), 'ラベル', 200),
    estimated_jpy: requireNumber(formData.get('estimated_jpy'), '見積額'),
    target_year: optionalInt(formData.get('target_year'), '対象年'),
    note: optionalString(formData.get('note'), 'メモ', 500),
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
