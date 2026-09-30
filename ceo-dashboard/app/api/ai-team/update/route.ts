import { NextRequest, NextResponse } from 'next/server';

const REPO = '57caine/57hustler';
const FILE_PATH = 'data/ai-team.json';

interface Member {
  id: string;
  name: string;
  role: string;
  status: string;
  currentTask: string;
  nextTask: string;
  completedTasks: string[];
  pendingDecision: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

interface AiTeamFile {
  generatedAt: string;
  members: Member[];
}

export async function POST(req: NextRequest) {
  const TOKEN = process.env.GITHUB_TOKEN;
  if (!TOKEN) return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });

  const body = await req.json() as {
    id: string;
    status?: string;
    currentTask?: string;
    nextTask?: string;
    pendingDecision?: string;
    addCompletedTask?: string;
  };
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': '57hustler-dashboard',
  };

  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, { headers });
  if (!getRes.ok) return NextResponse.json({ error: `GET ${FILE_PATH} failed: ${getRes.status}` }, { status: 500 });

  const fileData = await getRes.json() as { sha: string; content: string };
  const data = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8')) as AiTeamFile;

  const member = data.members.find(m => m.id === body.id);
  if (!member) return NextResponse.json({ error: `member not found: ${body.id}` }, { status: 404 });

  if (typeof body.status === 'string') member.status = body.status;
  if (typeof body.currentTask === 'string') member.currentTask = body.currentTask;
  if (typeof body.nextTask === 'string') member.nextTask = body.nextTask;
  if (typeof body.pendingDecision === 'string') member.pendingDecision = body.pendingDecision;
  if (body.addCompletedTask?.trim()) {
    member.completedTasks = [body.addCompletedTask.trim(), ...member.completedTasks].slice(0, 20);
  }
  member.updatedAt = new Date().toISOString();
  member.updatedBy = 'owner';
  data.generatedAt = new Date().toISOString();

  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `ai-team: ${body.id}を更新`, content, sha: fileData.sha }),
  });
  if (!putRes.ok) return NextResponse.json({ error: `PUT ${FILE_PATH} failed: ${await putRes.text()}` }, { status: 500 });

  return NextResponse.json({ success: true });
}
