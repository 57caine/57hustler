/**
 * 人事評価・日報システム
 * AI社員全員の月次実績を自動評価して data/evaluations/YYYY-MM.json に出力する。
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const REPO  = '57caine/57hustler';
const TOKEN = process.env.GITHUB_TOKEN!;

function loadJson<T>(p: string): T | null {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), p), 'utf-8')) as T; }
  catch { return null; }
}

function thisMonthStart(): string {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

async function fetchWorkflowStats(): Promise<Record<string, { total: number; success: number; failure: number }>> {
  if (!TOKEN) return {};
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/runs?per_page=100`,
      { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': '57hustler-bot', Accept: 'application/vnd.github+json' } }
    );
    if (!res.ok) return {};
    const data = await res.json() as { workflow_runs: { name: string; conclusion: string | null; created_at: string }[] };
    const start = thisMonthStart();
    const stats: Record<string, { total: number; success: number; failure: number }> = {};
    data.workflow_runs
      .filter(r => r.created_at >= start)
      .forEach(r => {
        if (!stats[r.name]) stats[r.name] = { total: 0, success: 0, failure: 0 };
        stats[r.name].total++;
        if (r.conclusion === 'success') stats[r.name].success++;
        if (r.conclusion === 'failure') stats[r.name].failure++;
      });
    return stats;
  } catch { return {}; }
}

async function generateEvaluation(metrics: object): Promise<string> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `57hustlerのAI社員の月次評価を書いてください。

【実績データ】
${JSON.stringify(metrics, null, 2)}

各社員について「よくできた点」「改善点」「来月への期待」を
箇条書きで簡潔に（全体200字以内）。`,
    }],
  });
  return (msg.content[0] as { type: string; text: string }).text.trim();
}

async function main() {
  console.log('=== AI社員 月次人事評価 ===');
  const start = thisMonthStart();
  const ym = start.slice(0, 7);

  const yonaka = loadJson<{ posts: { date: string; text: string }[] }>('data/yonaka-post-history.json');
  const column = loadJson<{ posts: { date: string }[] }>('data/column-history.json');

  const yonakaPosts = yonaka?.posts.filter(p => p.date >= start) ?? [];
  const columnPosts = column?.posts.filter(p => p.date >= start) ?? [];

  // 重複チェック（夜中のおじさん）
  const texts = yonakaPosts.map(p => p.text);
  const duplicates = texts.filter((t, i) => texts.findIndex(x => x.slice(0, 20) === t.slice(0, 20)) !== i);

  const wfStats = await fetchWorkflowStats();

  const metrics = {
    period: ym,
    夜中のおじさん: {
      posts: yonakaPosts.length,
      duplicateCount: duplicates.length,
      duplicateRate: yonakaPosts.length > 0 ? `${Math.round(duplicates.length / yonakaPosts.length * 100)}%` : '0%',
    },
    コラムbot: {
      posts: columnPosts.length,
    },
    価格監視bot: wfStats['lens-navi価格更新'] ?? { total: 0, success: 0, failure: 0 },
    九星気学bot: wfStats['Threads 九星気学まとめ 日次投稿'] ?? { total: 0, success: 0, failure: 0 },
    GitHubActions全体: {
      workflowCount: Object.keys(wfStats).length,
      totalRuns: Object.values(wfStats).reduce((s, v) => s + v.total, 0),
      successRuns: Object.values(wfStats).reduce((s, v) => s + v.success, 0),
    },
  };

  console.log(`評価期間: ${ym}`);
  console.log(`夜中のおじさん: ${yonakaPosts.length}本 / 重複: ${duplicates.length}件`);
  console.log('Claude で評価文を生成中...');

  const evaluation = await generateEvaluation(metrics);

  const result = {
    month: ym,
    generatedAt: new Date().toISOString(),
    metrics,
    evaluation,
    workflowBreakdown: wfStats,
  };

  const dir = path.join(process.cwd(), 'data', 'evaluations');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, `${ym}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`✓ 評価を書き出しました: ${outPath}`);
  console.log(`\n${evaluation}`);
}

main().catch(e => { console.error(e); process.exit(1); });
