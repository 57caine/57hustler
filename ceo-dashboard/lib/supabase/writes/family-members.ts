'use server';

import { createClient } from '../server';
import { ActionError, requireString, optionalString, optionalInt, requireUuid } from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

function readFields(formData: FormData) {
  return {
    name: requireString(formData.get('name'), '名前', 100),
    birth_year: optionalInt(formData.get('birth_year'), '生年'),
    education_policy: optionalString(formData.get('education_policy'), '教育方針', 500),
  };
}

export async function insertFamilyMember(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase.from('family_members').insert({ owner_id: user.id, ...fields });
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function updateFamilyMember(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase
      .from('family_members')
      .update(fields)
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function deleteFamilyMember(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const supabase = await createClient();
    // education_costsは複合FK(family_member_id, owner_id) ON DELETE CASCADEのため、
    // 紐づく教育費レコードもDB側で自動的に削除される(追加コード不要)
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}
