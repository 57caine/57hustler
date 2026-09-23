import { NextRequest, NextResponse } from 'next/server';

const REPO = '57caine/57hustler';
const FILE_PATHS = ['data/column-review.json', 'ceo-dashboard/public/column-review.json'];

interface FlaggedArticle {
  slug: string;
  pendingPr?: { url: string; branch: string; prNumber: number; title: string; body: string; createdAt: string };
  autoFixRejected?: { at: string; reason: string };
  [key: string]: unknown;
}

interface ColumnReviewFile {
  flaggedArticles: FlaggedArticle[];
}

async function updateOneFile(
  filePath: string,
  slug: string,
  reason: string,
  headers: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, { headers });
  if (!getRes.ok) return { ok: false, error: `GET ${filePath} failed: ${getRes.status}` };

  const fileData = await getRes.json() as { sha: string; content: string };
  const data = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8')) as ColumnReviewFile;

  const article = data.flaggedArticles.find(a => a.slug === slug);
  if (!article) return { ok: false, error: `slug not found in ${filePath}: ${slug}` };

  // ステータスは変えず（未対応のまま）、PRだけ取り下げて保留扱いに戻す。
  // autoFixRejectedを残すことで、次回以降の自動修正の対象からは外れる
  // （scripts/lib/column-fix-eligibility.ts 参照）
  delete article.pendingPr;
  article.autoFixRejected = { at: new Date().toISOString(), reason };

  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `改善レビュー自動修正PRを見送り: ${slug}`, content, sha: fileData.sha }),
  });
  if (!putRes.ok) return { ok: false, error: `PUT ${filePath} failed: ${await putRes.text()}` };
  return { ok: true };
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const body = await req.json() as { slug: string; prNumber: number; branch: string; reason?: string };
  if (!body.slug || !body.prNumber) {
    return NextResponse.json({ error: 'slug, prNumber required' }, { status: 400 });
  }
  const reason = body.reason?.trim() || '(理由の記載なし)';

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': '57hustler-dashboard',
  };

  const closeRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${body.prNumber}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ state: 'closed' }),
  });
  if (!closeRes.ok) {
    const errText = await closeRes.text();
    return NextResponse.json({ error: `PRのクローズに失敗しました: ${errText}` }, { status: 500 });
  }

  // ブランチ削除はベストエフォート（失敗しても処理は続行する）
  if (body.branch) {
    await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/${encodeURIComponent(body.branch)}`, {
      method: 'DELETE',
      headers,
    }).catch(() => {});
  }

  for (const filePath of FILE_PATHS) {
    const result = await updateOneFile(filePath, body.slug, reason, headers);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
