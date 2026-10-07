'use server';

import { createClient } from '../server';
import { ActionError, requireNumber } from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

// owner_settingsはid列を持たず、owner_idそのものが主キー(owner毎に1行)。
// 実際のスキーマに対してUPDATE/DELETEを.eq('id', ...)で絞ろうとすると
// 「column owner_settings.id does not exist」になることをテストで確認済み。
// そのためこのテーブルだけはidをクライアントから受け取らず、
// 常に.eq('owner_id', user.id)のみで自分の行を一意に特定する。

function readFields(formData: FormData) {
  return {
    living_cost_monthly_jpy: requireNumber(formData.get('living_cost_monthly_jpy'), '月間生活費'),
  };
}

export async function insertOwnerSettings(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase.from('owner_settings').insert({ owner_id: user.id, ...fields });
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function updateOwnerSettings(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase
      .from('owner_settings')
      .update(fields)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function deleteOwnerSettings(): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const supabase = await createClient();
    const { error } = await supabase
      .from('owner_settings')
      .delete()
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}
