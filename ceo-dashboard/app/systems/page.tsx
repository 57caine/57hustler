const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

type Status = 'active' | 'standby' | 'planned' | 'development';

interface System {
  name: string;
  scriptFile: string | null;
  workflowFile: string | null;
  role: string;
  aiStaff: string;
  schedule: string;
  status: Status;
}

interface SystemIndex {
  lastUpdated: string;
  summary: { total: number; active: number; standby: number; planned: number };
  systems: System[];
}

const STATUS: Record<Status, { label: string; color: string; dot: string }> = {
  active:      { label: '稼働中',  color: '#22c55e', dot: '#22c55e' },
  standby:     { label: '待機中',  color: '#f59e0b', dot: '#f59e0b' },
  planned:     { label: '計画中',  color: '#6b6b8a', dot: '#6b6b8a' },
  development: { label: '開発中',  color: 'var(--accent)', dot: 'var(--accent)' },
};

function SLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>{children}</div>;
}

function SystemCard({ sys }: { sys: System }) {
  const st = STATUS[sys.status];
  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg)', border: `1px solid ${st.color}30` }}>
      <div className="flex items-start gap-2 mb-1.5">
        <span className="w-2 h-2 rounded-full shrink-0 mt-1"
          style={{ background: st.dot, boxShadow: sys.status === 'active' ? `0 0 6px ${st.dot}` : 'none' }} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">{sys.name}</div>
          <div className="text-[10px]" style={{ color: st.color }}>{st.label}</div>
        </div>
      </div>
      <div className="text-[11px] mb-1" style={{ color: 'var(--text)' }}>{sys.role}</div>
      <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--muted)' }}>
        <span>担当: {sys.aiStaff}</span>
        <span>{sys.schedule}</span>
      </div>
      {(sys.scriptFile || sys.workflowFile) && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {sys.scriptFile && (
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'rgba(124,110,247,0.1)', color: 'var(--accent)' }}>
              {sys.scriptFile.split('/').pop()}
            </span>
          )}
          {sys.workflowFile && (
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
              {sys.workflowFile.split('/').pop()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default async function SystemsPage() {
  const index = await fetchJson<SystemIndex>('system-index.json');

  if (!index) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        <div className="text-4xl mb-3">⚙️</div>
        <div className="text-sm">仕組み名鑑がありません。</div>
        <div className="text-xs mt-2 font-mono">npx ts-node scripts/generate-index.ts</div>
      </div>
    );
  }

  const { summary, systems } = index;
  const active  = systems.filter(s => s.status === 'active');
  const standby = systems.filter(s => s.status === 'standby');
  const planned = systems.filter(s => s.status === 'planned' || s.status === 'development');

  return (
    <div className="space-y-5" style={{ color: 'var(--text)' }}>
      <div>
        <div className="text-lg font-bold mb-0.5">仕組み名鑑</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          最終更新: {new Date(index.lastUpdated).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: '総数',   v: summary.total,   c: 'var(--text)'  },
          { label: '稼働中', v: summary.active,  c: '#22c55e'       },
          { label: '待機中', v: summary.standby, c: '#f59e0b'       },
          { label: '計画中', v: summary.planned, c: 'var(--muted)'  },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <SLabel>稼働中（{active.length}件）</SLabel>
        <div className="space-y-2">{active.map(s => <SystemCard key={s.name} sys={s} />)}</div>
      </div>

      {standby.length > 0 && (
        <div>
          <SLabel>待機中（{standby.length}件）</SLabel>
          <div className="space-y-2">{standby.map(s => <SystemCard key={s.name} sys={s} />)}</div>
        </div>
      )}

      {planned.length > 0 && (
        <div>
          <SLabel>計画中（{planned.length}件）</SLabel>
          <div className="space-y-2">{planned.map(s => <SystemCard key={s.name} sys={s} />)}</div>
        </div>
      )}
    </div>
  );
}
