import { NextRequest, NextResponse } from 'next/server';

const AV_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const AV_BASE = 'https://www.alphavantage.co/query';

const PAIRS: Record<string, { from: string; to: string; base: number; digits: number }> = {
  USDJPY: { from: 'USD', to: 'JPY', base: 150.5,  digits: 3 },
  EURUSD: { from: 'EUR', to: 'USD', base: 1.085,  digits: 5 },
  EURJPY: { from: 'EUR', to: 'JPY', base: 163.2,  digits: 3 },
};

function generateMock(pair: string, interval: string) {
  const { base, digits } = PAIRS[pair] ?? PAIRS.USDJPY;
  const msMap: Record<string, number> = {
    '5min': 5 * 60 * 1000,
    '60min': 60 * 60 * 1000,
    'daily': 24 * 60 * 60 * 1000,
  };
  const step = msMap[interval] ?? msMap['60min'];
  const vol = base * 0.0012;
  const now = Date.now();
  let price = base;
  return Array.from({ length: 100 }, (_, rev) => {
    const i = 99 - rev;
    const drift = (Math.random() - 0.485) * vol;
    const o = price;
    const c = +(o + drift).toFixed(digits);
    const wick = Math.random() * vol * 0.6;
    price = c;
    return {
      x: now - i * step,
      o: +o.toFixed(digits),
      h: +(Math.max(o, c) + wick).toFixed(digits),
      l: +(Math.min(o, c) - wick).toFixed(digits),
      c,
    };
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pair     = searchParams.get('pair')     ?? 'USDJPY';
  const interval = searchParams.get('interval') ?? '60min';

  if (!PAIRS[pair]) return NextResponse.json({ error: 'Invalid pair' }, { status: 400 });

  if (!AV_KEY) {
    return NextResponse.json({ pair, interval, candles: generateMock(pair, interval), mock: true });
  }

  const { from, to } = PAIRS[pair];
  const isDaily = interval === 'daily';
  const func    = isDaily ? 'FX_DAILY' : 'FX_INTRADAY';
  const timeKey = isDaily ? 'Time Series FX (Daily)' : `Time Series FX (${interval})`;

  const params = new URLSearchParams({
    function: func, from_symbol: from, to_symbol: to,
    apikey: AV_KEY, outputsize: 'compact',
    ...(!isDaily ? { interval } : {}),
  });

  try {
    const res  = await fetch(`${AV_BASE}?${params}`, { next: { revalidate: 300 } });
    const data = await res.json() as Record<string, unknown>;

    if (data['Note'] || data['Information']) {
      return NextResponse.json({ pair, interval, candles: generateMock(pair, interval), mock: true, rateLimit: true });
    }

    const ts = data[timeKey] as Record<string, Record<string, string>> | undefined;
    if (!ts) return NextResponse.json({ error: 'No data from API' }, { status: 502 });

    const candles = Object.entries(ts)
      .map(([time, v]) => ({
        x: new Date(time).getTime(),
        o: parseFloat(v['1. open']),
        h: parseFloat(v['2. high']),
        l: parseFloat(v['3. low']),
        c: parseFloat(v['4. close']),
      }))
      .sort((a, b) => a.x - b.x)
      .slice(-100);

    return NextResponse.json({ pair, interval, candles, mock: false });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
