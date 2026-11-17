'use client';
import { useState, type FormEvent } from 'react';

type Item = { role: 'user' | 'assistant'; text: string; sources?: { label: string; url: string }[] };
const prompts = ['今日の状況は？', '売上は？', '本人タスクは？', 'ジャービスは何ができる？'];

export default function JarvisChat() {
  const [items, setItems] = useState<Item[]>([{
    role: 'assistant',
    text: 'JARVISへようこそ。事業の最新状況を確認できます。\n\nこの画面は実データを照会する初期版です。自由会話のAIモデルや開発作業の直接起動はまだ接続していません。既存の自走タスクは別に稼働します。',
  }]);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  async function send(message: string) {
    const normalized = message.trim();
    if (busy || !normalized || normalized.length > 500) return;
    setItems(current => [...current, { role: 'user', text: normalized }]);
    setValue('');
    setBusy(true);
    try {
      const response = await fetch('/api/jarvis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: normalized }), cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : '取得に失敗しました');
      setItems(current => [...current, { role: 'assistant', text: data.message, sources: Array.isArray(data.sources) ? data.sources : [] }]);
    } catch (error) {
      setItems(current => [...current, { role: 'assistant', text: `確認できませんでした：${error instanceof Error ? error.message : '通信に失敗しました'}。実績を0として表示しません。` }]);
    } finally {
      setBusy(false);
    }
  }
  function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void send(value); }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 space-y-1" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <p className="text-sm font-bold">🤖 JARVIS｜会話で事業を見渡す</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>認証済み・読み取り専用MVP・追加モデルAPI課金なし</p>
      </div>
      <div className="space-y-3" aria-live="polite" aria-relevant="additions text">
        {items.map((item, index) => (
          <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[92%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-7" style={{
              background: item.role === 'user' ? 'var(--accent-dim)' : 'var(--surface)',
              border: '1px solid var(--border)',
            }}>
              <div>{item.text}</div>
              {item.sources && item.sources.length > 0 && <div className="mt-3 flex flex-wrap gap-3">
                {item.sources.map(source => (
                  <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: '#b5aaff' }}>{source.label}</a>
                ))}
              </div>}
            </div>
          </div>
        ))}
        {busy && <p className="text-xs" style={{ color: 'var(--muted)' }} role="status">実データを照合しています…</p>}
      </div>
      <div className="flex flex-wrap gap-2" aria-label="質問の例">
        {prompts.map(p => (
          <button key={p} type="button" onClick={() => void send(p)} disabled={busy} className="rounded-full border px-3 py-2 text-xs disabled:opacity-50" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>{p}</button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <label htmlFor="jarvis-message" className="sr-only">JARVISへのメッセージ</label>
        <input id="jarvis-message" value={value} onChange={event => setValue(event.target.value)} maxLength={500} placeholder="状況や売上を聞いてみる" className="min-w-0 flex-1 rounded-xl border px-3 py-3 text-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} />
        <button type="submit" disabled={busy || !value.trim()} className="rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-50" style={{ background: 'var(--accent)' }}>送信</button>
      </form>
      <p className="text-xs leading-6" style={{ color: 'var(--muted)' }}>この画面の「GO」は、PRのマージ、投稿、決済などを実行しません。実際の自走運用は既存のCEO予約タスク・GitHub Actionsによるものです。確認されていない操作を成功と表示しません。</p>
    </div>
  );
}
