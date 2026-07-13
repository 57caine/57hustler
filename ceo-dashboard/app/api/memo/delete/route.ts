import { NextRequest, NextResponse } from 'next/server';

const REPO      = '57caine/57hustler';
const FILE_PATH = 'data/memos.json';

interface Memo {
  id: string;
  text: string;
  category: string;
  createdAt: string;
}

interface MemosFile {
  lastUpdated: string;
  memos: Memo[];
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const { id } = await req.json() as { id: string };
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': '57hustler-dashboard',
  };

  const getRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    { headers }
  );
  if (!getRes.ok) return NextResponse.json({ error: 'fetch failed' }, { status: 500 });

  const fileData = await getRes.json() as { sha: string; content: string };
  const existing: MemosFile = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));

  const before = existing.memos.length;
  existing.memos = existing.memos.filter(m => m.id !== id);
  if (existing.memos.length === before) return NextResponse.json({ error: 'not found' }, { status: 404 });

  existing.lastUpdated = new Date().toISOString();
  const content = Buffer.from(JSON.stringify(existing, null, 2), 'utf-8').toString('base64');

  const putRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ message: 'memo: メモ削除', content, sha: fileData.sha }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
