type Status = 'active' | 'standby' | 'planned' | 'development';

interface AiStaff {
  emoji: string;
  name: string;
  role: string;
  dept: string;
  freq: string;
  status: Status;
  script?: string;
  workflow?: string;
}

const STATUS: Record<Status, { label: string; color: string; glow: boolean }> = {
  active:      { label: '稼働中', color: '#22c55e', glow: true  },
  standby:     { label: '待機中', color: '#f59e0b', glow: false },
  planned:     { label: '計画中', color: '#6b6b8a', glow: false },
  development: { label: '開発中', color: '#7c6ef7', glow: false },
};

const STAFF: AiStaff[] = [
  // ── Content 部門 ────────────────────────────────────────────────
  {
    emoji: '🌙', name: '夜中のおじさん',    dept: 'Content',
    role: 'Threads ライター・コア投稿担当',    freq: '6本/日',
    status: 'active', script: 'yonaka-generate-post.ts', workflow: 'yonaka-post.yml',
  },
  {
    emoji: '✍️', name: 'コラムbot',          dept: 'Content',
    role: '考察・コラム記事生成',              freq: '3本/日',
    status: 'active', script: 'generate-column.ts', workflow: 'column-post.yml',
  },
  {
    emoji: '📸', name: 'Instagrambot',        dept: 'Content',
    role: 'Instagram スワイプ投稿管理',        freq: '月3回',
    status: 'standby',
  },
  {
    emoji: '🎥', name: 'YouTube台本bot',      dept: 'Content',
    role: 'ショート動画台本・ネタ生成',        freq: '週2本',
    status: 'planned',
  },
  {
    emoji: '🐦', name: 'Xbot',               dept: 'Content',
    role: 'X (Twitter) 投稿・拡散',           freq: '3本/日',
    status: 'planned',
  },
  {
    emoji: '📧', name: 'メールニュースbot',   dept: 'Content',
    role: 'メルマガ自動化・読者育成',          freq: '週1本',
    status: 'planned',
  },
  {
    emoji: '🔄', name: 'リパーパスbot',       dept: 'Content',
    role: 'Threads/Instagram/X/note マルチ展開', freq: 'CLIオンデマンド',
    status: 'development', script: 'content-repurpose.ts',
  },
  {
    emoji: '✅', name: 'コンテンツチェックbot', dept: 'Content',
    role: 'ルール違反・重複チェック',          freq: 'CLIオンデマンド',
    status: 'development', script: 'content-check.ts',
  },

  // ── Operations 部門 ───────────────────────────────────────────
  {
    emoji: '🤖', name: '価格監視bot',         dept: 'Operations',
    role: 'lens-navi 各ショップ価格スクレイピング', freq: '1日3回',
    status: 'active', script: 'update-prices.ts', workflow: 'update-prices.yml',
  },
  {
    emoji: '🔍', name: 'henkutsuリサーチbot', dept: 'Operations',
    role: '海外商品リサーチ・日本未上陸発掘',   freq: '月水金',
    status: 'development', script: 'henkutsu-research.ts', workflow: 'henkutsu-research.yml',
  },
  {
    emoji: '🛒', name: 'eBayリスティングbot', dept: 'Operations',
    role: '無在庫出品・商品登録自動化',         freq: '週5本',
    status: 'planned',
  },
  {
    emoji: '💹', name: 'Amazon価格比較bot',   dept: 'Operations',
    role: '価格競争力分析・価格差レポート',     freq: '週1回',
    status: 'planned',
  },

  // ── Intelligence 部門 ─────────────────────────────────────────
  {
    emoji: '🔯', name: '九星気学bot',          dept: 'Intelligence',
    role: '日次運勢まとめ・Threads投稿',        freq: '1本/日',
    status: 'active', workflow: 'kuse-daily.yml',
  },
  {
    emoji: '📊', name: '朝の司令書bot',        dept: 'Intelligence',
    role: 'タスク分類・朝のブリーフィング生成', freq: '毎日07:00',
    status: 'active', script: 'morning-brief.ts', workflow: 'morning-brief.yml',
  },
  {
    emoji: '📈', name: '週次レポートbot',       dept: 'Intelligence',
    role: '週次実績サマリー・KPI集計',          freq: '毎週月曜',
    status: 'active', script: 'weekly-report.ts', workflow: 'weekly-report.yml',
  },
  {
    emoji: '🔎', name: 'SNS分析bot',           dept: 'Intelligence',
    role: 'エンゲージメント・インサイト分析',   freq: '週1回',
    status: 'planned',
  },
  {
    emoji: '🌐', name: 'SEOリサーチbot',       dept: 'Intelligence',
    role: 'lens-navi SEO最適化・競合分析',      freq: '月2回',
    status: 'planned',
  },

  // ── HR / Admin 部門 ──────────────────────────────────────────
  {
    emoji: '👔', name: '月次評価bot',           dept: 'HR/Admin',
    role: 'AI社員パフォーマンス人事評価',       freq: '毎月1日',
    status: 'active', script: 'monthly-evaluation.ts', workflow: 'monthly-evaluation.yml',
  },
  {
    emoji: '📝', name: 'マニュアル監査bot',     dept: 'HR/Admin',
    role: 'ドキュメント品質・マニュアル整備管理', freq: '毎月1日',
    status: 'active', script: 'manual-audit.ts', workflow: 'manual-audit.yml',
  },
  {
    emoji: '🧬', name: 'フィードバック蒸留bot', dept: 'HR/Admin',
    role: '投稿フィードバックからルール抽出・更新', freq: '毎月1日・push時',
    status: 'active', script: 'distill-feedback.ts', workflow: 'distill-feedback.yml',
  },
  {
    emoji: '📋', name: 'システム名鑑bot',       dept: 'HR/Admin',
    role: '自動化仕組み一覧の生成・更新',       freq: 'push時',
    status: 'active', script: 'generate-index.ts', workflow: 'update-index.yml',
  },
  {
    emoji: '🤝', name: '顧客対応bot',           dept: 'HR/Admin',
    role: 'お問い合わせ自動返信・FAQ生成',       freq: '随時',
    status: 'planned',
  },
];

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
      {children}
    </div>
  );
}

