'use client';
import { useState } from 'react';

const CATEGORIES = [
  { key: 'ミックス',     label: '🌀 ミックス' },
  { key: '日常の気づき', label: '🌿 日常' },
  { key: '日本神事',    label: '⛩️ 神事' },
  { key: '量子',       label: '🔬 量子' },
  { key: '宇宙',       label: '🌌 宇宙' },
  { key: 'オカルト',    label: '🌙 オカルト' },
  { key: '都市伝説',    label: '🕵️ 都市伝説' },
];

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-4 ${className}`}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      {children}
    </div>
  );
}

export default function YonakaPage() {
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState('ミックス');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<number | null>(null);

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hint: hint.trim() || undefined, category }),
      });
      const data = await res.json() as { text?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? 'Unknown error');
      setHistory(prev => [data.text!, ...prev].slice(0, 10));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
        🌙 夜中のおじさん・ネタ生成
      </h1>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-xs mb-2 block" style={{ color: 'var(--muted)' }}>
              カテゴリ
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: category === c.key ? 'var(--accent)' : 'var(--bg)',
                    color: category === c.key ? '#fff' : 'var(--muted)',
                    border: `1px solid ${category === c.key ? 'var(--accent)' : 'var(--border)'}`,
                  }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>
              テーマヒント（省略可）
            </label>
            <input
              type="text"
              value={hint}
              onChange={e => setHint(e.target.value)}
              placeholder="例：七夕、梅雨、鳥居..."
              onKeyDown={e => e.key === 'Enter' && !loading && generate()}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity"
            style={{
              background: loading ? 'var(--accent-dim)' : 'var(--accent)',
              color: '#fff',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
            {loading ? '生成中...' : '✨ 生成する'}
          </button>
          {error && (
            <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>
          )}
        </div>
      </Card>

      {history.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--muted)' }}>
            生成履歴
          </h2>
          {history.map((text, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                  {text}
                </p>
                <button
                  onClick={() => copy(text, i)}
                  className="shrink-0 text-xs px-2 py-1 rounded-md transition-colors"
                  style={{
                    background: copied === i ? '#22c55e22' : 'var(--bg)',
                    border: '1px solid var(--border)',
                    color: copied === i ? 'var(--green)' : 'var(--muted)',
                  }}>
                  {copied === i ? '✓' : 'コピー'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
