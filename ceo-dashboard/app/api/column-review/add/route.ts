import { NextRequest, NextResponse } from 'next/server';

const REPO = '57caine/57hustler';
const FILE_PATHS = ['data/column-review.json', 'ceo-dashboard/public/column-review.json'];

interface ManualArticle {
  path: string;
  slug: string;
  title: string;
  metrics: { sessions: number; bounceRate: number; avgSessionDuration: number; affiliateClicks: number };
  flags: string[];
  flagLabels: string[];
  analysis: { h2Count: number; h3Count: number; hasAffiliateLinks: boolean; ctaCount: number; contentChars: number };
  causes: string[];
  suggestions: string[];
  status: '未対応' | '対応済み' | '様子見';
  business: string;
  priority: 'high' | 'medium' | 'low';
  source: 'manual';
}

interface ColumnReviewFile {
  generatedAt: string;
  dataDateRange: unknown;
  flaggedCount: number;
  flaggedArticles: ManualArticle[];
}

function makeSlug(business: string): string {
  return `manual-${business}-${Math.random().toString(36).slice(2, 8)}`;
}

async function addToOneFile(
  filePath: string,
  article: ManualArticle,
  headers: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, { headers });
  if (!getRes.ok) return { ok: false, error: `GET ${filePath} failed: ${getRes.status}` };

  const fileData = await getRes.json() as { sha: string; content: string };
  const sha = fileData.sha;
  const data = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8')) as ColumnReviewFile;

  data.flaggedArticles.push(article);
  data.flaggedCount = data.flaggedArticles.filter(a => (a.status ?? '未対応') === '未対応').length;

  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `column-review: 課題を手動追加（${article.business}）`, content, sha }),
  });

  if (!putRes.ok) return { ok: false, error: `PUT ${filePath} failed: ${await putRes.text()}` };
  return { ok: true };
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const body = await req.json() as {
    business: string;
    title: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
  };
  if (!body.business?.trim()) return NextResponse.json({ error: 'business required' }, { status: 400 });
  if (!body.title?.trim()) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const slug = makeSlug(body.business.trim());
  const article: ManualArticle = {
    path: '',
    slug,
    title: body.title.trim(),
    metrics: { sessions: 0, bounceRate: 0, avgSessionDuration: 0, affiliateClicks: 0 },
    flags: [],
    flagLabels: [],
    analysis: { h2Count: 0, h3Count: 0, hasAffiliateLinks: false, ctaCount: 0, contentChars: 0 },
    causes: body.description?.trim() ? [body.description.trim()] : [],
    suggestions: [],
    status: '未対応',
    business: body.business.trim(),
    priority: body.priority ?? 'medium',
    source: 'manual',
  };

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': '57hustler-dashboard',
  };

  for (const filePath of FILE_PATHS) {
    const result = await addToOneFile(filePath, article, headers);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, slug });
}
