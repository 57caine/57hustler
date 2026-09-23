import { NextRequest, NextResponse } from 'next/server';

const REPO = '57caine/57hustler';
const FILE_PATHS = ['data/column-review.json', 'ceo-dashboard/public/column-review.json'];

interface FlaggedArticle {
  slug: string;
  status?: '未対応' | '対応済み' | '様子見';
  pendingPr?: { url: string; branch: string; prNumber: number; title: string; body: string; createdAt: string };
  autoFixMergedAt?: string;
  [key: string]: unknown;
}

interface ColumnReviewFile {
  flaggedCount: number;
  flaggedArticles: FlaggedArticle[];
}

async function updateOneFile(filePath: string, slug: string, headers: Record<string, string>): Promise<{ ok: boolean; error?: string }> {
  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, { headers });
  if (!getRes.ok) return { ok: false, error: `GET ${filePath} failed: ${getRes.status}` };

  const fileData = await getRes.json() as { sha: string; content: string };
  const data = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8')) as ColumnReviewFile;

  const article = data.flaggedArticles.find(a => a.slug === slug);
  if (!article) return { ok: false, error: `slug not found in ${filePath}: ${slug}` };

  article.status = '対応済み';
  article.autoFixMergedAt = new Date().toISOString();
  delete article.pendingPr;
  data.flaggedCount = data.flaggedArticles.filter(a => (a.status ?? '未対応') === '未対応').length;

  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `改善レビュー自動修正PRを承認・マージ: ${slug}`, content, sha: fileData.sha }),
  });
  if (!putRes.ok) return { ok: false, error: `PUT ${filePath} failed: ${await putRes.text()}` };
  return { ok: true };
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const body = await req.json() as { slug: string; prNumber: number };
  if (!body.slug || !body.prNumber) {
    return NextResponse.json({ error: 'slug, prNumber required' }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': '57hustler-dashboard',
  };

  // オーナーがダッシュボード上で「承認する」を押した = PRの内容を確認・了承したという意思表示。
  // ここでGitHub上のPRを実際にmainへマージする（本番反映はVercelの通常デプロイフローに乗る）。
  const mergeRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${body.prNumber}/merge`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ merge_method: 'merge' }),
  });
  if (!mergeRes.ok) {
    const errText = await mergeRes.text();
    return NextResponse.json({ error: `PRのマージに失敗しました: ${errText}` }, { status: 500 });
  }

  // マージ後、column-review.json側のステータスを即座に反映しておく
  // （.github/workflows/auto-fix-pr-merged.yml もPRマージWebhookを検知して同じ更新を行うが、
  //   ダッシュボード上での即時反映のためここでも更新する。両方が走っても冪等なので問題ない）
  for (const filePath of FILE_PATHS) {
    const result = await updateOneFile(filePath, body.slug, headers);
    if (!result.ok) {
      // マージ自体は成功しているので、ここでの失敗はエラーとして返しつつも
      // 実質的にはマージ済み（次回自動同期ワークフローで追いつく）
      return NextResponse.json({ success: true, warning: `マージは成功しましたがダッシュボード表示の即時更新に失敗しました: ${result.error}` });
    }
  }

  return NextResponse.json({ success: true });
}
