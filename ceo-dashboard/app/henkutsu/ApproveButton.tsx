'use client';
import { useState } from 'react';

interface Candidate {
  id: string;
  title: string;
  descriptionJa?: string;
  postDraft?: string;
  url: string;
  source: string;
  score: number;
  price?: string;
}

export default function ApproveButton({ candidate }: { candidate: Candidate }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleApprove() {
    setState('loading');
    try {
      const res = await fetch('/api/henkutsu/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <span className="text-xs px-3 py-1.5 rounded-lg font-medium"
        style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
        ✓ 承認済み
      </span>
    );
  }

  if (state === 'error') {
    return (
      <span className="text-xs px-3 py-1.5 rounded-lg font-medium"
        style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
        エラー（GITHUB_TOKEN確認）
      </span>
    );
  }

  return (
    <button onClick={handleApprove} disabled={state === 'loading'}
      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity"
      style={{
        background: 'rgba(124,110,247,0.15)',
        color: 'var(--accent)',
        border: '1px solid rgba(124,110,247,0.4)',
        opacity: state === 'loading' ? 0.6 : 1,
        cursor: state === 'loading' ? 'not-allowed' : 'pointer',
      }}>
      {state === 'loading' ? '...' : '✓ 承認する'}
    </button>
  );
}
