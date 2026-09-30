// ALERTの6条件を検知する共通ロジック。TODAYとALERTの両画面から呼ばれる
// （「ALERTはTODAYと連動させる」という要件を、検知ロジックの共有という形で満たす）。
//
// 対象の6条件: ユーザー判断待ち / 長期間停滞 / 未更新 / KPI悪化 / 次のアクション未設定 / AI作業待ち

import { AlertCategory, PriorityItem } from './priority';

export interface ReportEntry {
  id: string;
  createdAt: string;
  business: string;
  source: string;
  summary: string;
  status: '未確認' | '確認済み';
}

export interface TaskItem {
  number: number;
  title: string;
  url: string;
  createdAt: string;
  business: string;
}

export interface FlaggedArticle {
  slug: string;
  title: string;
  business?: string;
  status?: '未対応' | '対応済み' | '様子見';
  flags: string[];
  flagLabels: string[];
  metrics: { sessions: number };
  pendingPr?: { url: string; prNumber: number; title: string };
  causes: string[];
  execution?: string;
  result?: string;
  nextAction?: string;
  path?: string;
}

export interface RegistryProject {
  slug: string;
  businessKey: string;
  name: string;
  status: 'active' | 'stopped';
  workflowFile: string | null;
}

export interface ActivityInfo {
  lastRunAt: string | null;
  lastRunConclusion: string | null;
}

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

const STALE_DAYS = 7;
const STALLED_PR_DAYS = 3;

export function buildAlertItems(input: {
  reports: ReportEntry[];
  tasks: TaskItem[];
  flaggedArticles: FlaggedArticle[];
  projects: RegistryProject[];
  activity: Record<string, ActivityInfo>;
}): PriorityItem[] {
  const items: PriorityItem[] = [];
  const { reports, tasks, flaggedArticles, projects, activity } = input;

  // 1. オープンPR → ユーザー判断待ち + AI作業待ち（+長期停滞）
  for (const t of tasks) {
    const categories: AlertCategory[] = ['user_decision', 'ai_waiting'];
    const days = daysSince(t.createdAt);
    if (days >= STALLED_PR_DAYS) categories.push('stalled');
    items.push({
      id: `pr-${t.number}`,
      title: `PR #${t.number}: ${t.title}`,
      detail: `${t.business} ・ ${days === 0 ? '本日作成' : `${days}日経過`}`,
      categories,
      href: t.url,
    });
  }

  // 2. 未確認の報告 → ユーザー判断待ち
  for (const r of reports.filter(r => r.status === '未確認')) {
    const days = daysSince(r.createdAt);
    items.push({
      id: `report-${r.id}`,
      title: r.summary,
      detail: `${r.business} ・ 報告元: ${r.source}`,
      categories: ['user_decision'],
      boost: days >= 1 ? 5 : 0,
      href: '/alert',
    });
  }

  // 3. 改善レビュー/PDCAのフラグ → KPI悪化、AI修正PR待ちなら判断待ち+AI作業待ち、次アクション未設定
  for (const a of flaggedArticles.filter(a => (a.status ?? '未対応') !== '対応済み')) {
    const categories: AlertCategory[] = [];
    if (a.flags.some(f => ['bounce_rate_over_90pct', 'avg_session_under_10s', 'no_affiliate_clicks'].includes(f))) {
      categories.push('kpi_degraded');
    }
    if (a.pendingPr) {
      categories.push('user_decision', 'ai_waiting');
    }
    if (!a.nextAction?.trim()) {
      categories.push('next_action_unset');
    }
    if (categories.length === 0) continue;
    items.push({
      id: `pdca-${a.slug}`,
      title: a.title,
      detail: [a.business ?? 'lens-navi', ...a.flagLabels].join(' ・ '),
      categories,
      href: '/pdca',
    });
  }

  // 4. プロジェクトの稼働状況 → 未更新、KPI悪化（ワークフロー失敗）、次アクション未設定
  for (const p of projects.filter(p => p.status === 'active')) {
    const categories: AlertCategory[] = [];
    const act = p.workflowFile ? activity[p.slug] : undefined;

    if (p.workflowFile) {
      if (!act?.lastRunAt || daysSince(act.lastRunAt) >= STALE_DAYS) {
        categories.push('stale');
      }
      if (act?.lastRunConclusion === 'failure') {
        categories.push('kpi_degraded');
      }
    } else {
      // 紐づくワークフローが無い（＝活動の裏付けが取れない）プロジェクトも未更新扱いにする
      categories.push('stale');
    }

    const hasNextAction = flaggedArticles.some(
      a => (a.business === p.businessKey) && a.nextAction?.trim(),
    );
    if (!hasNextAction) categories.push('next_action_unset');

    if (categories.length === 0) continue;
    items.push({
      id: `project-${p.slug}`,
      title: p.name,
      detail: act?.lastRunAt
        ? `最終活動: ${daysSince(act.lastRunAt)}日前${act.lastRunConclusion === 'failure' ? '（失敗）' : ''}`
        : '活動データなし',
      projectSlug: p.slug,
      projectName: p.name,
      categories,
      href: `/projects/${p.slug}`,
    });
  }

  return items;
}
