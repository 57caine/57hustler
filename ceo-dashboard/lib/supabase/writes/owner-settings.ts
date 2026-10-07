'use server';

import { createClient } from '../server';
import { ActionError, requireNumber, requireUuid } from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

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
    const id = requireUuid(formData.get('id'), 'id');
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase
      .from('owner_settings')
      .update(fields)
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function deleteOwnerSettings(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const supabase = await createClient();
    const { error } = await supabase
      .from('owner_settings')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}
