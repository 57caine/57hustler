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

const SUBSCRIPTIONS = [
  { name: 'GitHub', plan: 'Free', cost: '¥0', status: '🟢' },
  { name: 'Vercel', plan: 'Hobby', cost: '¥0', status: '🟢' },
  { name: 'Make.com', plan: 'Free', cost: '¥0', status: '🟢' },
  { name: 'Claude Pro', plan: 'Pro', cost: '¥3,000', status: '🟢' },
  { name: 'note', plan: '無料', cost: '¥0', status: '🟢' },
];

export default function OfficePage() {
  const totalCost = SUBSCRIPTIONS.reduce((sum, s) => {
    const n = parseInt(s.cost.replace(/[¥,]/g, '') || '0');
    return sum + n;
  }, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>オフィス</h1>

      <Card>
        <SectionTitle>サブスクリプション</SectionTitle>
        <div className="space-y-2 mb-3">
          {SUBSCRIPTIONS.map(s => (
            <div key={s.name} className="flex items-center gap-3 text-sm">
              <span style={{ color: 'var(--muted)' }}>{s.status}</span>
              <span className="flex-1" style={{ color: 'var(--text)' }}>{s.name}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.plan}</span>
              <span className="tabular-nums font-mono text-xs w-16 text-right"
                style={{ color: s.cost === '¥0' ? 'var(--muted)' : 'var(--accent)' }}>
                {s.cost}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted)' }}>月額合計</span>
          <span className="font-bold tabular-nums" style={{ color: 'var(--text)' }}>
            ¥{totalCost.toLocaleString()}
          </span>
        </div>
      </Card>

      <Card>
        <SectionTitle>アフィリエイトプログラム</SectionTitle>
        <div className="space-y-2">
          {[
            { name: 'Amazon アソシエイト', id: '57plot-22', status: '🟡 仮審査中' },
            { name: 'A8.net', id: '登録済み', status: '🟢 稼働中' },
            { name: '楽天アフィリエイト', id: '5567171b.a80702dc', status: '🟢 稼働中' },
          ].map(a => (
            <div key={a.name} className="text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text)' }}>{a.name}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{a.status}</span>
              </div>
              <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted)' }}>{a.id}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
