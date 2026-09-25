import { NextRequest, NextResponse } from 'next/server';

const REPO = '57caine/57hustler';
const FILE_PATH = 'data/report-log.json';

interface ReportEntry {
  id: string;
  status?: '未確認' | '確認済み';
  confirmedAt?: string;
  [key: string]: unknown;
}

interface ReportLogFile {
  generatedAt: string;
  reports: ReportEntry[];
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const body = await req.json() as { id: string; status?: '未確認' | '確認済み' };
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const nextStatus = body.status ?? '確認済み';

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

  const report = data.reports.find(r => r.id === body.id);
  if (!report) return NextResponse.json({ error: `report not found: ${body.id}` }, { status: 404 });

  report.status = nextStatus;
  report.confirmedAt = nextStatus === '確認済み' ? new Date().toISOString() : undefined;
  if (report.confirmedAt === undefined) delete report.confirmedAt;

  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `report-log: ${body.id} を${nextStatus}に更新`, content, sha: fileData.sha }),
  });
  if (!putRes.ok) return NextResponse.json({ error: `PUT ${FILE_PATH} failed: ${await putRes.text()}` }, { status: 500 });

  return NextResponse.json({ success: true });
}
