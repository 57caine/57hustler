const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/claude/bold-brahmagupta-uc9Mu/data';

interface HenkutsuData {
  updatedAt: string;
  candidates: { id: string; name: string; asin?: string; price?: number; addedAt: string }[];
  approved: { id: string; name: string; approvedAt: string }[];
  rejected: { id: string; name: string; rejectedAt: string; reason?: string }[];
  stats: { total: number; approved: number; rejected: number; pending: number };
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
      {children}
    </h2>
  );
}

export default async function HenkutsuPage() {
  const data = await fetchJson<HenkutsuData>('henkutsu-candidates.json');

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>henkutsu 商品管理</h1>

      {data && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '候補', value: data.stats.pending, color: '#818cf8' },
            { label: '承認', value: data.stats.approved, color: '#4ade80' },
            { label: '却下', value: data.stats.rejected, color: '#f87171' },
            { label: '合計', value: data.stats.total, color: 'var(--muted)' },
          ].map(s => (
            <Card key={s.label}>
              <div className="text-2xl font-bold tabular-nums text-center" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-center mt-1" style={{ color: 'var(--muted)' }}>{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <SectionTitle>候補商品</SectionTitle>
        {!data || data.candidates.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>候補商品なし。henkutsu-research.yml が実行されると自動追加されます。</p>
        ) : (
          <div className="space-y-2">
            {data.candidates.map(c => (
              <div key={c.id} className="flex items-center gap-3 text-sm">
                <div className="flex-1">
                  <div style={{ color: 'var(--text)' }}>{c.name}</div>
                  {c.asin && <div className="text-xs font-mono" style={{ color: 'var(--muted)' }}>ASIN: {c.asin}</div>}
                </div>
                {c.price && (
                  <span className="text-xs tabular-nums" style={{ color: 'var(--accent)' }}>
                    ¥{c.price.toLocaleString()}
                  </span>
                )}
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{c.addedAt}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>承認済み</SectionTitle>
        {!data || data.approved.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>承認済み商品なし</p>
        ) : (
          <div className="space-y-1">
            {data.approved.map(a => (
              <div key={a.id} className="flex justify-between text-sm">
                <span style={{ color: 'var(--text)' }}>{a.name}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{a.approvedAt}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
