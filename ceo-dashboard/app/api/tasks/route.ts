import { NextResponse } from 'next/server';

// 57caine/57hustler は lens-navi(ルート)・school-navi・shikaku-navi・shop-navi・
// yonaka-uranai・ceo-dashboard の6事業が同居するmonorepoのため、オープンなPRが
// どの事業に関する変更かをファイルパスから推測して表示する
const REPO = '57caine/57hustler';

const BUSINESS_DIR_MAP: Record<string, string> = {
  'school-navi': 'school-navi',
  'shikaku-navi': 'shikaku-navi',
  'shop-navi': 'shop-navi',
  'yonaka-uranai': '夜中のおじさん占い',
  'ceo-dashboard': 'CEOダッシュボード',
};

interface GithubUser {
  login: string;
}

interface GithubPull {
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  draft: boolean;
  user: GithubUser | null;
  base: { ref: string };
  head: { ref: string };
}

interface GithubFile {
  filename: string;
}

export interface TaskItem {
  number: number;
  title: string;
  url: string;
  baseBranch: string;
  headBranch: string;
  createdAt: string;
  updatedAt: string;
  draft: boolean;
  author: string | null;
  business: string;
}

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': '57hustler-dashboard',
  };
}

async function inferBusiness(prNumber: number, headers: Record<string, string>): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/pulls/${prNumber}/files?per_page=100`, { headers });
    if (!res.ok) return '不明';
    const files = (await res.json()) as GithubFile[];
    const labels = new Set<string>();
    for (const f of files) {
      const top = f.filename.split('/')[0];
      if (BUSINESS_DIR_MAP[top]) {
        labels.add(BUSINESS_DIR_MAP[top]);
      } else if (top === '.github' || top === 'CLAUDE.md' || top === 'AGENTS.md') {
        labels.add('(内部・ワークフロー)');
      } else {
        labels.add('lens-navi');
      }
    }
    return labels.size > 0 ? Array.from(labels).join(' / ') : '不明';
  } catch {
    return '不明';
  }
}

export async function GET() {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const headers = ghHeaders(TOKEN);

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/pulls?state=open&per_page=100&sort=created&direction=asc`,
    { headers, cache: 'no-store' },
  );
  if (!res.ok) {
    return NextResponse.json({ error: `PR一覧の取得に失敗しました: ${await res.text()}` }, { status: 500 });
  }
  const pulls = (await res.json()) as GithubPull[];

  const tasks: TaskItem[] = await Promise.all(pulls.map(async p => ({
    number: p.number,
    title: p.title,
    url: p.html_url,
    baseBranch: p.base.ref,
    headBranch: p.head.ref,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    draft: p.draft,
    author: p.user?.login ?? null,
    business: await inferBusiness(p.number, headers),
  })));

  return NextResponse.json({ fetchedAt: new Date().toISOString(), tasks });
}
