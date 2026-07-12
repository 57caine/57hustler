'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Category = 'yonaka' | 'henkutsu' | 'ceo' | 'other';

const CATS: { key: Category; label: string; color: string }[] = [
  { key: 'yonaka',   label: '🌙 夜中のおじさん', color: '#7c6ef7' },
  { key: 'henkutsu', label: '🌍 henkutsu',       color: '#05ce78' },
  { key: 'ceo',      label: '💡 CEO',             color: '#f59e0b' },
  { key: 'other',    label: '📝 その他',           color: '#94a3b8' },
];

export default function MemoForm() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognition | null>(null);

  function toggleVoice() {
    const SpeechRec = (window as unknown as Record<string, unknown>).SpeechRecognition as typeof SpeechRecognition
      || (window as unknown as Record<string, unknown>).webkitSpeechRecognition as typeof SpeechRecognition;
    if (!SpeechRec) { alert('このブラウザは音声入力に対応していません'); return; }

    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SpeechRec();
    rec.lang = 'ja-JP';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setText(prev => (prev ? prev + '　' : '') + t);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec as unknown as SpeechRecognition;
    setListening(true);
  }

  async function handleSave() {
    if (!text.trim() || state === 'loading') return;
    setState('loading');
    try {
      const res = await fetch('/api/memo/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), category }),
      });
      if (res.ok) {
        setText('');
        setState('done');
        setTimeout(() => {
          setState('idle');
          router.refresh();
        }, 1200);
      } else {
        setState('error');
        setTimeout(() => setState('idle'), 2000);
      }
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  }

  const cat = CATS.find(c => c.key === category)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Category pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {CATS.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: `1.5px solid ${category === c.key ? c.color : 'var(--border)'}`,
              background: category === c.key ? `${c.color}22` : 'transparent',
              color: category === c.key ? c.color : 'var(--muted)',
              cursor: 'pointer', transition: 'all 0.12s',
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave(); }}
          placeholder="引っかかりをメモ…"
          rows={4}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'var(--bg)', border: `1px solid ${listening ? '#ef4444' : 'var(--border)'}`,
            borderRadius: 12, padding: '12px 52px 12px 14px',
            color: 'var(--text)', fontSize: 16, resize: 'vertical',
            lineHeight: 1.6, outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.15s',
          }}
        />
        <button onClick={toggleVoice} title={listening ? '停止' : '音声入力'}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: listening ? 'rgba(239,68,68,0.2)' : 'var(--surface)',
            border: `1px solid ${listening ? '#ef4444' : 'var(--border)'}`,
            borderRadius: 8, width: 36, height: 36,
            cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
          {listening ? '⏹' : '🎤'}
        </button>
      </div>

      {listening && (
        <div style={{ fontSize: 11, color: '#ef4444', textAlign: 'center' }}>
          録音中… 話してください
        </div>
      )}

      {/* Save button */}
      <button onClick={handleSave}
        disabled={!text.trim() || state === 'loading'}
        style={{
          background: state === 'done' ? 'rgba(34,197,94,0.15)'
            : state === 'error' ? 'rgba(239,68,68,0.15)'
            : cat.color,
          color: state === 'done' ? '#22c55e' : state === 'error' ? '#ef4444' : '#fff',
          border: 'none', borderRadius: 12, padding: '15px',
          fontSize: 15, fontWeight: 700,
          cursor: !text.trim() || state === 'loading' ? 'not-allowed' : 'pointer',
          opacity: !text.trim() ? 0.45 : 1,
          transition: 'all 0.15s', width: '100%',
        }}>
        {state === 'loading' ? '保存中…'
          : state === 'done' ? '✓ 保存しました'
          : state === 'error' ? 'エラー（GITHUB_TOKEN確認）'
          : '保存する'}
      </button>

      <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center' }}>
        ⌘ + Enter でも保存
      </div>
    </div>
  );
}
