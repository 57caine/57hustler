/**
 * 週次レポート自動生成
 * GitHub Actions で毎週 JST 月曜 07:00 に実行。
 * data/weekly-report/YYYY-MM-DD.json を生成する。
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

function todayJST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
}

function lastNDays(n: number): string {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString('en-CA');
}

async function fetchWeeklyRuns(): Promise<{ total: number; success: number; byWorkflow: Record<string, number> }> {
  if (!TOKEN) return { total: 0, success: 0, byWorkflow: {} };
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/runs?per_page=100`,
      { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': '57hustler-bot', Accept: 'application/vnd.github+json' } }
    );
    if (!res.ok) return { total: 0, success: 0, byWorkflow: {} };
    const data = await res.json() as { workflow_runs: { name: string; conclusion: string | null; created_at: string }[] };
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const week = data.workflow_runs.filter(r => new Date(r.created_at).getTime() > cutoff);
    const byWorkflow: Record<string, number> = {};
    week.forEach(r => { byWorkflow[r.name] = (byWorkflow[r.name] ?? 0) + 1; });
    return { total: week.length, success: week.filter(r => r.conclusion === 'success').length, byWorkflow };
  } catch { return { total: 0, success: 0, byWorkflow: {} }; }
}

async function generateSummary(data: {
  weekStart: string; weekEnd: string;
  yonakaPosts: number; columnPosts: number;
  completedTasks: string[];
  nextTasks: string[];
  actionsRuns: { total: number; success: number };
}): Promise<string> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `57hustler社の週次レポートのサマリーを200字以内で生成してください。

期間: ${data.weekStart} 〜 ${data.weekEnd}
Threads投稿（夜中のおじさん）: ${data.yonakaPosts}本
Threadsコラム: ${data.columnPosts}本
GitHub Actions実行: ${data.actionsRuns.total}回（成功${data.actionsRuns.success}回）
完了タスク: ${data.completedTasks.join(', ') || 'なし'}
来週の重点: ${data.nextTasks.join(', ') || 'なし'}

「今週は〜ができました。来週は〜を重点に。」という形式で。`,
    }],
  });
  return (msg.content[0] as { type: string; text: string }).text.trim();
}

async function main() {
  console.log('=== 週次レポート生成開始 ===');
  const today     = todayJST();
  const weekStart = lastNDays(7);

  const yonakaHistory  = loadJson<{ posts: { date: string }[] }>('data/yonaka-post-history.json');
  const columnHistory  = loadJson<{ posts: { date: string }[] }>('data/column-history.json');
  const taskData       = loadJson<{ tasks: { title: string; completed: boolean; priority: string }[] }>('data/priority-tasks.json');
  const completedData  = loadJson<{ tasks: { title: string; completedDate: string }[] }>('data/completed-tasks.json');

  const yonakaPosts   = yonakaHistory?.posts.filter(p => p.date >= weekStart).length ?? 0;
  const columnPosts   = columnHistory?.posts.filter(p => p.date >= weekStart).length ?? 0;
  const nextTasks     = (taskData?.tasks ?? []).filter(t => !t.completed && t.priority === 'high').map(t => t.title);
  const completedThisWeek = (completedData?.tasks ?? []).filter(t => t.completedDate >= weekStart).map(t => t.title);

  console.log(`今週: 夜中${yonakaPosts}本 / コラム${columnPosts}本`);

  console.log('GitHub Actions 週次集計中...');
  const actionsRuns = await fetchWeeklyRuns();

  console.log('Claude でサマリー生成中...');
  const summary = await generateSummary({
    weekStart, weekEnd: today,
    yonakaPosts, columnPosts,
    completedTasks: completedThisWeek,
    nextTasks,
    actionsRuns,
  });

  const report = {
    weekStart,
    weekEnd: today,
    generatedAt: new Date().toISOString(),
    posts: { yonaka: yonakaPosts, column: columnPosts, total: yonakaPosts + columnPosts },
    actions: actionsRuns,
    completedTasks: completedThisWeek,
    nextWeekTasks: nextTasks,
    summary,
  };

  const dir = path.join(process.cwd(), 'data', 'weekly-report');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, `${today}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✓ 週次レポートを書き出しました: ${outPath}`);
  console.log(`  サマリー: ${summary}`);
}

main().catch(e => { console.error(e); process.exit(1); });
