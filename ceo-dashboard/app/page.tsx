import Link from 'next/link';
import DashboardClock from './DashboardClock';

const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

// ── Static data ──────────────────────────────────────────────────────────────

const KPIS = [
  { icon: '🎯', label: '年間CF目標（7年後）', value: '572万円/年', note: '確定',  color: '#a855f7' },
  { icon: '📈', label: 'NISA積立',           value: '月3万円',    note: '稼働中', color: '#22c55e' },
  { icon: '✍️', label: 'noteマガジン',        value: '第7回公開',  note: '更新中', color: '#22c55e' },
  { icon: '🧵', label: 'Threads自動投稿',     value: '1日6回',     note: '稼働中', color: '#22c55e' },
  { icon: '💰', label: '年収目標',            value: '1,000万円',  note: '進行中', color: '#f59e0b' },
];

type Signal = 'green' | 'yellow' | 'red';

const BUSINESSES: { signal: Signal; name: string; desc: string; detail: string }[] = [
  { signal: 'green',  name: 'lens-navi.jp',   desc: '稼働中・アフィリ立上げ期',  detail: '価格自動更新・比較表稼働中'   },
  { signal: 'green',  name: '夜中のおじさん', desc: 'Threads 6本/日・note更新', detail: '第7回公開済み・拡大中'        },
  { signal: 'yellow', name: 'henkutsu',       desc: 'Chrome拡張稼働',           detail: 'Amazon申請保留中'            },
  { signal: 'yellow', name: 'Instagram',      desc: 'リセット完了',             detail: 'コンテンツ準備中'             },
  { signal: 'green',  name: 'NISA',           desc: '月3万・オルカン積立中',    detail: '自動積立稼働中'               },
  { signal: 'yellow', name: 'RC物件',         desc: '7年後引継ぎ予定',          detail: '準備中'                      },
  { signal: 'red',    name: 'eBay無在庫',     desc: '2〜3年後予定',            detail: '未着手'                      },
];

const SIG: Record<Signal, { bg: string; border: string; dot: string }> = {
  green:  { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.3)',  dot: '#22c55e' },
  yellow: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', dot: '#f59e0b' },
  red:    { bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.2)',  dot: '#ef4444' },
};

const STAFF = [
  { emoji: '🌙', name: '夜中のおじさん', role: 'Threadsライター',   freq: '6本/日', active: true  },
  { emoji: '🤖', name: '価格監視bot',   role: 'lens-navi価格更新', freq: '3回/日', active: true  },
  { emoji: '🔯', name: '九星気学bot',   role: '日次運勢まとめ',    freq: '1本/日', active: true  },
  { emoji: '✍️', name: 'コラムbot',     role: '考察・コラム生成',  freq: '3本/日', active: true  },
  { emoji: '📸', name: 'Instagrambot',  role: 'コンテンツ管理',    freq: '月3回',  active: false },
];

const SCHEDULE = [
  { time: '04:00', label: '🌙 夜中のおじさん', ch: 'Threads'   },
  { time: '07:00', label: '🔯 九星気学まとめ', ch: 'Threads'   },
  { time: '08:00', label: '🌙 夜中のおじさん', ch: 'Threads'   },
  { time: '12:00', label: '📝 コラム・夜中',   ch: 'Threads'   },
  { time: '16:00', label: '🌙 夜中のおじさん', ch: 'Threads'   },
  { time: '19:00', label: '📸 swipe投稿',       ch: 'Instagram' },
  { time: '20:00', label: '🌙 夜中のおじさん', ch: 'Threads'   },
  { time: '21:00', label: '✨ 一文考察',        ch: 'Threads'   },
  { time: '22:00', label: '🌙 夜中のおじさん', ch: 'Threads'   },
  { time: '23:00', label: '📝 コラム（夜）',    ch: 'Threads'   },
];

