import { Suspense } from 'react';

const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/claude/bold-brahmagupta-uc9Mu/data';

interface ColumnPost  { date: string; text: string; }
interface YonakaPost  { date: string; text: string; }
interface IgPost      { date: string; type: string; postId: string; images: string[]; }

interface MorningBrief {
  generatedAt: string;
  date: string;
  stats: {
    threadsPostsTotal: number;
    threadsPostsToday: number;
    lensNaviColumns: number;
    lensNaviColumnsThisWeek: number;
    henkutsuCandidates: number;
    henkutsuApproved: number;
    noteArticles: number;
    noteLatestTitle: string;
    noteLastUpdated: string;
  };
  priorities: string[];
}

interface NoteStats {
  totalArticles: number;
  latestTitle: string;
  latestUrl: string;
  latestPublishedAt: string;
  articles: { title: string; publishedAt: string }[];
}

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

const BUSINESSES = [
  {
    name: 'lens-navi.jp',
    icon: '👁',
    status: '🟢',
    statusLabel: '稼働中',
    detail: '目の総合サイトにリニューアル済み・コラム自動生成稼働中',
    link: 'https://lens-navi.jp',
  },
  {
    name: '夜中のおじさん',
    icon: '🌙',
    status: '🟢',
    statusLabel: '稼働中',
    detail: 'Threads1日6回稼働中・noteマガジン第7回公開済み',
    link: 'https://note.com/westin_lab',
  },
  {
    name: 'henkutsu',
    icon: '📦',
    status: '🟡',
    statusLabel: '準備中',
    detail: '海外商品リサーチ自動化稼働中・Amazon提携申請中',
    link: null,
  },
  {
    name: 'Instagram westin_lab',
    icon: '📸',
    status: '🟡',
    statusLabel: '準備中',
    detail: 'リセット完了・投稿準備中',
    link: 'https://www.instagram.com/westin_lab/',
  },
  {
    name: 'NISA',
    icon: '📈',
    status: '🟢',
    statusLabel: '稼働中',
    detail: 'オルカン月3万積立稼働中',
    link: null,
  },
  {
    name: 'RC物件',
    icon: '🏢',
    status: '🔵',
    statusLabel: '長期',
    detail: '7年後引継ぎ予定',
    link: null,
  },
];

const PAGES = [
  { path: '/',         label: 'ダッシュボード',         note: 'スケジュール・ビジネス状況・朝の司令書' },
  { path: '/yonaka',   label: '夜中のおじさん',         note: 'Threads投稿履歴・予約管理' },
  { path: '/henkutsu', label: 'henkutsu',               note: '候補商品リスト・承認・却下' },
  { path: '/fx',       label: 'FX・投資',               note: 'NISA積立状況・ポートフォリオ' },
  { path: '/memo',     label: 'メモ',                   note: 'アイデア・タスクメモ' },
  { path: '/office',   label: 'オフィス',               note: 'バックオフィス・経費管理' },
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

function BusinessStatus() {
  return (
    <Card>
      <SectionTitle>ビジネス状況</SectionTitle>
      <div className="space-y-2">
        {BUSINESSES.map(b => (
          <div key={b.name} className="flex items-start gap-3 text-sm py-1">
            <span className="text-base leading-none mt-0.5">{b.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {b.link ? (
                  <a href={b.link} target="_blank" rel="noopener noreferrer"
                    className="font-medium hover:underline"
                    style={{ color: 'var(--text)' }}>
                    {b.name}
                  </a>
                ) : (
                  <span className="font-medium" style={{ color: 'var(--text)' }}>{b.name}</span>
                )}
                <span className="text-xs px-1.5 py-0.5 rounded"
                  style={{ background: 'var(--bg)', color: 'var(--muted)' }}>
                  {b.status} {b.statusLabel}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{b.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

async function MorningBriefSection() {
  const brief = await fetchJson<MorningBrief>('morning-brief.json');
  if (!brief) return null;

  const { stats, priorities } = brief;

  return (
    <Card>
      <SectionTitle>朝の司令書 · {brief.date}</SectionTitle>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Threads総投稿', value: stats.threadsPostsTotal, sub: `今日 ${stats.threadsPostsToday}件` },
          { label: 'lens-naviコラム', value: stats.lensNaviColumns, sub: `今週 +${stats.lensNaviColumnsThisWeek}` },
          { label: 'henkutsu候補', value: stats.henkutsuCandidates, sub: `承認済 ${stats.henkutsuApproved}` },
          { label: 'noteマガジン', value: stats.noteArticles, sub: stats.noteLastUpdated },
        ].map(item => (
          <div key={item.label} className="rounded-lg p-3 text-center"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
              {item.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>{item.label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{item.sub}</div>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>今日の優先タスク</p>
        <ol className="space-y-1">
          {priorities.map((p, i) => (
            <li key={i} className="flex gap-2 text-xs leading-relaxed">
              <span style={{ color: 'var(--accent)' }}>{i + 1}.</span>
              <span style={{ color: 'var(--text)' }}>{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

async function NoteStatsSection() {
  const note = await fetchJson<NoteStats>('note-stats.json');
  if (!note) return null;

  return (
    <Card>
      <SectionTitle>noteマガジン · westin_lab</SectionTitle>
      <div className="mb-3">
        <a href={note.latestUrl} target="_blank" rel="noopener noreferrer"
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--accent)' }}>
          {note.latestTitle}
        </a>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {note.latestPublishedAt} · 全{note.totalArticles}記事
        </p>
      </div>
      <div className="space-y-1">
        {note.articles.slice(0, 5).map((a, i) => (
          <div key={i} className="flex gap-3 text-xs">
            <span className="shrink-0 tabular-nums" style={{ color: 'var(--muted)' }}>{a.publishedAt}</span>
            <span className="truncate" style={{ color: 'var(--text)' }}>{a.title}</span>
          </div>
        ))}
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
    { label: 'Threads', href: 'https://www.threads.net/@westin_lab', icon: '🧵' },
    { label: 'Instagram', href: 'https://www.instagram.com/westin_lab/', icon: '📸' },
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

function PageIndex() {
  return (
    <Card>
      <SectionTitle>実装済みページ</SectionTitle>
      <div className="space-y-2">
        {PAGES.map(p => (
          <div key={p.path} className="flex gap-3 text-sm">
            <span className="font-mono text-xs w-24 shrink-0 mt-0.5"
              style={{ color: 'var(--accent)' }}>
              {p.path}
            </span>
            <div>
              <div className="font-medium" style={{ color: 'var(--text)' }}>{p.label}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{p.note}</div>
            </div>
          </div>
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

      <Suspense fallback={<LoadingSkeleton />}>
        <MorningBriefSection />
      </Suspense>

      <BusinessStatus />

      <ScheduleSection />

      <Suspense fallback={<LoadingSkeleton />}>
        <NoteStatsSection />
      </Suspense>

      <QuickLinks />

      <PageIndex />

      <h2 className="text-xs font-bold uppercase tracking-widest pt-2"
        style={{ color: 'var(--muted)' }}>
        最近の投稿
      </h2>
      <Suspense fallback={<LoadingSkeleton />}>
        <RecentPosts />
      </Suspense>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="rounded-xl p-4 animate-pulse"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', height: 80 }}>
    </div>
  );
}
