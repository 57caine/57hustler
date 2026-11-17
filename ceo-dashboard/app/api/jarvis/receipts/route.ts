import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';
const REPO = '57caine/57hustler';
const ISSUE = 207;
const MARKER = 'JARVIS_CEO_RUN_V1:';
type RemoteComment = {
  id?: unknown;
  body?: unknown;
  created_at?: unknown;
  html_url?: unknown;
  user?: { login?: unknown };
};
type Receipt = {
  source: 'ceo-issue-comment';
  recordedAt: string;
  commentAt: string;
  url: string;
  stage: 'implemented' | 'verified' | 'observing' | 'blocked' | 'no_change';
  task: string;
  evidence: string | null;
  next: string;
  impact: string;
};

function validString(value: unknown, limit: number): string | null {
  if (typeof value !== 'string' || !value.trim() || value.length > limit) return null;
  return value.trim();
}
function safeEvidence(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== 'string' || value.length > 400) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com' &&
      url.pathname.startsWith('/57caine/57hustler/') ? url.toString() : null;
  } catch { return null; }
}
function parseReceipt(comment: RemoteComment): Receipt | null {
  if (comment.user?.login !== '57caine' || typeof comment.id !== 'number' || !Number.isSafeInteger(comment.id)) return null;
  if (typeof comment.body !== 'string' || comment.body.length > 6000) return null;
  const expected = `https://github.com/${REPO}/issues/${ISSUE}#issuecomment-${comment.id}`;
  if (comment.html_url !== expected) return null;
  if (typeof comment.created_at !== 'string' || Number.isNaN(Date.parse(comment.created_at))) return null;
  const line = comment.body.split('\n').find(l => l.startsWith(MARKER));
  if (!line || line.length > 2200) return null;
  let json: unknown;
  try { json = JSON.parse(line.slice(MARKER.length).trim()); } catch { return null; }
  if (!json || typeof json !== 'object' || Array.isArray(json)) return null;
  const record = json as Record<string, unknown>;
  const stage = record.stage;
  if (!['implemented', 'verified', 'observing', 'blocked', 'no_change'].includes(String(stage))) return null;
  const task = validString(record.task, 140);
  const next = validString(record.next, 240);
  const impact = validString(record.impact, 200);
  if (!task || !next || !impact) return null;
  if (typeof record.at !== 'string' || Number.isNaN(Date.parse(record.at))) return null;
  const at = Date.parse(record.at);
  const created = Date.parse(comment.created_at);
  // Don't trust claimed times after the actual GitHub comment or much older than the comment.
  if (at > created + 5 * 60_000 || at < created - 12 * 60 * 60_000) return null;
  const evidence = safeEvidence(record.evidence ?? null);
  if (record.evidence && !evidence) return null;
  return {
    source: 'ceo-issue-comment',
    recordedAt: record.at,
    commentAt: comment.created_at,
    url: expected,
    stage: stage as Receipt['stage'],
    task,
    evidence,
    next,
    impact,
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  const fetchedAt = new Date().toISOString();
  const token = process.env.GITHUB_TOKEN;
  const unavailable = (error: string) => NextResponse.json(
    { available: false, fetchedAt, error, receipts: [] }, { headers: { 'Cache-Control': 'no-store' } },
  );
  if (!token) return unavailable('GitHub連携が未設定です');
  try {
    const since = new Date(Date.now() - 7 * 86400_000).toISOString();
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/issues/${ISSUE}/comments?per_page=100&since=${encodeURIComponent(since)}`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'jarvis-ceo-dashboard' },
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return unavailable(`CEOの記録を取得できません（HTTP ${response.status}）`);
    const json: unknown = await response.json();
    if (!Array.isArray(json)) return unavailable('GitHubの応答形式を確認できません');
    const receipts = json
      .map(v => v && typeof v === 'object' ? parseReceipt(v as RemoteComment) : null)
      .filter((v): v is Receipt => v !== null)
      .sort((a, b) => Date.parse(b.commentAt) - Date.parse(a.commentAt))
      .slice(0, 5);
    return NextResponse.json({
      available: true,
      fetchedAt,
      receipts,
      scanned: json.length,
      limited: json.length >= 100,
      source: `https://github.com/${REPO}/issues/${ISSUE}`,
      note: 'これはCEOエージェントがGitHub Issueへ記録した自己申告の実行要約です。GitHub Actionsや本番・売上の独立した検証ではありません。',
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return unavailable('CEOの実行記録に接続できませんでした'); }
}
