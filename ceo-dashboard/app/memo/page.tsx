import MemoForm from './MemoForm';
import GenerateButton from './GenerateButton';
import DeleteButton from './DeleteButton';

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

const CAT: Record<Category, { label: string; color: string; bg: string; border: string }> = {
  yonaka:   { label: '🌙 夜中のおじさん', color: '#7c6ef7', bg: 'rgba(124,110,247,0.1)',  border: 'rgba(124,110,247,0.3)' },
  henkutsu: { label: '🌍 henkutsu',       color: '#05ce78', bg: 'rgba(5,206,120,0.1)',    border: 'rgba(5,206,120,0.3)' },
  ceo:      { label: '💡 CEO',             color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)' },
  other:    { label: '📝 その他',           color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)' },
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

      {/* List header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {memos.length > 0 ? `${memos.length}件のメモ` : '保存済みメモ'}
        </div>
        {memos.length > 0 && (
          <div style={{ display: 'flex', gap: 5 }}>
            {(Object.entries(CAT) as [Category, typeof CAT[Category]][]).map(([key, c]) => {
              const count = memos.filter(m => m.category === key).length;
              if (count === 0) return null;
              return (
                <span key={key} style={{
                  fontSize: 10, color: c.color, background: c.bg,
                  border: `1px solid ${c.border}`, borderRadius: 6,
                  padding: '2px 7px', fontWeight: 600,
                }}>
                  {key === 'yonaka' ? '🌙' : key === 'henkutsu' ? '🌍' : key === 'ceo' ? '💡' : '📝'} {count}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* List */}
      {memos.length === 0 ? (
        <div style={{
          textAlign: 'center', color: 'var(--muted)', fontSize: 13,
          paddingTop: 40, paddingBottom: 40,
          border: '1px dashed var(--border)', borderRadius: 12,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
          まだメモがありません<br />
          <span style={{ fontSize: 11 }}>上のフォームから最初のメモを追加してください</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {memos.map(m => {
            const c = CAT[m.category] ?? CAT.other;
            return (
              <div key={m.id} className="rounded-xl p-4"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${c.color}`,
                }}>

                {/* Category + time + delete */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 600,
                    background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                  }}>
                    {c.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                      {reltime(m.createdAt)}
                    </span>
                    <DeleteButton id={m.id} />
                  </div>
                </div>

                {/* Text */}
                <p style={{ fontSize: 14, lineHeight: 1.7, margin: '0 0 10px', whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
                  {m.text}
                </p>

                {/* Generate button — all categories */}
                <GenerateButton text={m.text} category={m.category} />
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
