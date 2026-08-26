'use client';
import { useEffect, useRef, useState } from 'react';

interface GA4Stat {
  name: string;
  label: string;
  sessionsToday: number;
  affiliateClicksToday: number;
  activeUsersNow: number;
}

interface LiveStats {
  fetchedAt: string;
  ga4: GA4Stat[];
  ga4Error: string | null;
  yonakaPostsToday: number;
  zassouStockTotal: number | null;
}

const POLL_MS = 45_000;

// 直前のフェッチ結果と比較し、変化した値のキーだけ短時間ハイライトする
function diffKeys(prev: LiveStats | null, next: LiveStats): Set<string> {
  if (!prev) return new Set();
  const changed = new Set<string>();
  for (const site of next.ga4) {
    const before = prev.ga4.find(s => s.name === site.name);
    if (!before) continue;
    if (before.sessionsToday !== site.sessionsToday) changed.add(`${site.name}-sessions`);
    if (before.affiliateClicksToday !== site.affiliateClicksToday) changed.add(`${site.name}-clicks`);
    if (before.activeUsersNow !== site.activeUsersNow) changed.add(`${site.name}-active`);
  }
  if (prev.yonakaPostsToday !== next.yonakaPostsToday) changed.add('yonaka-posts');
  if (prev.zassouStockTotal !== next.zassouStockTotal) changed.add('zassou-stock');
  return changed;
}

function NumberCard({
  label, value, unit, accent, highlighted,
}: {
  label: string; value: number | string; unit?: string; accent: string; highlighted: boolean;
}) {
  return (
    <div
      className="rounded-lg border p-3 transition-colors duration-700"
      style={{
        background: highlighted ? `${accent}14` : '#ffffff',
        borderColor: highlighted ? accent : '#e5e7eb',
      }}
    >
      <div className="text-[10px] text-gray-500 mb-1 truncate">{label}</div>
      <div
        className="text-2xl font-bold font-mono transition-opacity duration-300"
        style={{ color: accent, fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
        {unit && <span className="text-xs ml-0.5 font-sans font-normal text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}

export default function LiveStatsSection() {
  const [data, setData] = useState<LiveStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const prevRef = useRef<LiveStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch('/api/live-stats', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const next: LiveStats = await res.json();
        if (cancelled) return;

        const changed = diffKeys(prevRef.current, next);
        prevRef.current = next;
        setData(next);
        setError(null);
        if (changed.size > 0) {
          setHighlighted(changed);
          setTimeout(() => { if (!cancelled) setHighlighted(new Set()); }, 1500);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) timer = setTimeout(poll, POLL_MS);
      }
    }

    poll();
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  if (error && !data) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
        本日のライブ指標を取得できませんでした（{error}）
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-400">
        本日のライブ指標を読み込み中...
      </div>
    );
  }

  const lastUpdated = new Date(data.fetchedAt).toLocaleTimeString('ja-JP', {
    timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-sm font-bold text-gray-800">本日のライブ指標</h2>
        </div>
        <span className="text-[10px] font-mono text-gray-400">更新 {lastUpdated}</span>
      </div>

      {data.ga4Error && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5 mb-3">
          GA4データ未接続（{data.ga4Error}）。lens-navi / school-navi の数値は準備中です。
        </div>
      )}

      {data.ga4.map(site => (
        <div key={site.name} className="mb-3 last:mb-0">
          <div className="text-xs font-semibold text-gray-600 mb-1.5">{site.label}</div>
          <div className="grid grid-cols-3 gap-2">
            <NumberCard label="本日のセッション" value={site.sessionsToday} accent="#2563eb"
              highlighted={highlighted.has(`${site.name}-sessions`)} />
            <NumberCard label="本日のクリック" value={site.affiliateClicksToday} accent="#16a34a"
              highlighted={highlighted.has(`${site.name}-clicks`)} />
            <NumberCard label="今アクセス中" value={site.activeUsersNow} unit="人" accent="#9333ea"
              highlighted={highlighted.has(`${site.name}-active`)} />
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
        <NumberCard label="夜中のおじさん・本日投稿" value={data.yonakaPostsToday} unit="本" accent="#0ea5e9"
          highlighted={highlighted.has('yonaka-posts')} />
        <NumberCard label="雑草ストック・在庫合計" value={data.zassouStockTotal ?? '—'} unit="件" accent="#65a30d"
          highlighted={highlighted.has('zassou-stock')} />
      </div>

      <p className="text-[10px] text-gray-400 mt-3">
        {POLL_MS / 1000}秒ごとに自動更新。数値が変わると枠がハイライトされます。
      </p>
    </div>
  );
}
