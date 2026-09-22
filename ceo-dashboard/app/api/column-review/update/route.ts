import { NextRequest, NextResponse } from 'next/server';

const REPO = '57caine/57hustler';
const FILE_PATHS = ['data/column-review.json', 'ceo-dashboard/public/column-review.json'];

interface FlaggedArticle {
  slug: string;
  status?: '未対応' | '対応済み' | '様子見';
  priority?: 'high' | 'medium' | 'low';
  business?: string;
  [key: string]: unknown;
}

interface ColumnReviewFile {
  generatedAt: string;
  dataDateRange: unknown;
  flaggedCount: number;
  flaggedArticles: FlaggedArticle[];
}

async function updateOneFile(
  filePath: string,
  slug: string,
  patch: Partial<Pick<FlaggedArticle, 'status' | 'priority' | 'business'>>,
  headers: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, { headers });
  if (!getRes.ok) return { ok: false, error: `GET ${filePath} failed: ${getRes.status}` };

  const fileData = await getRes.json() as { sha: string; content: string };
  const sha = fileData.sha;
  const data = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8')) as ColumnReviewFile;

  const article = data.flaggedArticles.find(a => a.slug === slug);
  if (!article) return { ok: false, error: `slug not found in ${filePath}: ${slug}` };

  Object.assign(article, patch);
  data.flaggedCount = data.flaggedArticles.filter(a => (a.status ?? '未対応') === '未対応').length;

  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `column-review: ${slug} を更新`, content, sha }),
  });

  if (!putRes.ok) return { ok: false, error: `PUT ${filePath} failed: ${await putRes.text()}` };
  return { ok: true };
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const body = await req.json() as {
    slug: string;
    status?: FlaggedArticle['status'];
    priority?: FlaggedArticle['priority'];
    business?: string;
  };
  if (!body.slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const patch: Partial<Pick<FlaggedArticle, 'status' | 'priority' | 'business'>> = {};
  if (body.status) patch.status = body.status;
  if (body.priority) patch.priority = body.priority;
  if (body.business) patch.business = body.business;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'status, priority, or business required' }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': '57hustler-dashboard',
  };

  // data/ と ceo-dashboard/public/ の2ファイルを順に更新する（並列だとsha競合が起きうるため直列実行）
  for (const filePath of FILE_PATHS) {
    const result = await updateOneFile(filePath, body.slug, patch, headers);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
