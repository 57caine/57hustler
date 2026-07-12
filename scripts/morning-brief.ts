/**
 * 朝の司令書システム
 * GitHub Actions で毎日 JST 07:00 に実行。
 * data/morning-brief.json を生成する。
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const REPO  = '57caine/57hustler';
const TOKEN = process.env.GITHUB_TOKEN!;

interface Task { id: string; title: string; priority: string; category: string; completed: boolean; }
interface Run  { id: number; name: string; conclusion: string | null; created_at: string; }

function loadJson<T>(p: string): T | null {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), p), 'utf-8')) as T; }
  catch { return null; }
}

function todayJST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
}

async function fetchRecentRuns(): Promise<{ total: number; success: number; failed: number; runs: object[] }> {
  if (!TOKEN) return { total: 0, success: 0, failed: 0, runs: [] };
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/runs?per_page=30`,
      { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': '57hustler-bot', Accept: 'application/vnd.github+json' } }
    );
    if (!res.ok) return { total: 0, success: 0, failed: 0, runs: [] };
    const data = await res.json() as { workflow_runs: Run[] };
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const recent = data.workflow_runs.filter(r => new Date(r.created_at).getTime() > cutoff);
    return {
      total:   recent.length,
      success: recent.filter(r => r.conclusion === 'success').length,
      failed:  recent.filter(r => r.conclusion === 'failure').length,
      runs:    recent.slice(0, 10).map(r => ({ name: r.name, status: r.conclusion, time: r.created_at })),
    };
  } catch { return { total: 0, success: 0, failed: 0, runs: [] }; }
}

async function classifyTasks(tasks: Task[], runsStatus: object): Promise<{
  urgent: string[]; defer: string[]; confirm: string[]; summary: string;
}> {
  const client = new Anthropic();
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Tokyo',
  });

  const taskList = tasks.filter(t => !t.completed).map(t => `- [${t.priority}] ${t.title}`).join('\n');

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `あなたは57hustler社のCOOです。今日（${today}）の朝の司令書を作成してください。

【未完了タスク】
${taskList || '（なし）'}

【GitHub Actions 直近24時間】
${JSON.stringify(runsStatus, null, 2)}

以下のJSONのみ出力（前置き不要）：
{
  "urgent": ["今日必ずやること（最大3件）"],
  "defer": ["後回しでいいこと（最大3件）"],
  "confirm": ["要確認事項（最大2件）"],
  "summary": "一言サマリー（30字以内）"
}`,
    }],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text;
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as {
    urgent: string[]; defer: string[]; confirm: string[]; summary: string;
  };
}

async function main() {
  console.log('=== 朝の司令書生成開始 ===');
  const today = todayJST();

  const yonakaHistory = loadJson<{ posts: { date: string }[] }>('data/yonaka-post-history.json');
  const taskData      = loadJson<{ tasks: Task[] }>('data/priority-tasks.json');
  const postsToday    = yonakaHistory?.posts.filter(p => p.date === today).length ?? 0;
  const tasks         = taskData?.tasks ?? [];

  console.log(`今日の投稿数: ${postsToday} / タスク: ${tasks.length}件`);

  console.log('GitHub Actions ステータス取得中...');
  const actionsStatus = await fetchRecentRuns();
  console.log(`直近24時間: ${actionsStatus.total}件（成功${actionsStatus.success}件・失敗${actionsStatus.failed}件）`);

  console.log('Claude でタスク分類中...');
  const classified = await classifyTasks(tasks, actionsStatus);

  const AI_STAFF_TODAY = [
    { time: '04:00', name: '夜中のおじさん', task: 'Threads投稿' },
    { time: '07:00', name: '九星気学bot',    task: '運勢まとめ投稿' },
    { time: '08:00', name: '夜中のおじさん', task: 'Threads投稿' },
    { time: '12:00', name: 'コラムbot・夜中', task: 'Threads投稿2本' },
    { time: '16:00', name: '夜中のおじさん', task: 'Threads投稿' },
    { time: '20:00', name: '夜中のおじさん', task: 'Threads投稿' },
    { time: '21:00', name: 'コラムbot',      task: '一文考察投稿' },
    { time: '22:00', name: '夜中のおじさん', task: 'Threads投稿' },
    { time: '23:00', name: 'コラムbot',      task: 'コラム夜投稿' },
  ];

  const brief = {
    date: today,
    generatedAt: new Date().toISOString(),
    todayAiStaff: AI_STAFF_TODAY,
    postsToday,
    actionsStatus,
    urgent:  classified.urgent,
    defer:   classified.defer,
    confirm: classified.confirm,
    summary: classified.summary,
  };

  const outPath = path.join(process.cwd(), 'data', 'morning-brief.json');
  fs.writeFileSync(outPath, JSON.stringify(brief, null, 2), 'utf-8');
  console.log(`✓ 司令書を書き出しました: ${outPath}`);
  console.log(`  今日やること: ${brief.urgent.join(' / ')}`);
  console.log(`  後回し: ${brief.defer.join(' / ')}`);
}

main().catch(e => { console.error(e); process.exit(1); });