const MILESTONES = [
  { year: 2026, pct:   0, label: '基盤構築',     desc: 'Threads・lens-navi', current: true,  goal: false },
  { year: 2027, pct:  14, label: '副収入10万/月', desc: 'アフィリ・SNS収益化', current: false, goal: false },
  { year: 2028, pct:  29, label: 'FX本格化',      desc: 'FX学習・投資拡大',   current: false, goal: false },
  { year: 2029, pct:  43, label: '副収入30万/月', desc: '複数収益柱確立',      current: false, goal: false },
  { year: 2030, pct:  57, label: 'eBay開始',      desc: '無在庫販売スタート',  current: false, goal: false },
  { year: 2031, pct:  71, label: 'RC引継ぎ',      desc: '不動産準備',          current: false, goal: false },
  { year: 2032, pct:  86, label: 'FIRE準備',      desc: '資産形成最終段階',    current: false, goal: false },
  { year: 2033, pct: 100, label: 'CF 572万達成',  desc: '7年ゴール 🎯',       current: false, goal: true  },
];

const TASKS = [
  { label: 'note第8回作成・公開',               hi: true  },
  { label: 'Instagram投稿開始（週2本〜）',       hi: true  },
  { label: 'Amazon Associates申請（売上3件後）', hi: false },
];

