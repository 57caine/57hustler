import ApproveButton from './ApproveButton';

const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

type Source = 'kickstarter' | 'producthunt' | 'reddit';

interface HenkutsuCandidate {
  id: string;
  title: string;
  source: Source;
  url: string;
  description: string;
  descriptionJa?: string;
  postDraft?: string;
  category: string;
  price?: string;
  score: number;
  reason: string;
  addedAt: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
}

interface CandidatesFile {
  lastUpdated: string;
  candidates: HenkutsuCandidate[];
}

interface ApprovedFile {
  lastUpdated: string;
  approved: { id: string; title: string }[];
}

const SOURCE: Record<Source, { label: string; color: string; bg: string }> = {
  kickstarter: { label: 'Kickstarter', color: '#05ce78', bg: 'rgba(5,206,120,0.1)'  },
  producthunt: { label: 'Product Hunt', color: '#da552f', bg: 'rgba(218,85,47,0.1)' },
  reddit:      { label: 'Reddit',       color: '#ff6314', bg: 'rgba(255,99,20,0.1)' },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 8 ? '#22c55e' : score >= 6 ? '#f59e0b' : 'var(--accent)';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="h-full rounded-full"
          style={{ width: `${score * 10}%`, background: color, transition: 'width 0.3s' }} />
      </div>
      <span className="text-[10px] font-mono font-bold shrink-0" style={{ color }}>{score}/10</span>
    </div>
  );
}

function CandidateCard({ c, approvedIds }: { c: HenkutsuCandidate; approvedIds: Set<string> }) {
  const src        = SOURCE[c.source];
  const isApproved = approvedIds.has(c.id);

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <a href={c.url} target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold leading-snug hover:underline block"
              style={{ color: 'var(--text)' }}>
              {c.title}
            </a>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            {c.price && (
              <span className="text-[10px] font-mono font-bold" style={{ color: '#f59e0b' }}>
                {c.price}
              </span>
            )}
            <span className="text-[9px] px-1.5 py-0.5 rounded font-medium"
              style={{ background: src.bg, color: src.color }}>{src.label}</span>
          </div>
        </div>

        {/* 日本語説明 */}
        {c.descriptionJa ? (
          <p className="text-[11px] mb-2 leading-relaxed" style={{ color: 'var(--text)' }}>
            {c.descriptionJa}
          </p>
        ) : c.description ? (
          <p className="text-[11px] mb-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
            {c.description.slice(0, 140)}{c.description.length > 140 ? '…' : ''}
          </p>
        ) : null}

        {/* スコアバー */}
        <div className="mb-2">
          <div className="text-[9px] mb-1" style={{ color: 'var(--muted)' }}>フィルタースコア</div>
          <ScoreBar score={c.score} />
        </div>

        {/* カテゴリ */}
        {c.category && (
          <span className="inline-block text-[9px] px-1.5 py-0.5 rounded mb-2"
            style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
            {c.category}
          </span>
        )}
      </div>

      {/* 投稿文案 */}
      {c.postDraft && (
        <div className="mx-4 mb-3 rounded-lg px-3 py-2.5"
          style={{ background: 'rgba(124,110,247,0.06)', border: '1px solid rgba(124,110,247,0.18)' }}>
          <div className="text-[9px] font-bold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            henkutsu 投稿文案
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text)', whiteSpace: 'pre-line' }}>
            {c.postDraft}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <div className="text-[9px]" style={{ color: 'var(--muted)' }}>
          {new Date(c.addedAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'short', day: 'numeric' })}
          ｜<a href={c.url} target="_blank" rel="noopener noreferrer"
            className="hover:underline ml-1" style={{ color: 'var(--accent)' }}>
            元記事 →
          </a>
        </div>
        {isApproved ? (
          <span className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
            ✓ 承認済み
          </span>
        ) : (
          <ApproveButton candidate={{
            id: c.id, title: c.title, descriptionJa: c.descriptionJa,
            postDraft: c.postDraft, url: c.url, source: c.source, score: c.score, price: c.price,
          }} />
        )}
      </div>
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

export default async function HenkutsuPage() {
  const [data, approvedData] = await Promise.all([
    fetchJson<CandidatesFile>('henkutsu-candidates.json'),
    fetchJson<ApprovedFile>('henkutsu-approved.json'),
  ]);

  if (!data || data.candidates.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        <div className="text-4xl mb-3">🌍</div>
        <div className="text-sm">候補リストはまだありません。</div>
        <div className="text-xs mt-2">月・水・金 09:00 JST に自動収集されます。</div>
        <div className="text-xs mt-1.5 font-mono px-4 py-2 rounded inline-block"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          npx ts-node scripts/henkutsu-research.ts
        </div>
      </div>
    );
  }

  const approvedIds = new Set((approvedData?.approved ?? []).map(a => a.id));

  // 今週の候補（直近7日）
  const weekAgo   = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek  = data.candidates.filter(c => new Date(c.addedAt).getTime() > weekAgo);

  // スコア順ソート（却下除く）
  const sorted = [...data.candidates]
    .filter(c => c.status !== 'rejected')
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-5" style={{ color: 'var(--text)' }}>

      {/* ヘッダー */}
      <div>
        <div className="text-lg font-bold mb-0.5">henkutsu 海外商品候補</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          月・水・金 09:00 JST 自動収集
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--accent)' }}>
            {thisWeek.length}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>今週の候補</div>
        </div>
        <div className="rounded-xl p-3 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl font-bold font-mono" style={{ color: '#22c55e' }}>
            {approvedIds.size}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>承認済み</div>
        </div>
        <div className="rounded-xl p-3 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
            {data.candidates.length}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>累計候補</div>
        </div>
      </div>

      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
        最終更新: {new Date(data.lastUpdated).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      </div>

      {/* 候補リスト */}
      <div>
        <SLabel>スコア順（{sorted.length}件）</SLabel>
        <div className="space-y-3">
          {sorted.map(c => (
            <CandidateCard key={c.id} c={c} approvedIds={approvedIds} />
          ))}
        </div>
      </div>

      <div className="text-[10px] text-center pb-4" style={{ color: 'var(--muted)' }}>
        承認するとGitHubの <span className="font-mono">data/henkutsu-approved.json</span> に自動保存されます。
        <br />VERCELに <span className="font-mono">GITHUB_TOKEN</span> 環境変数が必要です。
      </div>
    </div>
  );
}
