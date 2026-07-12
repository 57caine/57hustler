const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

type AutoLevel = 'full-auto' | 'semi-auto' | 'manual';

interface Task {
  name: string;
  category: string;
  autoLevel: AutoLevel;
  frequency: string;
  currentTool: string;
  manualMinutes: number;
  notes: string;
  nextAction?: string;
}

interface AuditData {
  generatedAt: string;
  summary: { fullAuto: number; semiAuto: number; manual: number; totalTasks: number; dailyManualMinutes: number };
  tasks: { fullAuto: Task[]; semiAuto: Task[]; manual: Task[] };
  nextAutomations: { name: string; action?: string }[];
}

const AUTO_LABEL: Record<AutoLevel, { label: string; color: string; dot: string }> = {
  'full-auto': { label: '完全自動',  color: '#22c55e', dot: '#22c55e' },
  'semi-auto': { label: '半自動',    color: '#f59e0b', dot: '#f59e0b' },
  'manual':    { label: '手作業',    color: '#ef4444', dot: '#ef4444' },
};

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', ...style }}>
      {children}
    </div>
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>{children}</div>;
}

function TaskCard({ task }: { task: Task }) {
  const al = AUTO_LABEL[task.autoLevel];
  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg)', border: `1px solid ${al.color}30` }}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold">{task.name}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${al.color}20`, color: al.color }}>{al.label}</span>
      </div>
      <div className="text-[11px] mb-1" style={{ color: 'var(--muted)' }}>{task.frequency} · {task.currentTool}</div>
      <div className="text-[11px]" style={{ color: 'var(--text)' }}>{task.notes}</div>
      {task.nextAction && (
        <div className="text-[10px] mt-1.5 px-2 py-1 rounded" style={{ background: 'rgba(124,110,247,0.1)', color: 'var(--accent)' }}>
          → {task.nextAction}
        </div>
      )}
    </div>
  );
}

export default async function AuditPage() {
  const audit = await fetchJson<AuditData>('business-audit.json');

  if (!audit) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        <div className="text-4xl mb-3">🔍</div>
        <div className="text-sm">業務棚卸しデータがありません。</div>
        <div className="text-xs mt-2 font-mono">npx ts-node scripts/business-audit.ts</div>
      </div>
    );
  }

  const { summary, tasks, nextAutomations } = audit;

  return (
    <div className="space-y-5" style={{ color: 'var(--text)' }}>
      <div>
        <div className="text-lg font-bold mb-0.5">全業務棚卸し</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>自動化レベル分類</div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: '完全自動', count: summary.fullAuto, color: '#22c55e' },
          { label: '半自動',   count: summary.semiAuto, color: '#f59e0b' },
          { label: '手作業',   count: summary.manual,   color: '#ef4444' },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: 'center' }}>
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.count}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>手作業合計（日次）</div>
            <div className="text-xl font-bold font-mono" style={{ color: '#ef4444' }}>{summary.dailyManualMinutes}分</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>全業務数</div>
            <div className="text-xl font-bold font-mono">{summary.totalTasks}</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: `${(summary.fullAuto / summary.totalTasks) * 100}%`, background: '#22c55e' }} />
            <div style={{ width: `${(summary.semiAuto / summary.totalTasks) * 100}%`, background: '#f59e0b' }} />
            <div style={{ width: `${(summary.manual / summary.totalTasks) * 100}%`, background: '#ef4444' }} />
          </div>
        </div>
      </Card>

      {/* 完全自動 */}
      <div>
        <SLabel>完全自動稼働（{tasks.fullAuto.length}件）</SLabel>
        <div className="space-y-2">{tasks.fullAuto.map(t => <TaskCard key={t.name} task={t} />)}</div>
      </div>

      {/* 半自動 */}
      <div>
        <SLabel>半自動（{tasks.semiAuto.length}件）</SLabel>
        <div className="space-y-2">{tasks.semiAuto.map(t => <TaskCard key={t.name} task={t} />)}</div>
      </div>

      {/* 手作業 */}
      <div>
        <SLabel>手作業（{tasks.manual.length}件）</SLabel>
        <div className="space-y-2">{tasks.manual.map(t => <TaskCard key={t.name} task={t} />)}</div>
      </div>

      {/* 次の自動化候補 */}
      {nextAutomations.length > 0 && (
        <div>
          <SLabel>次の自動化候補</SLabel>
          <Card>
            {nextAutomations.map((n, i) => (
              <div key={i} className="py-1.5 text-sm" style={{ borderBottom: i < nextAutomations.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="font-medium">{n.name}</div>
                {n.action && <div className="text-[11px] mt-0.5" style={{ color: 'var(--accent)' }}>→ {n.action}</div>}
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
