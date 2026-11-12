/**
 * GA4 / ASP のCSVを読み込み、LPごとの数値診断とLPO（コピー改善案）を出す
 *   npm run metrics                      … data/reports/*.csv を全部読む
 *   npm run metrics -- --no-sample       … sample-*.csv を除外
 *   npm run metrics -- --dir path/to/csv … 読み込み先を変更
 * 出力: output/reports/metrics-{日付}.md と .json
 *
 * ※ GA4のクリック数は「ASPの成果」ではない。報酬はASP側CSVの値だけで判断する
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadCampaigns, referencedProgramIds, type Campaign } from '../src/lib/campaigns.ts';
import { loadAffiliates } from '../src/lib/affiliates.ts';
import { p } from '../src/lib/paths.ts';
import { c, getArg, hasFlag, parseCsv, today, writeFile } from './lib/cli.ts';

// 判定のしきい値（運用しながら調整する）
const T = {
  minSessions: 100, // これ未満は「データ不足」として改善案を出さない
  engagementRate: 0.5, // エンゲージメント率がこれ未満 → ファーストビュー問題
  ctr: 0.05, // LPのクリック率（affiliate_click / セッション）がこれ未満 → CTA・訴求問題
  cvr: 0.03, // ASP発生率（発生 / ASPクリック）がこれ未満 → 期待値ズレ
  approval: 0.5, // 承認率がこれ未満 → 質の低い送客
};

const ALIASES: Record<string, string[]> = {
  page_path: ['page_path', 'pagePath', 'ページパス', 'ページパスとスクリーン クラス', 'ランディング ページ'],
  sessions: ['sessions', 'セッション', 'セッション数'],
  engaged_sessions: ['engaged_sessions', 'engagedSessions', 'エンゲージのあったセッション数'],
  avg_engagement_time_sec: ['avg_engagement_time_sec', 'averageEngagementTime', '平均エンゲージメント時間', 'セッションあたりの平均エンゲージメント時間'],
  affiliate_clicks: ['affiliate_clicks', 'affiliate_click', 'イベント数', 'eventCount'],
  placement: ['placement', 'customEvent:placement'],
  program_id: ['program_id', 'customEvent:program_id', '案件ID', 'プログラムID'],
  clicks: ['clicks', 'クリック数', 'クリック'],
  conversions: ['conversions', '発生件数', '発生数', '成果発生数'],
  approved: ['approved', '承認件数', '確定件数'],
  revenue: ['revenue', '報酬額', '確定報酬', '承認報酬額'],
  campaign: ['campaign', 'slug', 'LP'],
};

function pick(row: Record<string, string>, key: string): string {
  for (const k of ALIASES[key] ?? [key]) if (row[k] !== undefined) return row[k];
  return '';
}
const num = (s: string) => {
  const n = Number(String(s).replace(/[,円%\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const pct = (n: number) => (Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : '—');
const yen = (n: number) => `${Math.round(n).toLocaleString('ja-JP')}円`;

// ---------- 読み込み ----------
const dir = getArg('dir', p('data', 'reports'))!;
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.csv')) : [];
const use = (prefix: string) =>
  files
    .filter((f) => f.replace(/^sample-/, '').startsWith(prefix))
    .filter((f) => !(hasFlag('no-sample') && f.startsWith('sample-')))
    .flatMap((f) => parseCsv(fs.readFileSync(path.join(dir, f), 'utf8')));

const ga4Pages = use('ga4-pages');
const ga4Clicks = use('ga4-clicks');
const aspRows = use('asp');
if (!ga4Pages.length && !aspRows.length) {
  console.error(c.red(`CSVが見つかりません（${dir}）。data/reports/README.md を参照してください`));
  process.exit(1);
}
const usingSample = files.some((f) => f.startsWith('sample-')) && !hasFlag('no-sample');

const campaigns = loadCampaigns();
const programs = loadAffiliates().programs;

// ---------- 集計 ----------
interface LpMetrics {
  campaign: Campaign;
  sessions: number;
  engaged: number;
  engagementRate: number;
  avgTime: number;
  gaClicks: number;
  ctr: number;
  aspClicks: number;
  conversions: number;
  approved: number;
  revenue: number;
  cvr: number;
  approvalRate: number;
  rps: number; // セッションあたり報酬
  placements: { placement: string; programId: string; clicks: number }[];
  findings: string[];
  proposals: string[];
}

const pathOf = (slug: string) => `/lp/${slug}/`;
const normPath = (s: string) => (s.endsWith('/') ? s : `${s}/`).replace(/\?.*$/, '');

const results: LpMetrics[] = campaigns.map((cp) => {
  const pageRows = ga4Pages.filter((r) => normPath(pick(r, 'page_path')) === pathOf(cp.slug));
  const sessions = pageRows.reduce((s, r) => s + num(pick(r, 'sessions')), 0);
  const engaged = pageRows.reduce((s, r) => s + num(pick(r, 'engaged_sessions')), 0);
  const avgTime = pageRows.length ? num(pick(pageRows[0], 'avg_engagement_time_sec')) : 0;
  const placements = ga4Clicks
    .filter((r) => normPath(pick(r, 'page_path')) === pathOf(cp.slug))
    .map((r) => ({ placement: pick(r, 'placement'), programId: pick(r, 'program_id'), clicks: num(pick(r, 'clicks') || pick(r, 'affiliate_clicks')) }));
  const gaClicks = pageRows.reduce((s, r) => s + num(pick(r, 'affiliate_clicks')), 0) || placements.reduce((s, x) => s + x.clicks, 0);

  // ASP成果：campaign列があればそれで、なければこのLPが参照する案件IDで紐付け
  const ids = new Set(referencedProgramIds(cp));
  const asp = aspRows.filter((r) => (pick(r, 'campaign') ? pick(r, 'campaign') === cp.slug : ids.has(pick(r, 'program_id'))));
  const aspClicks = asp.reduce((s, r) => s + num(pick(r, 'clicks')), 0);
  const conversions = asp.reduce((s, r) => s + num(pick(r, 'conversions')), 0);
  const approved = asp.reduce((s, r) => s + num(pick(r, 'approved')), 0);
  const revenue = asp.reduce((s, r) => s + num(pick(r, 'revenue')), 0);

  const m: LpMetrics = {
    campaign: cp, sessions, engaged, avgTime, gaClicks, aspClicks, conversions, approved, revenue, placements,
    engagementRate: sessions ? engaged / sessions : NaN,
    ctr: sessions ? gaClicks / sessions : NaN,
    cvr: aspClicks ? conversions / aspClicks : NaN,
    approvalRate: conversions ? approved / conversions : NaN,
    rps: sessions ? revenue / sessions : NaN,
    findings: [], proposals: [],
  };
  diagnose(m);
  return m;
});

// ---------- 診断ルール → LPO提案 ----------
function diagnose(m: LpMetrics) {
  const cp = m.campaign;
  const name = (id: string) => programs.find((x) => x.id === id)?.name ?? id;
  if (m.sessions < T.minSessions) {
    m.findings.push(`セッション${m.sessions}件。判断にはデータ不足（${T.minSessions}件以上で診断）`);
    m.proposals.push('まずは集客を優先：/daily-growth でSNS投稿案を出し、流入を増やす');
    return;
  }
  if (m.engagementRate < T.engagementRate) {
    m.findings.push(`エンゲージメント率 ${pct(m.engagementRate)}（基準 ${pct(T.engagementRate)}）→ ファーストビューで離脱`);
    const pain = cp.pains?.[0];
    m.proposals.push(`見出しを「悩み起点」に寄せる案：「${pain ? `${pain}、そんな人へ。` : ''}${cp.hero.headline}」`);
    m.proposals.push(`サブ見出しに具体的な数字（料金幅・所要時間など比較表の事実）を入れ、読む理由を先に示す`);
    if (cp.target?.persona) m.proposals.push(`アイキャッチ文言（eyebrow）を「${cp.target.persona}向け」に変え、自分ごと化させる`);
  }
  if (m.ctr < T.ctr) {
    m.findings.push(`LPクリック率 ${pct(m.ctr)}（基準 ${pct(T.ctr)}）→ CTAまで届いていない／押す理由が弱い`);
    m.proposals.push(`CTAラベルを「行動＋得られるもの」に：現在「${cp.hero.ctaLabel}」→ 例「無料体験で講師との相性を確かめる」`);
    m.proposals.push('マイクロコピーで不安を消す：「料金はかからない」「数分で完了」など、事実として言える範囲で');
    m.proposals.push('結論ボックスの直下にもCTAを追加し、スクロール前に押せる位置を増やす');
  }
  if (Number.isFinite(m.cvr) && m.cvr < T.cvr && m.aspClicks >= 30) {
    m.findings.push(`ASP発生率 ${pct(m.cvr)}（基準 ${pct(T.cvr)}）→ LPの期待値と申込ページの内容がズレている可能性`);
    m.proposals.push('ランキングの「注意点」を具体化し、合わない人を事前に外す（承認率改善にも効く）');
    m.proposals.push('ボタン直前に「公式サイトで確認すべき条件（無料体験の条件など）」を1行入れる');
  }
  if (Number.isFinite(m.approvalRate) && m.approvalRate < T.approval && m.conversions >= 5) {
    m.findings.push(`承認率 ${pct(m.approvalRate)} → 対象外ユーザーの申込が多い`);
    m.proposals.push('「こんな人におすすめ」に加えて「こんな人には向かない」を明記する');
  }

  // クリック位置の分析
  if (m.placements.length) {
    const byPlace = new Map<string, number>();
    for (const x of m.placements) byPlace.set(x.placement.replace(/-\d+$/, ''), (byPlace.get(x.placement.replace(/-\d+$/, '')) ?? 0) + x.clicks);
    const total = [...byPlace.values()].reduce((a, b) => a + b, 0);
    const sorted = [...byPlace.entries()].sort((a, b) => b[1] - a[1]);
    m.findings.push(`クリック位置：${sorted.map(([k, v]) => `${k} ${pct(v / total)}`).join(' / ')}`);
    if ((byPlace.get('table') ?? 0) / total > 0.4) m.proposals.push('比較表からのクリックが多い＝比較したい読者が多い。比較表をファーストビュー直下へ移動するテストを推奨');
    if ((byPlace.get('hero') ?? 0) / total < 0.15) m.proposals.push('ファーストビューのCTAが弱い。ボタン上に「結論」1行を入れて即決層を拾う');

    const byProgram = new Map<string, number>();
    for (const x of m.placements) byProgram.set(x.programId, (byProgram.get(x.programId) ?? 0) + x.clicks);
    const topClick = [...byProgram.entries()].sort((a, b) => b[1] - a[1])[0];
    const rank1 = cp.ranking?.[0]?.programId;
    if (topClick && rank1 && topClick[0] !== rank1) {
      m.findings.push(`最もクリックされているのは「${name(topClick[0])}」で、ランキング1位「${name(rank1)}」ではない`);
      m.proposals.push(`読者の関心は「${name(topClick[0])}」寄り。報酬単価・承認率と比べ、1位入れ替えまたは訴求軸の見直しを検討（判断はオーナー）`);
    }
  }
  if (!m.findings.length) m.findings.push('主要指標はすべて基準内');
}

// ---------- 出力 ----------
const DATE = today();
const lines = [
  `# LP数値診断・改善提案（${DATE}）`,
  usingSample ? '\n> ⚠ sample-*.csv（ダミーデータ）を含みます。実データで判断する場合は `--no-sample` を付けて再実行してください。\n' : '',
  '> GA4のクリック数はASPの成果ではありません。報酬はASP側CSVの値です。',
  '',
  '| LP | セッション | エンゲージ率 | LPクリック率 | ASPクリック | 発生 | 承認 | 報酬 | 報酬/セッション |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...results.map((m) => `| ${m.campaign.slug} | ${m.sessions} | ${pct(m.engagementRate)} | ${pct(m.ctr)} | ${m.aspClicks} | ${m.conversions} | ${m.approved} | ${yen(m.revenue)} | ${Number.isFinite(m.rps) ? `${m.rps.toFixed(1)}円` : '—'} |`),
  '',
  ...results.flatMap((m) => [
    `## ${m.campaign.title}`,
    '',
    '**診断**',
    ...m.findings.map((f) => `- ${f}`),
    '',
    '**改善案（上から優先）**',
    ...(m.proposals.length ? m.proposals.map((x, i) => `${i + 1}. ${x}`) : ['- なし']),
    '',
    `対象ファイル：\`${path.relative(p(), m.campaign.file)}\``,
    '',
  ]),
  '## しきい値',
  Object.entries(T).map(([k, v]) => `- ${k}: ${v}`).join('\n'),
];
const out = p('output', 'reports', `metrics-${DATE}`);
writeFile(`${out}.md`, lines.join('\n'));
writeFile(`${out}.json`, JSON.stringify(results.map(({ campaign, ...rest }) => ({ slug: campaign.slug, ...rest })), null, 2));
console.log(lines.slice(0, 8 + results.length).join('\n'));
console.log(c.green(`\n✓ output/reports/metrics-${DATE}.md に保存しました`));
