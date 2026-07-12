const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

type CandidateStatus = 'new' | 'reviewed' | 'approved' | 'rejected';
type Source = 'kickstarter' | 'producthunt' | 'reddit';

interface HenkutsuCandidate {
  id: string;
  title: string;
  source: Source;
  url: string;
  description: string;
  category: string;
  price?: string;
  score: number;
  reason: string;
  addedAt: string;
  status: CandidateStatus;
}

interface CandidatesFile {
  lastUpdated: string;
  candidates: HenkutsuCandidate[];
}

const SOURCE: Record<Source, { label: string; color: string; bg: string }> = {
  kickstarter: { label: 'Kickstarter', color: '#05ce78', bg: 'rgba(5,206,120,0.12)' },
  producthunt: { label: 'Product Hunt', color: '#da552f', bg: 'rgba(218,85,47,0.12)' },
  reddit:      { label: 'Reddit',      color: '#ff4500', bg: 'rgba(255,69,0,0.12)'   },
};

const STAT: Record<CandidateStatus, { label: string; color: string }> = {
  new:      { label: '新着',   color: 'var(--accent)' },
  reviewed: { label: '確認済', color: '#f59e0b'       },
  approved: { label: '採用',   color: '#22c55e'       },
  rejected: { label: '却下',   color: '#6b6b8a'       },
};

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
      {children}
    </div>
  );
}

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full"
          style={{ background: i < score ? '#7c6ef7' : 'var(--border)' }} />
      ))}
    </div>
  );
}

function CandidateCard({ c }: { c: HenkutsuCandidate }) {
  const src  = SOURCE[c.source];
  const stat = STAT[c.status];
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <a href={c.url} target="_blank" rel="noopener noreferrer"
            className="text-sm font-semibold leading-tight hover:underline"
            style={{ color: 'var(--text)' }}>
            {c.title}
          </a>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-medium"
          style={{ background: `${stat.color}20`, color: stat.color }}>
          {stat.label}
        </span>
      </div>

      <p className="text-[11px] mb-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
        {c.description.slice(0, 120)}{c.description.length > 120 ? '…' : ''}
      </p>

      <div className="text-[10px] mb-2 px-2 py-1.5 rounded"
        style={{ background: 'rgba(124,110,247,0.08)', color: 'var(--accent)', borderLeft: '2px solid var(--accent)' }}>
        {c.reason}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ background: src.bg, color: src.color }}>{src.label}</span>
          {c.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              {c.category}
            </span>
          )}
          {c.price && (
            <span className="text-[10px] font-mono" style={{ color: '#f59e0b' }}>{c.price}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ScoreDots score={c.score} />
          <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent)' }}>{c.score}/10</span>
        </div>
      </div>

      <div className="mt-2 text-[9px]" style={{ color: 'var(--muted)' }}>
        {new Date(c.addedAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      </div>
    </div>
  );
}

export default async function HenkutsuPage() {
  const data = await fetchJson<CandidatesFile>('henkutsu-candidates.json');

  if (!data || data.candidates.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        <div className="text-4xl mb-3">🌍</div>
        <div className="text-sm">候補リストはまだありません。</div>
        <div className="text-xs mt-2">月・水・金 09:00 JST に自動収集されます。</div>
        <div className="text-xs mt-1 font-mono">npx ts-node scripts/henkutsu-research.ts</div>
      </div>
    );
  }

  const { candidates } = data;
  const newItems      = candidates.filter(c => c.status === 'new');
  const approvedItems = candidates.filter(c => c.status === 'approved');
  const reviewedItems = candidates.filter(c => c.status === 'reviewed');
  const rejectedItems = candidates.filter(c => c.status === 'rejected');

  const topByScore = [...newItems].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="space-y-5" style={{ color: 'var(--text)' }}>
      <div>
        <div className="text-lg font-bold mb-0.5">henkutsu 海外商品候補</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          最終更新: {new Date(data.lastUpdated).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
          ｜月・水・金 09:00 JST 自動収集
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: '総数',    v: candidates.length,  c: 'var(--text)'     },
          { label: '新着',    v: newItems.length,     c: 'var(--accent)'   },
          { label: '採用',    v: approvedItems.length, c: '#22c55e'        },
          { label: '確認待', v: reviewedItems.length, c: '#f59e0b'         },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top 5 スコア */}
      {topByScore.length > 0 && (
        <div>
          <SLabel>今週のおすすめTop {topByScore.length}</SLabel>
          <div className="space-y-3">
            {topByScore.map(c => <CandidateCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {/* 採用済み */}
      {approvedItems.length > 0 && (
        <div>
          <SLabel>採用済み（{approvedItems.length}件）</SLabel>
          <div className="space-y-3">
            {approvedItems.map(c => <CandidateCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {/* 残りの新着（Top5除く） */}
      {newItems.length > 5 && (
        <div>
          <SLabel>新着一覧（{newItems.length - 5}件）</SLabel>
          <div className="space-y-3">
            {[...newItems]
              .sort((a, b) => b.score - a.score)
              .slice(5)
              .map(c => <CandidateCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {rejectedItems.length > 0 && (
        <div>
          <SLabel style={{ opacity: 0.5 }}>却下済み（{rejectedItems.length}件）</SLabel>
          <div className="space-y-2 opacity-40">
            {rejectedItems.slice(0, 5).map(c => (
              <div key={c.id} className="rounded-lg px-3 py-2 text-xs"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                  className="truncate block" style={{ color: 'var(--muted)' }}>{c.title}</a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[10px] text-center pb-4" style={{ color: 'var(--muted)' }}>
        ステータス変更は <span className="font-mono">data/henkutsu-candidates.json</span> を直接編集
      </div>
    </div>
  );
}
