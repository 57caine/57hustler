'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface Candle { x: number; o: number; h: number; l: number; c: number; }
interface FxData { pair: string; interval: string; candles: Candle[]; mock: boolean; rateLimit?: boolean; }
interface Signal { i: number; type: 'buy' | 'sell'; price: number; date: string; }
interface BacktestResult {
  signals: Signal[];
  totalTrades: number;
  wins: number;
  totalPnl: number;
  maxDrawdown: number;
}

const PAIRS = ['USDJPY', 'EURUSD', 'EURJPY'];
const INTERVALS = [
  { key: '5min',  label: '5分足' },
  { key: '60min', label: '1時間足' },
  { key: 'daily', label: '日足' },
];

function calcSMA(candles: Candle[], period: number): (number | null)[] {
  return candles.map((_, i) => {
    if (i < period - 1) return null;
    const slice = candles.slice(i - period + 1, i + 1);
    return slice.reduce((s, c) => s + c.c, 0) / period;
  });
}

function runBacktest(candles: Candle[], sma5: (number | null)[], sma25: (number | null)[]): BacktestResult {
  const signals: Signal[] = [];
  let position: 'long' | 'short' | null = null;
  let entryPrice = 0;
  let wins = 0;
  let totalPnl = 0;
  let peakPnl = 0;
  let maxDrawdown = 0;

  for (let i = 1; i < candles.length; i++) {
    const prev5 = sma5[i - 1];
    const cur5 = sma5[i];
    const prev25 = sma25[i - 1];
    const cur25 = sma25[i];
    if (!prev5 || !cur5 || !prev25 || !cur25) continue;

    const date = new Date(candles[i].x).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });

    // Golden cross → buy
    if (prev5 <= prev25 && cur5 > cur25 && position !== 'long') {
      if (position === 'short') {
        const pnl = entryPrice - candles[i].c;
        if (pnl > 0) wins++;
        totalPnl += pnl;
        peakPnl = Math.max(peakPnl, totalPnl);
        maxDrawdown = Math.max(maxDrawdown, peakPnl - totalPnl);
      }
      position = 'long';
      entryPrice = candles[i].c;
      signals.push({ i, type: 'buy', price: candles[i].c, date });
    }
    // Dead cross → sell
    else if (prev5 >= prev25 && cur5 < cur25 && position !== 'short') {
      if (position === 'long') {
        const pnl = candles[i].c - entryPrice;
        if (pnl > 0) wins++;
        totalPnl += pnl;
        peakPnl = Math.max(peakPnl, totalPnl);
        maxDrawdown = Math.max(maxDrawdown, peakPnl - totalPnl);
      }
      position = 'short';
      entryPrice = candles[i].c;
      signals.push({ i, type: 'sell', price: candles[i].c, date });
    }
  }

  return { signals, totalTrades: signals.length, wins, totalPnl, maxDrawdown };
}

