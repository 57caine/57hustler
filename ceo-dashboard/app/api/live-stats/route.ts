import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const dynamic = 'force-dynamic';

const GA4_PROPERTIES = [
  { id: '520238223', name: 'lens-navi', label: 'lens-navi.jp' },
  { id: '539527147', name: 'school-navi', label: 'school.lens-navi.jp' },
];

const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

interface GA4Stat {
  name: string;
  label: string;
  sessionsToday: number;
  affiliateClicksToday: number;
  activeUsersNow: number;
}

async function firstMetricValue(promise: Promise<unknown>): Promise<number> {
  try {
    const result = await promise as [{ rows?: { metricValues?: { value?: string }[] }[] }];
    return parseInt(result[0]?.rows?.[0]?.metricValues?.[0]?.value ?? '0');
  } catch {
    return 0;
  }
}

async function fetchGa4Stat(
  client: BetaAnalyticsDataClient,
  property: typeof GA4_PROPERTIES[0],
): Promise<GA4Stat> {
  const propertyId = `properties/${property.id}`;

  const [sessionsToday, affiliateClicksToday, activeUsersNow] = await Promise.all([
    firstMetricValue(client.runReport({
      property: propertyId,
      dimensions: [],
      metrics: [{ name: 'sessions' }],
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
    })),
    firstMetricValue(client.runReport({
      property: propertyId,
      dimensions: [],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: { matchType: 'EXACT', value: 'affiliate_click' },
        },
      },
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
    })),
    firstMetricValue(client.runRealtimeReport({
      property: propertyId,
      metrics: [{ name: 'activeUsers' }],
    })),
  ]);

  return { name: property.name, label: property.label, sessionsToday, affiliateClicksToday, activeUsersNow };
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function GET() {
  const fetchedAt = new Date().toISOString();
  const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY;

  const [yonaka, zassou] = await Promise.all([
    fetchJson<{ posts: { date: string }[] }>('yonaka-post-history.json'),
    fetchJson<{ totalCount: number }>('zassou-stock.json'),
  ]);

  const todayJST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const yonakaPostsToday = yonaka?.posts?.filter(p => p.date === todayJST).length ?? 0;

  let ga4: GA4Stat[] = [];
  let ga4Error: string | null = null;

  if (!keyJson) {
    ga4Error = 'GA4_SERVICE_ACCOUNT_KEY未設定';
  } else {
    try {
      const credentials = JSON.parse(keyJson);
      const client = new BetaAnalyticsDataClient({ credentials });
      ga4 = await Promise.all(GA4_PROPERTIES.map(p => fetchGa4Stat(client, p)));
    } catch (e) {
      ga4Error = (e as Error).message;
    }
  }

  return NextResponse.json({
    fetchedAt,
    ga4,
    ga4Error,
    yonakaPostsToday,
    zassouStockTotal: zassou?.totalCount ?? null,
  });
}
