// TODAY画面の「今日やることTOP3」の並び順ロジック。
//
// 【重要】優先度スコアエンジン（収益化速度・現在の収益・成長余地・自動化しやすさ・
// 必要な人的作業・既存資産の重み付け合算）は未完成。完成させるにはMONEY区画の
// 実収益データが前提になるため、フェーズ2ではこの関数だけでTOP3を決める。
//
// フェーズ3で優先度スコアエンジンが完成したら、この関数の中身だけを差し替えれば
// 呼び出し側（TODAYページ）には一切手を入れずに済むよう、入出力の形を固定してある。

export type AlertCategory =
  | 'user_decision'   // ユーザー判断待ち
  | 'stalled'         // 長期間停滞
  | 'stale'           // 未更新
  | 'kpi_degraded'    // KPI悪化
  | 'next_action_unset' // 次のアクション未設定
  | 'ai_waiting';     // AI作業待ち

export interface PriorityItem {
  id: string;
  title: string;
  detail?: string;
  projectSlug?: string;
  projectName?: string;
  categories: AlertCategory[];
  href?: string;
  /** カテゴリ横断で「これだけは絶対に上位」としたい場合の追加重み（0が既定） */
  boost?: number;
}

export interface RankedItem extends PriorityItem {
  score: number;
}

// カテゴリごとの重み。フェーズ2の暫定値。値そのものに深い意味はなく、
// 「ユーザーの判断・承認待ちが一番動かしやすい」「KPI悪化は実害が出ている」を
// 上位に、という直感を反映しただけの仮の重み付け
const CATEGORY_WEIGHT: Record<AlertCategory, number> = {
  user_decision: 40,
  kpi_degraded: 35,
  ai_waiting: 25,
  next_action_unset: 20,
  stalled: 15,
  stale: 10,
};

/**
 * フェーズ2の暫定優先順位ロジック：該当するALERTカテゴリの重みを合算し、
 * 複数カテゴリに該当するものほど上位に来る単純な並び替え。
 */
export function rankByPhase2Proxy(items: PriorityItem[]): RankedItem[] {
  return items
    .map(item => ({
      ...item,
      score:
        item.categories.reduce((sum, c) => sum + (CATEGORY_WEIGHT[c] ?? 0), 0) +
        (item.boost ?? 0),
    }))
    .sort((a, b) => b.score - a.score);
}

export function topN(items: PriorityItem[], n: number): RankedItem[] {
  return rankByPhase2Proxy(items).slice(0, n);
}

export const CATEGORY_LABEL: Record<AlertCategory, string> = {
  user_decision: '判断待ち',
  stalled: '停滞',
  stale: '未更新',
  kpi_degraded: 'KPI悪化',
  next_action_unset: '次アクション未設定',
  ai_waiting: 'AI作業待ち',
};

export const CATEGORY_COLOR: Record<AlertCategory, { bg: string; color: string }> = {
  user_decision: { bg: 'rgba(124,110,247,0.15)', color: '#7c6ef7' },
  stalled: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  stale: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  kpi_degraded: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  next_action_unset: { bg: 'rgba(107,107,138,0.15)', color: '#8b899e' },
  ai_waiting: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
};