function drawChart(
  canvas: HTMLCanvasElement,
  candles: Candle[],
  sma5: (number | null)[],
  sma25: (number | null)[],
  sma75: (number | null)[],
  signals: Signal[],
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const pad = { top: 20, right: 20, bottom: 40, left: 70 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const prices = candles.flatMap(c => [c.h, c.l]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;

  const toX = (i: number) => pad.left + (i / (candles.length - 1)) * chartW;
  const toY = (p: number) => pad.top + (1 - (p - minP) / range) * chartH;

  // Background
  ctx.fillStyle = '#0d0d14';
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = '#2a2a3a';
  ctx.lineWidth = 0.5;
  const steps = 5;
  for (let s = 0; s <= steps; s++) {
    const p = minP + (range * s) / steps;
    const y = toY(p);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = '#6b6b8a';
    ctx.font = '11px monospace';
    ctx.fillText(p.toFixed(candles[0] ? (candles[0].c > 10 ? 2 : 4) : 3), 4, y + 4);
  }

  // Candles
  const barW = Math.max(1, chartW / candles.length * 0.7);
  candles.forEach((c, i) => {
    const x = toX(i);
    const isUp = c.c >= c.o;
    ctx.strokeStyle = isUp ? '#22c55e' : '#ef4444';
    ctx.fillStyle = isUp ? '#22c55e' : '#ef4444';

    // Wick
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, toY(c.h));
    ctx.lineTo(x, toY(c.l));
    ctx.stroke();

    // Body
    const y1 = toY(Math.max(c.o, c.c));
    const y2 = toY(Math.min(c.o, c.c));
    const bodyH = Math.max(1, y2 - y1);
    ctx.fillRect(x - barW / 2, y1, barW, bodyH);
  });

  // SMA lines
  const drawSMA = (sma: (number | null)[], color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let started = false;
    sma.forEach((v, i) => {
      if (v === null) return;
      const x = toX(i);
      const y = toY(v);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };
  drawSMA(sma5, '#f59e0b');
  drawSMA(sma25, '#7c6ef7');
  drawSMA(sma75, '#06b6d4');

  // Signals
  signals.forEach(sig => {
    const x = toX(sig.i);
    const y = toY(sig.price);
    ctx.fillStyle = sig.type === 'buy' ? '#22c55e' : '#ef4444';
    ctx.beginPath();
    if (sig.type === 'buy') {
      ctx.moveTo(x, y + 10);
      ctx.lineTo(x - 6, y + 18);
      ctx.lineTo(x + 6, y + 18);
    } else {
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x - 6, y - 18);
      ctx.lineTo(x + 6, y - 18);
    }
    ctx.closePath();
    ctx.fill();
  });

  // X-axis labels
  ctx.fillStyle = '#6b6b8a';
  ctx.font = '10px monospace';
  const labelCount = 6;
  for (let k = 0; k <= labelCount; k++) {
    const i = Math.round((k / labelCount) * (candles.length - 1));
    const x = toX(i);
    const d = new Date(candles[i].x);
    const label = d.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' });
    ctx.fillText(label, x - 18, H - 10);
  }

  // Legend
  const legend = [
    { color: '#f59e0b', label: 'SMA5' },
    { color: '#7c6ef7', label: 'SMA25' },
    { color: '#06b6d4', label: 'SMA75' },
  ];
  legend.forEach((l, i) => {
    ctx.strokeStyle = l.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad.left + i * 80, pad.top - 6);
    ctx.lineTo(pad.left + i * 80 + 18, pad.top - 6);
    ctx.stroke();
    ctx.fillStyle = '#e8e8f0';
    ctx.font = '11px monospace';
    ctx.fillText(l.label, pad.left + i * 80 + 22, pad.top - 2);
  });
}

export default function FxClient() {
  const [pair, setPair] = useState('USDJPY');
  const [interval, setInterval_] = useState('60min');
  const [data, setData] = useState<FxData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backtest, setBacktest] = useState<BacktestResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchData = useCallback(async (p: string, iv: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/fx-data?pair=${p}&interval=${iv}`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json() as FxData;
      setData(json);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(pair, interval);
  }, [pair, interval, fetchData]);

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const { candles } = data;
    const sma5  = calcSMA(candles, 5);
    const sma25 = calcSMA(candles, 25);
    const sma75 = calcSMA(candles, 75);
    const bt = runBacktest(candles, sma5, sma25);
    setBacktest(bt);
    drawChart(canvasRef.current, candles, sma5, sma25, sma75, bt.signals);
  }, [data]);

  const latestClose = data?.candles.at(-1)?.c;
  const prevClose   = data?.candles.at(-2)?.c;
  const change = latestClose && prevClose ? latestClose - prevClose : null;

  const digits = pair === 'EURUSD' ? 5 : 3;
  const pctChange = change && prevClose ? (change / prevClose) * 100 : null;

  return (
    <div style={{ color: 'var(--text)' }}>
      {/* Header / rate display */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <div className="text-2xl font-bold font-mono">
            {latestClose?.toFixed(digits) ?? '—'}
          </div>
          {change !== null && pctChange !== null && (
            <div className="text-sm font-mono" style={{ color: change >= 0 ? 'var(--green)' : '#ef4444' }}>
              {change >= 0 ? '+' : ''}{change.toFixed(digits)} ({pctChange >= 0 ? '+' : ''}{pctChange.toFixed(2)}%)
            </div>
          )}
        </div>

        {data?.mock && (
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            {data.rateLimit ? 'API上限 → モック' : 'モックデータ'}
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-1">
          {PAIRS.map(p => (
            <button key={p} onClick={() => setPair(p)}
              className="px-3 py-1 rounded text-sm font-mono"
              style={{
                background: pair === p ? 'var(--accent)' : 'var(--surface)',
                color: pair === p ? '#fff' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {INTERVALS.map(iv => (
            <button key={iv.key} onClick={() => setInterval_(iv.key)}
              className="px-3 py-1 rounded text-sm"
              style={{
                background: interval === iv.key ? 'var(--accent)' : 'var(--surface)',
                color: interval === iv.key ? '#fff' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}>
              {iv.label}
            </button>
          ))}
        </div>
        <button onClick={() => fetchData(pair, interval)}
          className="px-3 py-1 rounded text-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          🔄 更新
        </button>
      </div>

      {/* Chart */}
      <div className="relative rounded-lg overflow-hidden mb-4"
        style={{ background: '#0d0d14', border: '1px solid var(--border)' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(13,13,20,0.8)', color: 'var(--muted)', zIndex: 10 }}>
            読み込み中...
          </div>
        )}
        {error && (
          <div className="p-4 text-sm" style={{ color: '#ef4444' }}>{error}</div>
        )}
        <canvas ref={canvasRef} width={720} height={360}
          style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      {/* Backtest results */}
      {backtest && (
        <div className="rounded-lg p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--accent)' }}>
            📊 バックテスト結果（SMA5/25 ゴールデンクロス戦略）
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <div style={{ color: 'var(--muted)' }}>総トレード数</div>
              <div className="font-mono font-bold">{backtest.totalTrades}</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)' }}>勝率</div>
              <div className="font-mono font-bold"
                style={{ color: backtest.totalTrades > 0 && (backtest.wins / backtest.totalTrades) >= 0.5 ? 'var(--green)' : '#ef4444' }}>
                {backtest.totalTrades > 0 ? Math.round((backtest.wins / backtest.totalTrades) * 100) : 0}%
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)' }}>累積損益 (pips換算)</div>
              <div className="font-mono font-bold"
                style={{ color: backtest.totalPnl >= 0 ? 'var(--green)' : '#ef4444' }}>
                {backtest.totalPnl >= 0 ? '+' : ''}{backtest.totalPnl.toFixed(digits)}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)' }}>最大ドローダウン</div>
              <div className="font-mono font-bold" style={{ color: '#ef4444' }}>
                -{backtest.maxDrawdown.toFixed(digits)}
              </div>
            </div>
          </div>

          {/* Signal list */}
          {backtest.signals.length > 0 && (
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>直近シグナル（最新5件）</div>
              <div className="space-y-1">
                {backtest.signals.slice(-5).reverse().map((sig, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono px-2 py-1 rounded"
                    style={{ background: sig.type === 'buy' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                    <span style={{ color: sig.type === 'buy' ? 'var(--green)' : '#ef4444' }}>
                      {sig.type === 'buy' ? '▲ BUY' : '▼ SELL'}
                    </span>
                    <span>{sig.date}</span>
                    <span>{sig.price.toFixed(digits)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
