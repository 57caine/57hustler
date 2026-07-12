'use client';
import { useState } from 'react';

export default function GenerateButton({ text, category }: { text: string; category: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);

  async function generate() {
    setState('loading');
    try {
      const res = await fetch('/api/memo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, category }),
      });
      if (res.ok) {
        const { draft: d } = await res.json() as { draft: string };
        setDraft(d);
        setState('done');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const label = category === 'yonaka' ? '✍ 夜中に変換'
    : category === 'henkutsu' ? '✍ henkutsuに変換'
    : '✍ 投稿文生成';

  return (
    <div>
      {state !== 'done' && (
        <button onClick={generate} disabled={state === 'loading'}
          style={{
            fontSize: 11, padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
            background: 'rgba(124,110,247,0.1)', color: 'var(--accent)',
            border: '1px solid rgba(124,110,247,0.3)',
            opacity: state === 'loading' ? 0.6 : 1,
          }}>
          {state === 'loading' ? '生成中…' : state === 'error' ? 'エラー（再試行）' : label}
        </button>
      )}

      {state === 'done' && draft && (
        <div style={{
          marginTop: 8, background: 'rgba(124,110,247,0.06)',
          border: '1px solid rgba(124,110,247,0.2)', borderRadius: 10,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            生成された投稿文
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-line', margin: 0 }}>
            {draft}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={copy}
              style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                background: copied ? 'rgba(34,197,94,0.15)' : 'var(--surface)',
                color: copied ? '#22c55e' : 'var(--muted)',
                border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
              }}>
              {copied ? '✓ コピー済み' : 'コピー'}
            </button>
            <button onClick={() => setState('idle')}
              style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)',
              }}>
              再生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
