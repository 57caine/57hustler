const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${RAW}/${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

interface Evaluation {
  month: string;
  generatedAt: string;
  metrics: {
    夜中のおじさん?: { posts: number; duplicateCount: number; duplicateRate: string };
    コラムbot?: { posts: number };
    価格監視bot?: { total: number; success: number; failure: number };
    九星気学bot?: { total: number; success: number; failure: number };
    GitHubActions全体?: { workflowCount: number; totalRuns: number; successRuns: number };
  };
  evaluation: string;
  workflowBreakdown: Record<string, { total: number; success: number; failure: number }>;
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

function SuccessRate({ total, success }: { total: number; success: number }) {
  const rate = total > 0 ? Math.round(success / total * 100) : 0;
  const color = rate >= 90 ? '#22c55e' : rate >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div className="text-xl font-bold font-mono" style={{ color }}>{rate}%</div>
      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{success}/{total} 成功</div>
    </div>
  );
}

export default async function EvaluationPage() {
  // 最新月の評価を取得
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const ym  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const ev  = await fetchJson<Evaluation>(`evaluations/${ym}.json`);

  if (!ev) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        <div className="text-4xl mb-3">👔</div>
        <div className="text-sm">今月の評価データがありません。</div>
        <div className="text-xs mt-2">毎月1日 08:45 JST に自動生成されます。</div>
        <div className="text-xs mt-1 font-mono">npx ts-node scripts/monthly-evaluation.ts</div>
      </div>
    );
  }

  const m = ev.metrics;

  return (
    <div className="space-y-5" style={{ color: 'var(--text)' }}>
      <div>
        <div className="text-lg font-bold mb-0.5">AI社員 人事評価</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{ev.month} / 毎月1日 08:45 JST 自動生成</div>
      </div>

      {/* 評価文 */}
      <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #0f0e1a, #1c1040)', border: '1px solid rgba(124,110,247,0.35)' }}>
        <div className="text-[10px] mb-2" style={{ color: 'var(--muted)' }}>月次評価サマリー</div>
        <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-line' }}>{ev.evaluation}</p>
      </div>

      {/* 社員別スコア */}
      <div>
        <SLabel>社員別実績</SLabel>
        <div className="space-y-2">

          {m.夜中のおじさん && (
            <Card>
              <div className="flex items-start justify-between mb-2">
                <div><div className="text-sm font-semibold">🌙 夜中のおじさん</div><div className="text-[10px]" style={{ color: 'var(--muted)' }}>Threadsライター</div></div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono" style={{ color: '#22c55e' }}>{m.夜中のおじさん.posts}</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>投稿数</div>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span style={{ color: 'var(--muted)' }}>重複: <span style={{ color: m.夜中のおじさん.duplicateCount > 0 ? '#f59e0b' : '#22c55e' }}>{m.夜中のおじさん.duplicateCount}件（{m.夜中のおじさん.duplicateRate}）</span></span>
              </div>
            </Card>
          )}

          {m.コラムbot && (
            <Card>
              <div className="flex items-start justify-between">
                <div><div className="text-sm font-semibold">✍️ コラムbot</div><div className="text-[10px]" style={{ color: 'var(--muted)' }}>考察・コラム生成</div></div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono" style={{ color: '#22c55e' }}>{m.コラムbot.posts}</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>投稿数</div>
                </div>
              </div>
            </Card>
          )}

          {m.価格監視bot && (
            <Card>
              <div className="flex items-start justify-between">
                <div><div className="text-sm font-semibold">🤖 価格監視bot</div><div className="text-[10px]" style={{ color: 'var(--muted)' }}>lens-navi価格更新</div></div>
                <SuccessRate total={m.価格監視bot.total} success={m.価格監視bot.success} />
              </div>
            </Card>
          )}

          {m.九星気学bot && (
            <Card>
              <div className="flex items-start justify-between">
                <div><div className="text-sm font-semibold">🔯 九星気学bot</div><div className="text-[10px]" style={{ color: 'var(--muted)' }}>日次運勢まとめ</div></div>
                <SuccessRate total={m.九星気学bot.total} success={m.九星気学bot.success} />
              </div>
            </Card>
          )}

          {m.GitHubActions全体 && (
            <Card>
              <div className="flex items-start justify-between mb-2">
                <div><div className="text-sm font-semibold">⚙️ GitHub Actions全体</div><div className="text-[10px]" style={{ color: 'var(--muted)' }}>{m.GitHubActions全体.workflowCount}ワークフロー稼働中</div></div>
                <SuccessRate total={m.GitHubActions全体.totalRuns} success={m.GitHubActions全体.successRuns} />
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ワークフロー内訳 */}
      {Object.keys(ev.workflowBreakdown).length > 0 && (
        <div>
          <SLabel>ワークフロー内訳</SLabel>
          <Card>
            <div className="space-y-2">
              {Object.entries(ev.workflowBreakdown).map(([name, stats]) => {
                const rate = stats.total > 0 ? Math.round(stats.success / stats.total * 100) : 0;
                const color = rate >= 90 ? '#22c55e' : rate >= 70 ? '#f59e0b' : '#ef4444';
                return (
                  <div key={name} className="flex items-center justify-between py-1.5 text-xs"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="truncate mr-2" style={{ color: 'var(--text)' }}>{name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span style={{ color: 'var(--muted)' }}>{stats.total}回</span>
                      <span className="font-mono font-bold" style={{ color }}>{rate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
