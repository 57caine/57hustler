'use server';

import { createClient } from '../server';
import { ActionError, requireString, optionalString, requireNumber, optionalInt, requireUuid } from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

function readFields(formData: FormData) {
  return {
    family_member_id: requireUuid(formData.get('family_member_id'), '対象の家族'),
    label: requireString(formData.get('label'), 'ラベル', 200),
    estimated_jpy: requireNumber(formData.get('estimated_jpy'), '見積額'),
    target_year: optionalInt(formData.get('target_year'), '対象年'),
    note: optionalString(formData.get('note'), 'メモ', 500),
  };
}

export async function insertEducationCost(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const fields = readFields(formData);
    const supabase = await createClient();
    // family_member_idが他ユーザーの家族を指す場合、DB側の複合FK
    // (family_member_id, owner_id) 制約により拒否される(RLSテスト5番で確認済み)
    const { error } = await supabase.from('education_costs').insert({ owner_id: user.id, ...fields });
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function updateEducationCost(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase
      .from('education_costs')
      .update(fields)
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function deleteEducationCost(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const supabase = await createClient();
    const { error } = await supabase
      .from('education_costs')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}
