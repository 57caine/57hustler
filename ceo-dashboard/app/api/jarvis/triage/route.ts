import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { preparePacket, summarizePreflight } from '@/lib/jarvis/tri-ai';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: '不正な送信元です' }, { status: 403 });
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json'))
    return NextResponse.json({ error: 'JSON形式が必要です' }, { status: 415 });
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: 'JSONを読み取れません' }, { status: 400 }); }
  const message = payload && typeof payload === 'object' && 'message' in payload ? (payload as { message: unknown }).message : null;
  if (typeof message !== 'string' || !message.trim() || message.length > 500)
    return NextResponse.json({ error: '1〜500文字の相談を入力してください' }, { status: 400 });
  // Never call metered model APIs without a separately reviewed and enabled
  // provider connector, explicit spend cap and a verified owner authorization.
  const packet = preparePacket(message);
  return NextResponse.json({ ...packet, summary: summarizePreflight(packet) }, { headers: { 'Cache-Control': 'no-store' } });
}