const LINKS = [
  { label: 'GitHub Actions', href: 'https://github.com/57caine/57hustler/actions', icon: '⚙️', ext: true  },
  { label: 'Threads管理',    href: 'https://www.threads.net/',                     icon: '🧵', ext: true  },
  { label: 'lens-navi',     href: 'https://57hustler.vercel.app',                 icon: '👁️', ext: true  },
  { label: 'FXツール',      href: '/fx',                                           icon: '📈', ext: false },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', ...style }}>
      {children}
    </div>
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
      {children}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface MorningBrief {
  date: string;
  generatedAt: string;
  postsToday: number;
  actionsStatus: { total: number; success: number; failed: number };
  urgent: string[];
  defer: string[];
  confirm: string[];
  summary: string;
}

export default async function Dashboard() {
  const [yonaka, column, brief] = await Promise.all([
    fetchJson<{ posts: { date: string }[] }>('yonaka-post-history.json'),
    fetchJson<{ posts: { date: string }[] }>('column-history.json'),
    fetchJson<MorningBrief>('morning-brief.json'),
  ]);

  const todayJST   = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const todayPosts = (yonaka?.posts?.filter(p => p.date === todayJST).length ?? 0);
  const totalPosts = (yonaka?.posts?.length ?? 0) + (column?.posts?.length ?? 0);

  // Roadmap progress: 2026-01-01 → 2032-12-31 = 7 years
  const START_MS    = new Date('2026-01-01').getTime();
  const END_MS      = new Date('2032-12-31').getTime();
  const progressPct = Math.min(100, Math.max(0, (Date.now() - START_MS) / (END_MS - START_MS) * 100));

  // Schedule: find next upcoming job (server-side JST)
  const jstNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const nowMin = jstNow.getHours() * 60 + jstNow.getMinutes();
  const nextIdx = (() => {
    const i = SCHEDULE.findIndex(s => {
      const [h, m] = s.time.split(':').map(Number);
      return h * 60 + m > nowMin;
    });
    return i === -1 ? 0 : i;
  })();

  return (
    <div className="space-y-6">

      {/* ① 朝の報告書 */}
      <div className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, #0f0e1a 0%, #1c1040 100%)', border: '1px solid rgba(124,110,247,0.35)' }}>
        <div className="flex items-start justify-between gap-3 mb-5">
          <DashboardClock />
          <div className="shrink-0 text-right">
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(124,110,247,0.55)' }}>CEO Report</div>
            <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>57hustler</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: '1px solid rgba(124,110,247,0.2)' }}>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono" style={{ color: '#22c55e' }}>{todayPosts}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>今日の投稿</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--accent)' }}>{totalPosts}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>累計投稿数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono" style={{ color: '#f59e0b' }}>7</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>note公開数</div>
          </div>
        </div>
      </div>

      {/* ① 朝の司令書 */}
      {brief && (
        <div>
          <SLabel>朝の司令書</SLabel>
          <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {brief.summary && (
              <p className="text-sm mb-3 leading-relaxed">{brief.summary}</p>
            )}
            {(brief.urgent?.length ?? 0) > 0 && (
              <div className="mb-2">
                <div className="text-[10px] font-bold mb-1" style={{ color: '#ef4444' }}>🔴 今日やること</div>
                {brief.urgent?.map((t, i) => (
                  <div key={i} className="text-xs py-1 flex items-start gap-2">
                    <span style={{ color: '#ef4444' }}>→</span><span>{t}</span>
                  </div>
                )) ?? null}
              </div>
            )}
            {(brief.confirm?.length ?? 0) > 0 && (
              <div className="mb-2">
                <div className="text-[10px] font-bold mb-1" style={{ color: '#f59e0b' }}>🟡 要確認</div>
                {brief.confirm?.map((t, i) => (
                  <div key={i} className="text-xs py-1 flex items-start gap-2">
                    <span style={{ color: '#f59e0b' }}>→</span><span>{t}</span>
                  </div>
                )) ?? null}
              </div>
            )}
            {(brief.defer?.length ?? 0) > 0 && (
              <div>
                <div className="text-[10px] font-bold mb-1" style={{ color: 'var(--muted)' }}>⬜ 後回し</div>
                {brief.defer?.map((t, i) => (
                  <div key={i} className="text-xs py-1 flex items-start gap-2">
                    <span style={{ color: 'var(--muted)' }}>→</span><span style={{ color: 'var(--muted)' }}>{t}</span>
                  </div>
                )) ?? null}
              </div>
            )}
            <div className="mt-3 text-[10px] flex items-center justify-between" style={{ color: 'var(--muted)' }}>
              <span>{brief.date} 司令書</span>
              <span>Actions {brief.actionsStatus?.success ?? 0}/{brief.actionsStatus?.total ?? 0} 成功</span>
            </div>
          </div>
        </div>
      )}

      {/* ② 会社KPI */}
      <div>
        <SLabel>会社 KPI</SLabel>
        <div className="grid grid-cols-2 gap-2">
          {KPIS.map(k => (
            <div key={k.label} className="rounded-xl p-3"
              style={{ background: 'var(--surface)', border: `1px solid ${k.color}40` }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-base">{k.icon}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: `${k.color}20`, color: k.color }}>{k.note}</span>
              </div>
              <div className="text-lg font-bold font-mono leading-tight mb-0.5" style={{ color: k.color }}>{k.value}</div>
              <div className="text-[10px] leading-snug" style={{ color: 'var(--muted)' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ③ 事業ステータスボード */}
      <div>
        <SLabel>事業ステータスボード</SLabel>
        <div className="grid grid-cols-2 gap-2">
          {BUSINESSES.map(b => {
            const s = SIG[b.signal];
            return (
              <div key={b.name} className="rounded-xl p-3"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                    style={{
                      background: s.dot,
                      boxShadow: b.signal === 'green' ? `0 0 8px ${s.dot}` : 'none',
                      animationPlayState: b.signal === 'green' ? 'running' : 'paused',
                    }} />
                  <span className="text-sm font-semibold truncate">{b.name}</span>
                </div>
                <div className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text)' }}>{b.desc}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{b.detail}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ④ AI社員オフィス */}
      <div>
        <SLabel>AI社員オフィス</SLabel>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {STAFF.map(s => (
            <div key={s.name} className="shrink-0 rounded-xl p-3"
              style={{ width: 130, background: 'var(--surface)',
                border: `1px solid ${s.active ? 'rgba(34,197,94,0.35)' : 'var(--border)'}` }}>
              <div className="text-2xl mb-1.5">{s.emoji}</div>
              <div className="text-xs font-semibold leading-tight mb-0.5 truncate">{s.name}</div>
              <div className="text-[10px] mb-2 leading-tight" style={{ color: 'var(--muted)' }}>{s.role}</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full"
                  style={{ background: s.active ? '#22c55e' : '#f59e0b' }} />
                <span className="text-[10px] font-mono"
                  style={{ color: s.active ? '#22c55e' : '#f59e0b' }}>{s.freq}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 本日のスケジュール */}
      <div>
        <SLabel>本日のスケジュール</SLabel>
        <Card>
          <div className="space-y-0.5">
            {SCHEDULE.map((item, i) => {
              const [h, m] = item.time.split(':').map(Number);
              const jobMin = h * 60 + m;
              const isNext = i === nextIdx;
              const isPast = jobMin < nowMin && !isNext;
              return (
                <div key={item.time}
                  className="flex items-center gap-3 px-2.5 py-2 rounded-lg"
                  style={{ background: isNext ? 'var(--accent-dim)' : 'transparent', opacity: isPast ? 0.35 : 1 }}>
                  {isNext
                    ? <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--accent)' }} />
                    : <span className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: isPast ? 'var(--muted)' : 'transparent', border: isPast ? 'none' : '1px solid var(--border)' }} />
                  }
                  <span className="w-12 font-mono text-xs shrink-0"
                    style={{ color: isNext ? 'var(--accent)' : 'var(--muted)' }}>{item.time}</span>
                  <span className="flex-1 text-sm">{item.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      background: item.ch === 'Threads' ? 'rgba(99,102,241,0.15)' : 'rgba(34,197,94,0.1)',
                      color: item.ch === 'Threads' ? '#818cf8' : '#4ade80',
                    }}>
                    {item.ch}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ⑤ 7年ロードマップ */}
      <div>
        <SLabel>7年ロードマップ｜2026 → 2033</SLabel>
        <Card>
          {/* Progress bar with milestone dots */}
          <div className="relative mb-10 mt-3">
            {/* Track */}
            <div className="h-2 rounded-full" style={{ background: 'var(--bg)' }}>
              <div className="h-2 rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, var(--accent) 0%, #22c55e 100%)',
                  boxShadow: '0 0 10px rgba(124,110,247,0.5)',
                }} />
            </div>
            {/* Dots + year labels */}
            {MILESTONES.map(ms => {
              const passed = ms.pct <= progressPct;
              const dotColor = ms.goal ? '#a855f7' : 'var(--accent)';
              return (
                <div key={ms.year} className="absolute"
                  style={{ left: `${ms.pct}%`, top: -5, transform: 'translateX(-50%)' }}>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{
                      background: passed ? dotColor : 'var(--bg)',
                      borderColor: passed ? dotColor : 'var(--border)',
                      boxShadow: ms.current ? '0 0 10px var(--accent)' : 'none',
                    }}>
                    {passed && <span className="w-2 h-2 rounded-full" style={{ background: '#fff' }} />}
                  </div>
                  <div className="absolute text-center"
                    style={{ top: 22, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                    <div className="text-[9px] font-mono font-bold"
                      style={{ color: ms.current ? 'var(--accent)' : ms.goal ? '#a855f7' : 'var(--muted)' }}>
                      {ms.year}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key milestone cards */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {MILESTONES.filter((_, i) => [0, 1, 4, 7].includes(i)).map(ms => (
              <div key={ms.year} className="rounded-lg px-3 py-2"
                style={{
                  background: 'var(--bg)',
                  border: `1px solid ${ms.current ? 'rgba(124,110,247,0.4)' : ms.goal ? 'rgba(168,85,247,0.4)' : 'var(--border)'}`,
                }}>
                <div className="text-[10px] font-mono mb-0.5"
                  style={{ color: ms.current ? 'var(--accent)' : ms.goal ? '#a855f7' : 'var(--muted)' }}>
                  {ms.year}{ms.current ? ' ← 現在' : ''}
                </div>
                <div className="text-xs font-semibold mb-0.5">{ms.label}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{ms.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center text-[11px]" style={{ color: 'var(--muted)' }}>
            現在地{' '}
            <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>{progressPct.toFixed(1)}%</span>
            {' '}｜ 残り{' '}
            <span className="font-mono font-bold" style={{ color: '#a855f7' }}>{(100 - progressPct).toFixed(1)}%</span>
          </div>
        </Card>
      </div>

      {/* ⑥ 優先タスク */}
      <div>
        <SLabel>今週の優先タスク</SLabel>
        <Card>
          <div className="space-y-3">
            {TASKS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 text-sm">{t.hi ? '🔴' : '🟡'}</span>
                <div>
                  <div className="text-sm">{t.label}</div>
                  <div className="text-[10px] mt-0.5"
                    style={{ color: t.hi ? '#ef4444' : '#f59e0b' }}>
                    {t.hi ? '高優先度' : '中優先度'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* クイックリンク */}
      <div>
        <SLabel>クイックリンク</SLabel>
        <div className="grid grid-cols-2 gap-2 pb-4">
          {LINKS.map(l =>
            l.ext ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                <span>{l.icon}</span><span>{l.label}</span>
              </a>
            ) : (
              <Link key={l.label} href={l.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                <span>{l.icon}</span><span>{l.label}</span>
              </Link>
            )
          )}
        </div>
      </div>

    </div>
  );
}
