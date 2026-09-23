/**
 * 改善レビュー課題の自動修正 対象判定（Tier B）
 *
 * 自動修正PRを作ってよい課題を機械的に絞り込む。対象は意図的に狭く、
 * 「既存の事実・既存のアフィリエイトリンクを使った構成上の修正」に限定する。
 * 文章の書き換え（直帰率対応の冒頭修正等）やレンダリング不具合調査、
 * school-navi等の手動追加課題（source: manual）は対象外（人間対応のまま）。
 *
 * 詳細な設計判断はCLAUDE.mdの「改善レビュー課題の自動修正（AI PR作成）」セクション参照。
 */

export interface ColumnAnalysis {
  h2Count: number;
  h3Count: number;
  hasAffiliateLinks: boolean;
  ctaCount: number;
  contentChars: number;
}

export interface FlaggedArticle {
  path: string;
  slug: string;
  title: string;
  metrics: { sessions: number; bounceRate: number; avgSessionDuration: number; affiliateClicks: number };
  flags: string[];
  flagLabels: string[];
  analysis: ColumnAnalysis;
  causes: string[];
  suggestions: string[];
  status?: '未対応' | '対応済み' | '様子見';
  business?: string;
  priority?: 'high' | 'medium' | 'low';
  source?: 'auto-ga4' | 'manual';
  pendingPr?: { url: string; branch: string; prNumber: number; title: string; body: string; createdAt: string };
  autoFixNote?: { at: string; reason: string };
  autoFixRejected?: { at: string; reason: string };
}

export type FixKind = 'add_h2_structure' | 'add_cta';

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
  fixKinds: FixKind[];
}

// サンプルサイズが小さすぎるものは統計的にノイズであり、内容の問題と断定できないため対象外にする
export const MIN_SESSIONS_FOR_AUTOFIX = 10;

export function evaluateEligibility(article: FlaggedArticle): EligibilityResult {
  const status = article.status ?? '未対応';
  if (status !== '未対応') {
    return { eligible: false, reason: `ステータスが「未対応」ではない（${status}）`, fixKinds: [] };
  }
  if (article.source !== 'auto-ga4') {
    return { eligible: false, reason: '手動追加課題（source: manual）はPhase 1では対象外', fixKinds: [] };
  }
  if ((article.business ?? 'lens-navi') !== 'lens-navi') {
    return { eligible: false, reason: 'lens-navi以外の事業はPhase 1では対象外', fixKinds: [] };
  }
  if (article.pendingPr) {
    return { eligible: false, reason: '既にレビュー待ちのPRが存在する', fixKinds: [] };
  }
  if (article.autoFixRejected) {
    return { eligible: false, reason: 'オーナーが過去にこの課題への自動修正PRを見送っているため対象外', fixKinds: [] };
  }
  if (article.metrics.sessions < MIN_SESSIONS_FOR_AUTOFIX) {
    return {
      eligible: false,
      reason: `セッション数が閾値未満（${article.metrics.sessions} < ${MIN_SESSIONS_FOR_AUTOFIX}）のため統計的ノイズの可能性が高い`,
      fixKinds: [],
    };
  }
  if (!article.analysis.hasAffiliateLinks) {
    // 新規リンクの追加・商品選定はAIの裁量が大きくなりすぎるため対象外（人間対応）
    return { eligible: false, reason: 'アフィリエイトリンクが記事に存在しない（新規リンク追加は対象外）', fixKinds: [] };
  }

  const fixKinds: FixKind[] = [];
  if (article.analysis.h2Count < 3) fixKinds.push('add_h2_structure');
  if (article.analysis.ctaCount <= 1) fixKinds.push('add_cta');

  if (fixKinds.length === 0) {
    return {
      eligible: false,
      reason: 'H2構造・CTA数ともにTier Bの閾値を満たしており、機械的に直せる構造上の問題が見当たらない（直帰率対応の文章書き換え等はTier Cのため対象外）',
      fixKinds: [],
    };
  }

  return { eligible: true, reason: `Tier B対象: ${fixKinds.join(', ')}`, fixKinds };
}

export function selectEligibleItems(articles: FlaggedArticle[], maxItems: number): FlaggedArticle[] {
  const eligible = articles.filter(a => evaluateEligibility(a).eligible);
  // 優先度high→medium→low、同点ならセッション数が多い順（影響が大きいものから）
  const order = { high: 0, medium: 1, low: 2 } as const;
  eligible.sort((a, b) => {
    const pa = order[a.priority ?? 'medium'];
    const pb = order[b.priority ?? 'medium'];
    if (pa !== pb) return pa - pb;
    return b.metrics.sessions - a.metrics.sessions;
  });
  return eligible.slice(0, maxItems);
}
