'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  async function handleDelete() {
    if (!window.confirm('このメモを削除しますか？')) return;
    setState('loading');
    try {
      const res = await fetch('/api/memo/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setState('done');
        setTimeout(() => router.refresh(), 600);
      } else {
        setState('idle');
        alert('削除に失敗しました');
      }
    } catch {
      setState('idle');
      alert('削除に失敗しました');
    }
  }

  if (state === 'done') {
    return (
      <span style={{ fontSize: 10, color: '#ef4444' }}>削除しました</span>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={state === 'loading'}
      title="削除"
      style={{
        fontSize: 11, padding: '4px 8px', borderRadius: 8, cursor: state === 'loading' ? 'not-allowed' : 'pointer',
        background: 'transparent', color: 'var(--muted)',
        border: '1px solid var(--border)',
        opacity: state === 'loading' ? 0.5 : 1,
        transition: 'all 0.1s',
      }}
      onMouseOver={e => { if (state === 'idle') { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)'; } }}
      onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
    >
      {state === 'loading' ? '…' : '🗑'}
    </button>
  );
}
