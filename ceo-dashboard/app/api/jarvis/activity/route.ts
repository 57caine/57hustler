import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';
const REPO = '57caine/57hustler';

type WorkflowRun = {
  id?: unknown;
  name?: unknown;
  status?: unknown;
  conclusion?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
  html_url?: unknown;
  head_sha?: unknown;
  event?: unknown;
};
type RunsResponse = { workflow_runs?: unknown };
type Activity = {
  id: number;
  name: string;
  state: 'success' | 'failure' | 'cancelled' | 'in_progress' | 'queued' | 'other';
  createdAt: string;
  updatedAt: string | null;
  url: string;
  sha: string | null;
  event: string | null;
};

const validDate = (value: unknown) =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;

function normalize(run: WorkflowRun): Activity | null {
  if (typeof run.id !== 'number' || !Number.isSafeInteger(run.id) || run.id <= 0) return null;
  const expected = `https://github.com/${REPO}/actions/runs/${run.id}`;
  if (run.html_url !== expected) return null;
  const createdAt = validDate(run.created_at);
  if (!createdAt) return null;
  const state = run.status === 'completed'
    ? (run.conclusion === 'success' ? 'success' : run.conclusion === 'failure' || run.conclusion === 'timed_out' ? 'failure' : run.conclusion === 'cancelled' ? 'cancelled' : 'other')
    : run.status === 'in_progress' ? 'in_progress' : run.status === 'queued' || run.status === 'waiting' || run.status === 'pending' || run.status === 'requested' ? 'queued' : 'other';
  return {
    id: run.id,
    name: typeof run.name === 'string' ? run.name.slice(0, 90) : '名称未取得',
    state,
    createdAt,
    updatedAt: validDate(run.updated_at),
    url: expected,
    sha: typeof run.head_sha === 'string' && /^[a-f0-9]{40}$/.test(run.head_sha) ? run.head_sha.slice(0, 7) : null,
    event: typeof run.event === 'string' ? run.event.slice(0, 40) : null,
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  const fetchedAt = new Date().toISOString();
  const token = process.env.GITHUB_TOKEN;
  const unavailable = (error: string) => NextResponse.json({ available: false, error, fetchedAt, runs: [] }, { headers: { 'Cache-Control': 'no-store' } });
  if (!token) return unavailable('GitHub接続設定がありません');
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/actions/runs?per_page=50`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'jarvis-ceo-dashboard' }, cache: 'no-store', signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) return unavailable(`GitHub Actionsを取得できません（HTTP ${response.status}）`);
    const body: RunsResponse = await response.json();
    if (!Array.isArray(body.workflow_runs)) return unavailable('Actionsの形式を確認できません');
    const all = body.workflow_runs.map(v => v && typeof v === 'object' ? normalize(v as WorkflowRun) : null).filter((v): v is Activity => v !== null);
    // Actions describes executor evidence, not the ChatGPT CEO scheduler or confirmed SNS publication.
    const names = /(threads|rakutabi|lens|mitama|pet|growth|seo|jarvis|affiliate|deploy|daily|投稿|楽旅|レンズ|ceo)/i;
    const relevant = all.filter(run => names.test(run.name)).slice(0, 6);
    return NextResponse.json({
      available: true,
      fetchedAt,
      runs: relevant,
      scanned: all.length,
      latestAnyRun: all.length ? { createdAt: all[0].createdAt, url: all[0].url } : null,
      note: 'GitHub Actionsの実行履歴です。ChatGPTのCEO予約タスクやClaudeの実行成否、SNSの投稿ID、売上を保証しません。',
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return unavailable('GitHub Actionsへの接続に失敗しました');
  }
}
