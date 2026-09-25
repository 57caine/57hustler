import { NextRequest, NextResponse } from 'next/server';

const REPO = '57caine/57hustler';
const FILE_PATH = 'data/report-log.json';

interface ReportEntry {
  id: string;
  createdAt: string;
  business: string;
  source: string;
  summary: string;
  status: '未確認' | '確認済み';
}

interface ReportLogFile {
  generatedAt: string;
  reports: ReportEntry[];
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const body = await req.json() as { business?: string; source?: string; summary?: string };
  if (!body.summary?.trim()) return NextResponse.json({ error: 'summary required' }, { status: 400 });

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': '57hustler-dashboard',
  };

  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, { headers });
  if (!getRes.ok) return NextResponse.json({ error: `GET ${FILE_PATH} failed: ${getRes.status}` }, { status: 500 });

  const fileData = await getRes.json() as { sha: string; content: string };
  const data = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8')) as ReportLogFile;

  const now = new Date();
  const entry: ReportEntry = {
    id: `${now.toISOString().slice(0, 19).replace(/[-:T]/g, '')}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now.toISOString(),
    business: body.business?.trim() || '不明',
    source: body.source?.trim() || '(未記入)',
    summary: body.summary.trim(),
    status: '未確認',
  };

  data.reports.unshift(entry);
  data.generatedAt = now.toISOString();

  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `report-log: 報告を追加 (${entry.business})`, content, sha: fileData.sha }),
  });
  if (!putRes.ok) return NextResponse.json({ error: `PUT ${FILE_PATH} failed: ${await putRes.text()}` }, { status: 500 });

  return NextResponse.json({ success: true, entry });
}
