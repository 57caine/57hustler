import { Suspense } from 'react';

const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

interface ColumnPost  { date: string; text: string; }
interface YonakaPost  { date: string; text: string; }
interface IgPost      { date: string; type: string; postId: string; images: string[]; }

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

const SCHEDULE = [
  { time: '07:00', label: '🔯 九星気学まとめ',  ch: 'Threads',   cron: '0 22 * * *' },
  { time: '12:00', label: '📝 コラム（昼）',     ch: 'Threads',   cron: '0 3 * * *'  },
  { time: '19:00', label: '📸 swipe投稿',        ch: 'Instagram', cron: '0 10 1,3,5' },
  { time: '21:00', label: '✨ 一文考察',         ch: 'Threads',   cron: '0 12 * * *' },
  { time: '22:00', label: '🌙 夜中のおじさん',   ch: 'Threads',   cron: '0 13 * * *' },
  { time: '23:00', label: '📝 コラム（夜）',     ch: 'Threads',   cron: '0 14 * * *' },
];

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-4 ${className}`}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
      style={{ color: 'var(--muted)' }}>
      {children}
    </h2>
  );
}

function ScheduleSection() {
  const nowJst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const nowMin = nowJst.getHours() * 60 + nowJst.getMinutes();

  const nextIdx = SCHEDULE.findIndex(s => {
    const [h, m] = s.time.split(':').map(Number);
    return h * 60 + m > nowMin;
  });

  return (
    <Card>
      <SectionTitle>今日のスケジュール</SectionTitle>
      <div className="space-y-2">
        {SCHEDULE.map((s, i) => {
          const isNext = i === nextIdx;
          const [h, m] = s.time.split(':').map(Number);
          const isPast = h * 60 + m <= nowMin;
          return (
            <div key={s.time}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm"
              style={{
                background: isNext ? 'var(--accent-dim)' : 'transparent',
                opacity: isPast ? 0.45 : 1,
              }}>
              <span className="w-12 tabular-nums text-xs font-mono"
                style={{ color: isNext ? 'var(--accent)' : 'var(--muted)' }}>
                {s.time}
              </span>
              <span className="flex-1" style={{ color: 'var(--text)' }}>{s.label}</span>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: s.ch === 'Threads' ? '#1a1a2e' : '#1a2820',
                  color: s.ch === 'Threads' ? '#818cf8' : '#4ade80',
                }}>
                {s.ch}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

async function RecentPosts() {
  const [col, ig, yn] = await Promise.all([
    fetchJson<{ posts: ColumnPost[] }>('column-history.json'),
    fetchJson<{ posts: IgPost[] }>('instagram-history.json'),
    fetchJson<{ posts: YonakaPost[] }>('yonaka-post-history.json'),
  ]);

  const sections = [
    { label: '夜中のおじさん', items: yn?.posts.slice(0, 3) ?? [], color: '#818cf8' },
    { label: 'Threadsコラム',  items: col?.posts.slice(0, 3) ?? [], color: '#60a5fa' },
    { label: 'Instagram',      items: ig?.posts.slice(0, 3).map(p => ({ date: p.date, text: `${p.type} / ${p.images.length}枚` })) ?? [], color: '#f472b6' },
  ];

  return (
    <div className="space-y-4">
      {sections.map(sec => (
        <Card key={sec.label}>
          <SectionTitle>{sec.label}</SectionTitle>
          {sec.items.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>投稿履歴なし</p>
          ) : (
            <div className="space-y-2">
              {sec.items.map((p, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-xs tabular-nums shrink-0 mt-0.5"
                    style={{ color: 'var(--muted)' }}>
                    {p.date}
                  </span>
                  <span className="leading-snug line-clamp-2"
                    style={{ color: 'var(--text)' }}>
                    {p.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function QuickLinks() {
  const links = [
    { label: 'GitHub Actions', href: 'https://github.com/57caine/57hustler/actions', icon: '⚙️' },
    { label: 'Threads', href: 'https://www.threads.net/@', icon: '🧵' },
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: '📸' },
    { label: 'Make.com', href: 'https://www.make.com/en/scenarios', icon: '🔗' },
  ];
  return (
    <Card>
      <SectionTitle>クイックリンク</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {links.map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </a>
        ))}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
        オペレーションダッシュボード
      </h1>

      <ScheduleSection />

      <QuickLinks />

      <h2 className="text-xs font-bold uppercase tracking-widest pt-2"
        style={{ color: 'var(--muted)' }}>
        最近の投稿
      </h2>
      <Suspense fallback={
        <div className="text-sm py-8 text-center" style={{ color: 'var(--muted)' }}>
          読み込み中...
        </div>
      }>
        <RecentPosts />
      </Suspense>
    </div>
  );
}
