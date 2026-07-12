'use client';
import { useEffect, useState } from 'react';

const JOBS = [
  { h: 4,  m: 0, label: '🌙 夜中のおじさん' },
  { h: 7,  m: 0, label: '🔯 九星気学まとめ' },
  { h: 8,  m: 0, label: '🌙 夜中のおじさん' },
  { h: 12, m: 0, label: '📝 コラム・夜中' },
  { h: 16, m: 0, label: '🌙 夜中のおじさん' },
  { h: 19, m: 0, label: '📸 Instagram' },
  { h: 20, m: 0, label: '🌙 夜中のおじさん' },
  { h: 21, m: 0, label: '✨ 一文考察' },
  { h: 22, m: 0, label: '🌙 夜中のおじさん' },
  { h: 23, m: 0, label: '📝 コラム（夜）' },
];

const pad = (n: number) => String(n).padStart(2, '0');

export default function DashboardClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <div style={{ height: 80 }} />;
  }

  const jst  = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const h    = jst.getHours();
  const m    = jst.getMinutes();
  const s    = jst.getSeconds();
  const curMin = h * 60 + m;

  const greeting =
    h < 5 ? 'お疲れ様です 🌙' :
    h < 11 ? 'おはようございます ☀️' :
    h < 17 ? 'こんにちは 🌤️' :
    'お疲れ様です 🌆';

  const dateStr = jst.toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  const next  = JOBS.find(j => j.h * 60 + j.m > curMin) ?? JOBS[0];
  const nMin  = next.h * 60 + next.m;
  const diff  = nMin > curMin ? nMin - curMin : 24 * 60 - curMin + nMin;
  const dh    = Math.floor(diff / 60);
  const dm    = diff % 60;

  return (
    <div>
      <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>{greeting}</div>
      <div className="text-4xl font-bold font-mono tracking-wider mb-1" style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
        {pad(h)}:{pad(m)}:{pad(s)}
      </div>
      <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{dateStr}</div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
        <span className="text-[11px]" style={{ color: 'var(--muted)' }}>次の投稿まで</span>
        <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
          {dh > 0 ? `${dh}h ` : ''}{dm}m
        </span>
        <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
          → {pad(next.h)}:{pad(next.m)} {next.label}
        </span>
      </div>
    </div>
  );
}
