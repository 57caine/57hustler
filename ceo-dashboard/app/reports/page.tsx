const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  posts: { yonaka: number; column: number; total: number };
  actions: { total: number; success: number };
  completedTasks: string[];
  nextWeekTasks: string[];
  summary: string;
}

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

export default async function ReportsPage() {
  // 直近4週のレポートを試みる
  const today = new Date();
  const reports: WeeklyReport[] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 7);
    const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
    const r = await fetchJson<WeeklyReport>(`weekly-report/${dateStr}.json`);
    if (r) reports.push(r);
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        <div className="text-4xl mb-3">📊</div>
        <div className="text-sm">週次レポートはまだありません。</div>
        <div className="text-xs mt-2">毎週月曜 07:00 JST に自動生成されます。</div>
      </div>
    );
  }

  const latest = reports[0];

  return (
    <div className="space-y-5" style={{ color: 'var(--text)' }}>
      <div>
        <div className="text-lg font-bold mb-0.5">週次レポート</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>毎週月曜 07:00 JST 自動生成</div>
      </div>

      {/* 最新レポート */}
      <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #0f0e1a, #1c1040)', border: '1px solid rgba(124,110,247,0.35)' }}>
        <div className="text-[10px] mb-1" style={{ color: 'var(--muted)' }}>最新 {latest.weekStart} 〜 {latest.weekEnd}</div>
        <p className="text-sm leading-relaxed">{latest.summary}</p>
      </div>

      {/* 今週の数字 */}
      <div>
        <SLabel>今週の実績</SLabel>
        <div className="grid grid-cols-3 gap-2">
          <Card>
            <div className="text-2xl font-bold font-mono" style={{ color: '#22c55e' }}>{latest.posts.total}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>総投稿数</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>夜中{latest.posts.yonaka} / コラム{latest.posts.column}</div>
          </Card>
          <Card>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--accent)' }}>{latest.actions.total}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Actions実行</div>
            <div className="text-[10px] mt-0.5" style={{ color: '#22c55e' }}>成功 {latest.actions.success}</div>
          </Card>
          <Card>
            <div className="text-2xl font-bold font-mono" style={{ color: '#f59e0b' }}>{latest.completedTasks.length}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>完了タスク</div>
          </Card>
        </div>
      </div>

      {/* 完了タスク */}
      {latest.completedTasks.length > 0 && (
        <div>
          <SLabel>今週の完了タスク</SLabel>
          <Card>
            {latest.completedTasks.map((t, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 text-sm"
                style={{ borderBottom: i < latest.completedTasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: '#22c55e' }}>✓</span><span>{t}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* 来週のタスク */}
      {latest.nextWeekTasks.length > 0 && (
        <div>
          <SLabel>来週の重点タスク</SLabel>
          <Card>
            {latest.nextWeekTasks.map((t, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 text-sm"
                style={{ borderBottom: i < latest.nextWeekTasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: '#f59e0b' }}>→</span><span>{t}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* 過去レポート一覧 */}
      {reports.length > 1 && (
        <div>
          <SLabel>過去のレポート</SLabel>
          <div className="space-y-2">
            {reports.slice(1).map(r => (
              <Card key={r.weekStart}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{r.weekStart} 〜 {r.weekEnd}</div>
                    <div className="text-xs mt-1 line-clamp-2">{r.summary}</div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-lg font-bold font-mono" style={{ color: '#22c55e' }}>{r.posts.total}</div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)' }}>投稿</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
