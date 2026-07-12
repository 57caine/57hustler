import { NextRequest, NextResponse } from 'next/server';

const REPO      = '57caine/57hustler';
const FILE_PATH = 'data/memos.json';

interface Memo {
  id: string;
  text: string;
  category: 'yonaka' | 'henkutsu' | 'ceo' | 'other';
  createdAt: string;
}

interface MemosFile {
  lastUpdated: string;
  memos: Memo[];
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const body = await req.json() as { text: string; category: Memo['category'] };
  if (!body.text?.trim()) return NextResponse.json({ error: 'text required' }, { status: 400 });

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

  let existing: MemosFile = { lastUpdated: '', memos: [] };
  let sha: string | undefined;

  if (getRes.ok) {
    const fileData = await getRes.json() as { sha: string; content: string };
    sha = fileData.sha;
    existing = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));
  }

  const now = new Date().toISOString();
  existing.memos.unshift({ id: makeId(), text: body.text.trim(), category: body.category ?? 'other', createdAt: now });
  existing.memos = existing.memos.slice(0, 500);
  existing.lastUpdated = now;

  const content = Buffer.from(JSON.stringify(existing, null, 2), 'utf-8').toString('base64');

  const putRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ message: `memo: ${body.category} メモ追加`, content, sha }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
