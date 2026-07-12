import MemoForm from './MemoForm';
import GenerateButton from './GenerateButton';

const RAW = 'https://raw.githubusercontent.com/57caine/57hustler/main/data';

type Category = 'yonaka' | 'henkutsu' | 'ceo' | 'other';

interface Memo {
  id: string;
  text: string;
  category: Category;
  createdAt: string;
}

interface MemosFile {
  lastUpdated: string;
  memos: Memo[];
}

async function fetchMemos(): Promise<MemosFile | null> {
  try {
    const res = await fetch(`${RAW}/memos.json`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return res.json() as Promise<MemosFile>;
  } catch { return null; }
}

const CAT: Record<Category, { label: string; color: string; bg: string }> = {
  yonaka:   { label: '🌙 夜中のおじさん', color: '#7c6ef7', bg: 'rgba(124,110,247,0.1)' },
  henkutsu: { label: '🌍 henkutsu',       color: '#05ce78', bg: 'rgba(5,206,120,0.1)'   },
  ceo:      { label: '💡 CEO',             color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  other:    { label: '📝 その他',           color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

function reltime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'たった今';
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

export default async function MemoPage() {
  const data = await fetchMemos();
  const memos = data?.memos ?? [];

  return (
    <div style={{ color: 'var(--text)', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>気づきメモ</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          引っかかりをその場で記録 — 逃がさない
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl p-4 mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <MemoForm />
      </div>

      {/* List */}
      {memos.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, paddingTop: 32 }}>
          まだメモがありません
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
            {memos.length}件のメモ
          </div>
          {memos.map(m => {
            const c = CAT[m.category] ?? CAT.other;
            const showGenerate = m.category === 'yonaka' || m.category === 'henkutsu';
            return (
              <div key={m.id} className="rounded-xl p-4"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {/* Category + time */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                    background: c.bg, color: c.color,
                  }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                    {reltime(m.createdAt)}
                  </span>
                </div>

                {/* Text */}
                <p style={{ fontSize: 14, lineHeight: 1.7, margin: '0 0 10px', whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
                  {m.text}
                </p>

                {/* Generate button */}
                {showGenerate && (
                  <GenerateButton text={m.text} category={m.category} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', marginTop: 24, paddingBottom: 16 }}>
        保存先: <span style={{ fontFamily: 'monospace' }}>data/memos.json</span>
        {' — '}GITHUB_TOKEN が必要
      </div>
    </div>
  );
}