function StaffCard({ s }: { s: AiStaff }) {
  const st = STATUS[s.status];
  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg)', border: `1px solid ${st.color}30` }}>
      <div className="flex items-start gap-2 mb-1.5">
        <span className="text-xl shrink-0">{s.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight truncate">{s.name}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                background: st.color,
                boxShadow: st.glow ? `0 0 5px ${st.color}` : 'none',
              }} />
            <span className="text-[10px]" style={{ color: st.color }}>{st.label}</span>
          </div>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded shrink-0 font-mono"
          style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          {s.dept}
        </span>
      </div>

      <div className="text-[11px] mb-1.5 leading-snug" style={{ color: 'var(--text)' }}>{s.role}</div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{s.freq}</span>
      </div>

      {(s.script || s.workflow) && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {s.script && (
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'rgba(124,110,247,0.1)', color: 'var(--accent)' }}>
              {s.script}
            </span>
          )}
          {s.workflow && (
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
              {s.workflow}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const DEPTS = ['Content', 'Operations', 'Intelligence', 'HR/Admin'] as const;
const DEPT_EMOJI: Record<string, string> = {
  Content:      '✍️',
  Operations:   '⚙️',
  Intelligence: '🧠',
  'HR/Admin':   '👔',
};

export default function OfficePage() {
  const totalActive = STAFF.filter(s => s.status === 'active').length;
  const totalDev    = STAFF.filter(s => s.status === 'development').length;
  const totalPlan   = STAFF.filter(s => s.status === 'planned' || s.status === 'standby').length;

  return (
    <div className="space-y-5" style={{ color: 'var(--text)' }}>
      <div>
        <div className="text-lg font-bold mb-0.5">AI社員オフィス</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>自動化社員 全{STAFF.length}名</div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: '稼働中',  v: totalActive, c: '#22c55e' },
          { label: '開発中',  v: totalDev,    c: 'var(--accent)' },
          { label: '計画中',  v: totalPlan,   c: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-2xl font-bold font-mono" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 部門別 */}
      {DEPTS.map(dept => {
        const members = STAFF.filter(s => s.dept === dept);
        return (
          <div key={dept}>
            <SLabel>{DEPT_EMOJI[dept]} {dept} 部門（{members.length}名）</SLabel>
            <div className="space-y-2">
              {members.map(s => <StaffCard key={s.name} s={s} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
