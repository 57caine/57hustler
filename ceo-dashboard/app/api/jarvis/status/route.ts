import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';
const REPO = '57caine/57hustler';
const STATE_BRANCH = 'ceo-agent-state';
const DOC = 'https://github.com/57caine/57hustler/blob/ceo-agent-state/data/ceo-agent/active.json';

type Registry = {
  updated_at?: string;
  active?: unknown;
  deferred?: unknown;
  completed?: unknown;
};
type TaskState = {
  status?: unknown;
  revision?: unknown;
  spec?: { task?: unknown; owner?: unknown };
  history?: Array<{ at?: unknown }>;
};

type TaskSummary = {
  id: string;
  status: string;
  owner: string;
  taskUrl: string | null;
  updatedAt: string | null;
  stateUrl: string;
};

const allowedStatuses = new Set(['queued', 'implementing', 'verifying', 'ready', 'awaiting_approval', 'publishing', 'observing', 'blocked', 'done']);
function isSafeUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname.startsWith('/57caine/57hustler/');
  } catch { return false; }
}
function validDate(value: unknown): string | null {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;
}
async function readState<T>(path: string, token: string): Promise<T> {
  const response = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${STATE_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.raw+json',
        'User-Agent': 'jarvis-ceo-dashboard',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ available: false, error: 'GitHub連携は未設定です', fetchedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });

  try {
    const registry = await readState<Registry>('data/ceo-agent/active.json', token);
    // Never follow arbitrary file paths obtained from GitHub data.
    const active = Array.isArray(registry.active)
      ? registry.active.filter((id): id is string => typeof id === 'string' && /^pr-[0-9]{1,6}$/.test(id)).slice(0, 8)
      : [];
    const taskResults = await Promise.all(active.map(async (id): Promise<TaskSummary> => {
      const stateUrl = `https://github.com/${REPO}/blob/${STATE_BRANCH}/data/ceo-agent/${id}.json`;
      try {
        const state = await readState<TaskState>(`data/ceo-agent/${id}.json`, token);
        return {
          id,
          status: typeof state.status === 'string' && allowedStatuses.has(state.status) ? state.status : 'unknown',
          owner: state.spec?.owner === 'Claude' ? 'Claude' : state.spec?.owner === 'CEO' ? 'CEO' : '不明',
          taskUrl: isSafeUrl(state.spec?.task) ? state.spec.task : null,
          updatedAt: Array.isArray(state.history) ? validDate(state.history.at(-1)?.at) : null,
          stateUrl,
        };
      } catch {
        return { id, status: 'unknown', owner: '不明', taskUrl: null, updatedAt: null, stateUrl };
      }
    }));

    return NextResponse.json({
      available: true,
      fetchedAt: new Date().toISOString(),
      registryUpdatedAt: validDate(registry.updated_at),
      activeTasks: taskResults,
      deferredCount: Array.isArray(registry.deferred) ? registry.deferred.length : null,
      completedCount: Array.isArray(registry.completed) ? registry.completed.length : null,
      source: DOC,
      note: 'GitHubに保存されたCEO状態です。予約タスクの最新実行成否や売上の増加は保証しません。',
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ available: false, error: 'CEO状態を読み取れませんでした。未取得であり停止の証拠ではありません。', fetchedAt: new Date().toISOString(), source: DOC }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
