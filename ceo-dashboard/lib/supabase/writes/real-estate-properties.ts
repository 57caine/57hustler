'use server';

import { createClient } from '../server';
import {
  ActionError,
  requireString,
  optionalString,
  requireNumber,
  optionalNumber,
  optionalInt,
  requireDate,
  optionalDate,
  requireEnum,
  requireUuid,
} from '../validation';
import { requireUser, runWrite, GENERIC_ERROR, type ActionResult } from './shared';

const DATA_TYPE = ['plan', 'actual'] as const;

function readFields(formData: FormData) {
  return {
    name: requireString(formData.get('name'), '物件名', 200),
    property_value_jpy: requireNumber(formData.get('property_value_jpy'), '評価額'),
    loan_balance_jpy: requireNumber(formData.get('loan_balance_jpy'), 'ローン残高'),
    interest_rate: optionalNumber(formData.get('interest_rate'), '金利'),
    rent_monthly_jpy: optionalNumber(formData.get('rent_monthly_jpy'), '月額賃料'),
    expense_monthly_jpy: optionalNumber(formData.get('expense_monthly_jpy'), '月額費用'),
    loan_payment_monthly_jpy: optionalNumber(formData.get('loan_payment_monthly_jpy'), '月額ローン返済'),
    acquisition_date: optionalDate(formData.get('acquisition_date'), '取得日'),
    planned_sale_date: optionalDate(formData.get('planned_sale_date'), '売却予定日'),
    planned_sale_conditions: optionalString(formData.get('planned_sale_conditions'), '売却条件', 500),
    major_event_year: optionalInt(formData.get('major_event_year'), '重要イベント年'),
    major_event_note: optionalString(formData.get('major_event_note'), '重要イベント内容', 500),
    maintenance_plan: optionalString(formData.get('maintenance_plan'), '維持計画', 500),
    data_type: requireEnum(formData.get('data_type'), 'データ種別', DATA_TYPE),
    as_of_date: requireDate(formData.get('as_of_date'), '時点日付'),
    note: optionalString(formData.get('note'), 'メモ', 500),
  };
}

export async function insertRealEstateProperty(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase.from('real_estate_properties').insert({ owner_id: user.id, ...fields });
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function updateRealEstateProperty(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const fields = readFields(formData);
    const supabase = await createClient();
    const { error } = await supabase
      .from('real_estate_properties')
      .update(fields)
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}

export async function deleteRealEstateProperty(formData: FormData): Promise<ActionResult> {
  return runWrite(async () => {
    const user = await requireUser();
    const id = requireUuid(formData.get('id'), 'id');
    const supabase = await createClient();
    const { error } = await supabase
      .from('real_estate_properties')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) throw new ActionError(GENERIC_ERROR);
  }, '/home');
}
