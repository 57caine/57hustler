// CEO HOMEの指標計算（純粋関数）。既存のlib/alerts.ts・lib/priority.tsと同じく、
// データ取得とロジックを分離する。
//
// 重要: 必要なデータが存在しない場合は仮の数値を作らず available:false を返す。
// 呼び出し側はavailable:falseのときに「まだデータがありません」等の
// empty stateを表示し、架空の金額・割合を見せない。

import type { NetWorthItem, RealEstateProperty, IncomeStream, EducationCost, OwnerSettings } from './supabase/home-data';

export interface FreedomDistanceResult {
  available: boolean;
  percent?: number;
  stableNonEmploymentMonthlyJpy?: number;
  livingCostMonthlyJpy?: number;
  diffJpy?: number; // 正=不足額、負=超過額
}

export function computeFreedomDistance(
  incomeStreams: IncomeStream[],
  ownerSettings: OwnerSettings | null
): FreedomDistanceResult {
  if (!ownerSettings || !ownerSettings.living_cost_monthly_jpy) return { available: false };
  const livingCost = ownerSettings.living_cost_monthly_jpy;
  if (livingCost <= 0) return { available: false };

  const stable = incomeStreams
    .filter((s) => s.type !== 'employment' && s.stability === 'stable')
    .reduce((sum, s) => sum + s.monthly_jpy, 0);

  return {
    available: true,
    percent: Math.round((stable / livingCost) * 10000) / 100,
    stableNonEmploymentMonthlyJpy: stable,
    livingCostMonthlyJpy: livingCost,
    diffJpy: livingCost - stable,
  };
}

export interface NetWorthResult {
  available: boolean;
  totalAssetsJpy?: number;
  totalLiabilitiesJpy?: number;
  netWorthJpy?: number;
}

export function computeNetWorth(
  netWorthItems: NetWorthItem[],
  realEstateProperties: RealEstateProperty[]
): NetWorthResult {
  if (netWorthItems.length === 0 && realEstateProperties.length === 0) return { available: false };

  const assets =
    netWorthItems.filter((i) => i.kind === 'asset').reduce((s, i) => s + i.value_jpy, 0) +
    realEstateProperties.reduce((s, p) => s + p.property_value_jpy, 0);
  const liabilities =
    netWorthItems.filter((i) => i.kind === 'liability').reduce((s, i) => s + i.value_jpy, 0) +
    realEstateProperties.reduce((s, p) => s + p.loan_balance_jpy, 0);

  return { available: true, totalAssetsJpy: assets, totalLiabilitiesJpy: liabilities, netWorthJpy: assets - liabilities };
}

export interface AutomationResult {
  available: boolean;
  percent?: number;
}

const AUTOMATION_WEIGHT: Record<string, number> = { full: 1.0, semi: 0.5, manual: 0.0 };

export function computeAutomationRate(incomeStreams: IncomeStream[]): AutomationResult {
  const nonEmployment = incomeStreams.filter((s) => s.type !== 'employment');
  const total = nonEmployment.reduce((s, i) => s + i.monthly_jpy, 0);
  if (total <= 0) return { available: false };
  const weighted = nonEmployment.reduce((s, i) => s + i.monthly_jpy * (AUTOMATION_WEIGHT[i.automation_level] ?? 0), 0);
  return { available: true, percent: Math.round((weighted / total) * 10000) / 100 };
}

export interface EducationResult {
  available: boolean;
  preparedJpy?: number;
  estimatedJpy?: number;
  percent?: number;
}

export function computeEducationPreparation(
  netWorthItems: NetWorthItem[],
  educationCosts: EducationCost[]
): EducationResult {
  if (educationCosts.length === 0) return { available: false };
  const estimated = educationCosts.reduce((s, c) => s + c.estimated_jpy, 0);
  if (estimated <= 0) return { available: false };
  const prepared = netWorthItems
    .filter((i) => i.kind === 'asset' && i.earmark === 'education')
    .reduce((s, i) => s + i.value_jpy, 0);
  return { available: true, preparedJpy: prepared, estimatedJpy: estimated, percent: Math.round((prepared / estimated) * 10000) / 100 };
}

export function formatJpy(n: number): string {
  return `¥${n.toLocaleString('ja-JP')}`;
}

export function formatPercent(n: number): string {
  return `${n.toFixed(2)}%`;
}
