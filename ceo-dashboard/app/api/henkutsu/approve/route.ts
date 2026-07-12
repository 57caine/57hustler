import { NextRequest, NextResponse } from 'next/server';

const REPO      = '57caine/57hustler';
const FILE_PATH = 'data/henkutsu-approved.json';

interface ApprovedItem {
  id: string;
  title: string;
  descriptionJa?: string;
  postDraft?: string;
  url: string;
  source: string;
  score: number;
  price?: string;
  approvedAt: string;
}

interface ApprovedFile {
  lastUpdated: string;
  approved: ApprovedItem[];
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });
  }

  const body = await req.json() as Omit<ApprovedItem, 'approvedAt'>;
  if (!body.id || !body.title || !body.url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': '57hustler-dashboard',
  };

  // Get current file + SHA
  const getRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    { headers }
  );

  let existing: ApprovedFile = { lastUpdated: '', approved: [] };
  let sha: string | undefined;

  if (getRes.ok) {
    const fileData = await getRes.json() as { sha: string; content: string };
    sha = fileData.sha;
    existing = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));
  }

  if (existing.approved.some(a => a.id === body.id)) {
    return NextResponse.json({ success: true, message: 'already approved' });
  }

  existing.approved.unshift({ ...body, approvedAt: new Date().toISOString() });
  existing.lastUpdated = new Date().toISOString();

  const content = Buffer.from(JSON.stringify(existing, null, 2), 'utf-8').toString('base64');

  const putRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `chore: henkutsu承認 - ${body.title}`,
        content,
        sha,
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
