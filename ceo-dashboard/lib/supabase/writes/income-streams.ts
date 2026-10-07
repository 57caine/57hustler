'use server';

import { createClient } from '../server';
import { ActionError, requireString, optionalString, requireNumber, requireEnum, requireUuid } from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

const TYPE = ['employment', 'business', 'real_estate', 'investment', 'automated'] as const;
const AUTOMATION_LEVEL = ['full', 'semi', 'manual'] as const;
const STABILITY = ['stable', 'unstable'] as const;

function readFields(formData: FormData) {
  return {
    label: requireString(formData.get('label'), 'ラベル', 200),
    type: requireEnum(formData.get('type'), '種別', TYPE),
    monthly_jpy: requireNumber(formData.get('monthly_jpy'), '月額'),
    automation_level: requireEnum(formData.get('automation_level'), '自動化レベル', AUTOMATION_LEVEL),
    stability: requireEnum(formData.get('stability'), '安定性', STABILITY),
    linked_project_slug: optionalString(formData.get('linked_project_slug'), '関連プロジェクト', 100),
    note: optionalString(formData.get('note'), 'メモ', 500),
  };
}

export async function insertIncomeStream(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase.from('income_streams').insert({ owner_id: user.id, ...fields });
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function updateIncomeStream(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase
      .from('income_streams')
      .update(fields)
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function deleteIncomeStream(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const supabase = await createClient();
    const { error } = await supabase
      .from('income_streams')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}
