import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export const dynamic = 'force-dynamic';
const url = 'https://api.github.com/repos/57caine/57hustler/contents/data/ga4-analytics.json?ref=main';

type LensSite = {
  siteName?: unknown;
  totalSessions?: unknown;
  affiliateClicksTotal?: unknown;
  affiliateClicksByPlatform?: { a8?: unknown; rakuten?: unknown };
  singleBoxComparisonClicks?: { total?: unknown; status?: unknown };
};
function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  const token = process.env.GITHUB_TOKEN;
  const base = { revenueConfirmed: null, revenueStatus: 'ASPの確定報酬は未取得', source: 'https://github.com/57caine/57hustler/blob/main/data/ga4-analytics.json', fetchedAt: new Date().toISOString() };
  const unavailable = (reason: string) => NextResponse.json({ ...base, available: false, error: reason }, { headers: { 'Cache-Control': 'no-store' } });
  if (!token) return unavailable('GitHub連携が未設定です');
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.raw+json', 'User-Agent': 'jarvis-ceo-dashboard' },
      cache: 'no-store', signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return unavailable(`GA4取得に失敗しました（HTTP ${response.status}）`);
    const snapshot: unknown = await response.json();
    if (!snapshot || typeof snapshot !== 'object' || !('sites' in snapshot) || !Array.isArray(snapshot.sites)) return unavailable('データ形式を確認できません');
    const lens = (snapshot.sites as LensSite[]).find(s => s.siteName === 'lens-navi');
    if (!lens) return unavailable('レンズナビのデータがありません');
    const generatedAt = 'generatedAt' in snapshot && typeof snapshot.generatedAt === 'string' && !Number.isNaN(Date.parse(snapshot.generatedAt)) ? snapshot.generatedAt : null;
    return NextResponse.json({
      ...base, available: true, generatedAt, period: '過去28日間（当日を含む）',
      lens: {
        sessions: numberOrNull(lens.totalSessions),
        outboundClicks: numberOrNull(lens.affiliateClicksTotal),
        a8Clicks: numberOrNull(lens.affiliateClicksByPlatform?.a8),
        rakutenClicks: numberOrNull(lens.affiliateClicksByPlatform?.rakuten),
        singleBoxClicks: lens.singleBoxComparisonClicks?.status === 'ok' ? numberOrNull(lens.singleBoxComparisonClicks?.total) : null,
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return unavailable('GA4に接続できませんでした'); }
}
