import { NextResponse } from 'next/server';

// data/projects-registry.json の各プロジェクトに紐づくGitHub Actionsワークフローの
// 最終実行日時・結果を取得する。プロジェクトの「最終更新」「稼働中/停止中の実態」を
// 判定するために使う（ALERT⑤未更新・③KPI悪化の判定材料）。
const REPO = '57caine/57hustler';
const REGISTRY_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/projects-registry.json';

interface RegistryProject {
  slug: string;
  workflowFile: string | null;
}

interface WorkflowRun {
  created_at: string;
  conclusion: string | null;
  status: string;
}

async function fetchLatestRun(workflowFile: string, headers: Record<string, string>) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/actions/workflows/${workflowFile}/runs?per_page=1`,
    { headers, cache: 'no-store' },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { workflow_runs: WorkflowRun[] };
  const run = json.workflow_runs?.[0];
  if (!run) return null;
  return { lastRunAt: run.created_at, lastRunConclusion: run.conclusion };
}

export async function GET() {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': '57hustler-dashboard',
  };

  const registryRes = await fetch(REGISTRY_URL, { cache: 'no-store' });
  if (!registryRes.ok) {
    return NextResponse.json({ error: `プロジェクトレジストリの取得に失敗しました: ${registryRes.status}` }, { status: 500 });
  }
  const registry = (await registryRes.json()) as { projects: RegistryProject[] };

  const result: Record<string, { lastRunAt: string | null; lastRunConclusion: string | null }> = {};

  await Promise.all(
    registry.projects
      .filter(p => p.workflowFile)
      .map(async p => {
        const info = await fetchLatestRun(p.workflowFile as string, headers);
        result[p.slug] = info ?? { lastRunAt: null, lastRunConclusion: null };
      }),
  );

  return NextResponse.json({ fetchedAt: new Date().toISOString(), activity: result });
}
