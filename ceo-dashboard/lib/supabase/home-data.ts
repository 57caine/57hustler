import { createClient } from './server';
import { getCurrentUser } from './auth';

// CEO HOME向けのSupabase読み取り専用データアクセス層。
// 7テーブル全てに共通するルール:
//   - RLS(owner_id = auth.uid())に加えて、取得クエリ自体にも
//     .eq('owner_id', user.id) を明示し、ログインユーザーとの整合性を
//     二重に保つ（owner_idはURL/フォーム/クライアント入力からは一切受け取らない。
//     常にサーバー側で取得したセッションのuser.idのみを使う）
//   - service_role keyは使用しない（createClient()はpublishable keyのみ）
//   - Supabaseから返るエラーはここで握り止め、呼び出し元には
//     生のエラー文言を一切渡さない（rows: [] + error: true のみ）
//   - 取得したデータの内容はconsole.log等に出力しない

export interface NetWorthItem {
  id: string;
  kind: 'asset' | 'liability';
  category: string;
  earmark: string | null;
  label: string;
  value_jpy: number;
  as_of_date: string;
  source: 'user_input' | 'assumption';
  note: string | null;
}

export interface RealEstateProperty {
  id: string;
  name: string;
  property_value_jpy: number;
  loan_balance_jpy: number;
  interest_rate: number | null;
  rent_monthly_jpy: number | null;
  expense_monthly_jpy: number | null;
  loan_payment_monthly_jpy: number | null;
  acquisition_date: string | null;
  planned_sale_date: string | null;
  planned_sale_conditions: string | null;
  major_event_year: number | null;
  major_event_note: string | null;
  maintenance_plan: string | null;
  data_type: 'plan' | 'actual';
  as_of_date: string;
  note: string | null;
}

export interface FamilyMember {
  id: string;
  name: string;
  birth_year: number | null;
  education_policy: string | null;
}

export interface EducationCost {
  id: string;
  family_member_id: string;
  label: string;
  estimated_jpy: number;
  target_year: number | null;
  note: string | null;
}

export interface FutureExpense {
  id: string;
  category: string;
  label: string;
  estimated_jpy: number;
  target_year: number | null;
  note: string | null;
}

export interface IncomeStream {
  id: string;
  label: string;
  type: 'employment' | 'business' | 'real_estate' | 'investment' | 'automated';
  monthly_jpy: number;
  automation_level: 'full' | 'semi' | 'manual';
  stability: 'stable' | 'unstable';
  linked_project_slug: string | null;
  note: string | null;
}

export interface OwnerSettings {
  living_cost_monthly_jpy: number;
}

interface TableResult<T> {
  rows: T[];
  error: boolean;
}

export interface HomeData {
  authenticated: boolean;
  netWorthItems: TableResult<NetWorthItem>;
  realEstateProperties: TableResult<RealEstateProperty>;
  familyMembers: TableResult<FamilyMember>;
  educationCosts: TableResult<EducationCost>;
  futureExpenses: TableResult<FutureExpense>;
  incomeStreams: TableResult<IncomeStream>;
  ownerSettings: { row: OwnerSettings | null; error: boolean };
}

const EMPTY: HomeData = {
  authenticated: false,
  netWorthItems: { rows: [], error: false },
  realEstateProperties: { rows: [], error: false },
  familyMembers: { rows: [], error: false },
  educationCosts: { rows: [], error: false },
  futureExpenses: { rows: [], error: false },
  incomeStreams: { rows: [], error: false },
  ownerSettings: { row: null, error: false },
};

export async function getHomeData(): Promise<HomeData> {
  const user = await getCurrentUser();
  if (!user) return EMPTY;

  const supabase = await createClient();
  const ownerId = user.id;

  const [netWorth, realEstate, family, education, future, income, settings] = await Promise.all([
    supabase.from('net_worth_items').select('*').eq('owner_id', ownerId),
    supabase.from('real_estate_properties').select('*').eq('owner_id', ownerId),
    supabase.from('family_members').select('*').eq('owner_id', ownerId),
    supabase.from('education_costs').select('*').eq('owner_id', ownerId),
    supabase.from('future_expenses').select('*').eq('owner_id', ownerId),
    supabase.from('income_streams').select('*').eq('owner_id', ownerId),
    supabase.from('owner_settings').select('*').eq('owner_id', ownerId).maybeSingle(),
  ]);

  return {
    authenticated: true,
    netWorthItems: { rows: netWorth.data ?? [], error: !!netWorth.error },
    realEstateProperties: { rows: realEstate.data ?? [], error: !!realEstate.error },
    familyMembers: { rows: family.data ?? [], error: !!family.error },
    educationCosts: { rows: education.data ?? [], error: !!education.error },
    futureExpenses: { rows: future.data ?? [], error: !!future.error },
    incomeStreams: { rows: income.data ?? [], error: !!income.error },
    ownerSettings: { row: settings.data ?? null, error: !!settings.error },
  };
}
