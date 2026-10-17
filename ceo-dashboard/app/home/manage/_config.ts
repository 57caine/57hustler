import type { ActionResult } from '@/lib/supabase/writes/shared';
import { insertFamilyMember, updateFamilyMember, deleteFamilyMember } from '@/lib/supabase/writes/family-members';
import { insertEducationCost, updateEducationCost, deleteEducationCost } from '@/lib/supabase/writes/education-costs';
import { insertFutureExpense, updateFutureExpense, deleteFutureExpense } from '@/lib/supabase/writes/future-expenses';
import { insertIncomeStream, updateIncomeStream, deleteIncomeStream } from '@/lib/supabase/writes/income-streams';
import { insertRealEstateProperty, updateRealEstateProperty, deleteRealEstateProperty } from '@/lib/supabase/writes/real-estate-properties';
import { insertOwnerSettings, updateOwnerSettings, deleteOwnerSettings } from '@/lib/supabase/writes/owner-settings';

type Write = (form: FormData) => Promise<ActionResult>;
export type Field = {
  name: string; label: string; type?: 'text' | 'number' | 'date' | 'textarea' | 'family';
  required?: boolean; maxLength?: number; min?: number; max?: number; step?: string;
  options?: readonly (readonly [string, string])[];
};
type DataKey = 'familyMembers' | 'educationCosts' | 'futureExpenses' | 'incomeStreams' | 'realEstateProperties';
type Config = {
  title: string; description: string; dataKey?: DataKey; labelKey: string;
  amountKey?: string; fields: Field[]; insert: Write; update: Write; remove: Write;
};
const note: Field = { name: 'note', label: 'メモ', type: 'textarea', maxLength: 500 };
const year = (name: string, label: string): Field => ({ name, label, type: 'number', min: 1900, max: 2200, step: '1' });
const amount = (name: string, label: string, required = false): Field => ({ name, label, type: 'number', min: 0, step: '1', required });

// Field names and enum choices come from existing server writes, never from URL input.
export const configs: Record<string, Config> = {
  family: {
    title: '家族', description: '教育費を準備する家族の情報を登録します。呼び名でも構いません。',
    dataKey: 'familyMembers', labelKey: 'name',
    insert: insertFamilyMember, update: updateFamilyMember, remove: deleteFamilyMember,
    fields: [{ name: 'name', label: '名前・呼び名', required: true, maxLength: 100 }, year('birth_year', '生まれた年'),
      { name: 'education_policy', label: '教育についての希望', type: 'textarea', maxLength: 500 }],
  },
  education: {
    title: '教育費', description: '家族ごとに、これから必要になる教育費の見込みを登録します。',
    dataKey: 'educationCosts', labelKey: 'label', amountKey: 'estimated_jpy',
    insert: insertEducationCost, update: updateEducationCost, remove: deleteEducationCost,
    fields: [{ name: 'family_member_id', label: '対象の家族', type: 'family', required: true },
      { name: 'label', label: '費用の名前', required: true, maxLength: 200 }, amount('estimated_jpy', '見込み額（円）', true), year('target_year', '必要になる年'), note],
  },
  expenses: {
    title: '将来の大きな支出', description: '住まいの修繕や買い替えなど、教育費以外の支出の見込みを登録します。',
    dataKey: 'futureExpenses', labelKey: 'label', amountKey: 'estimated_jpy',
    insert: insertFutureExpense, update: updateFutureExpense, remove: deleteFutureExpense,
    fields: [{ name: 'label', label: '支出の名前', required: true, maxLength: 200 },
      { name: 'category', label: '分類', required: true, options: [['housing', '自宅・住まい'], ['property_maintenance', '不動産の修繕'], ['tax', '税金'], ['major_purchase', '大きな買い物'], ['other', 'その他']] },
      amount('estimated_jpy', '見込み額（円）', true), year('target_year', '必要になる年'), note],
  },
  income: {
    title: '収入', description: '今の月額収入を登録します。会社員の収入と、それ以外の収入を分けて確認できます。',
    dataKey: 'incomeStreams', labelKey: 'label', amountKey: 'monthly_jpy',
    insert: insertIncomeStream, update: updateIncomeStream, remove: deleteIncomeStream,
    fields: [{ name: 'label', label: '収入の名前', required: true, maxLength: 200 },
      { name: 'type', label: '種類', required: true, options: [['employment', '給与'], ['business', '事業'], ['real_estate', '不動産'], ['investment', '投資'], ['automated', '自動収入']] },
      amount('monthly_jpy', '月額（円）', true),
      { name: 'automation_level', label: '手をかける度合い', required: true, options: [['full', 'ほぼ手をかけずに入る'], ['semi', '一部に手をかける'], ['manual', '自分の働きが必要']] },
      { name: 'stability', label: '収入の安定性', required: true, options: [['stable', '安定して入る'], ['unstable', '月ごとに変わる']] },
      { name: 'linked_project_slug', label: '関連する事業（任意）', options: [['', '指定なし'], ['lens-navi', 'レンズナビ'], ['rakutabi', '楽旅くん'], ['pet-hinan', 'ペット防災'], ['yonaka-uranai', '夜中のおじさん'], ['deguchi-note', '出口のノート'], ['zassou-ojisan', '雑草おじさん']] }, note],
  },
  properties: {
    title: '投資不動産', description: 'ご自身の物件と将来の計画を登録します。資産にも同じ物件を登録すると二重に数えられます。将来の計画は今の資産額には含めません。',
    dataKey: 'realEstateProperties', labelKey: 'name', amountKey: 'property_value_jpy',
    insert: insertRealEstateProperty, update: updateRealEstateProperty, remove: deleteRealEstateProperty,
    fields: [{ name: 'name', label: '物件名', required: true, maxLength: 200 }, amount('property_value_jpy', '評価額（円）', true), amount('loan_balance_jpy', 'ローン残高（円）', true),
      { name: 'data_type', label: '現在の状況', required: true, options: [['actual', '現在の情報'], ['plan', '将来の計画']] },
      { name: 'as_of_date', label: '情報の基準日', type: 'date', required: true },
      { name: 'interest_rate', label: '金利（％）', type: 'number', min: 0, step: 'any' },
      amount('rent_monthly_jpy', '月額賃料（円）'), amount('expense_monthly_jpy', '月額費用（円）'), amount('loan_payment_monthly_jpy', '月額ローン返済（円）'),
      { name: 'acquisition_date', label: '取得日', type: 'date' }, { name: 'planned_sale_date', label: '売却予定日', type: 'date' },
      { name: 'planned_sale_conditions', label: '売却についての希望・条件', type: 'textarea', maxLength: 500 },
      year('major_event_year', '大規模修繕などの予定年'), { name: 'major_event_note', label: '予定している内容', type: 'textarea', maxLength: 500 },
      { name: 'maintenance_plan', label: '維持・修繕の計画', type: 'textarea', maxLength: 500 }, note],
  },
  settings: {
    title: '生活費', description: '家族で暮らすために毎月必要な金額を登録します。自由への距離を計算する目安になります。',
    labelKey: 'living_cost_monthly_jpy', amountKey: 'living_cost_monthly_jpy',
    insert: insertOwnerSettings, update: updateOwnerSettings, remove: () => deleteOwnerSettings(),
    fields: [amount('living_cost_monthly_jpy', '毎月の生活費（円）', true)],
  },
};
