'use client';

import { useEffect, useState } from 'react';

const AI_TEAM_URL = 'https://raw.githubusercontent.com/57caine/57hustler/main/data/ai-team.json';

interface Member {
  id: string;
  name: string;
  role: string;
  status: string;
  currentTask: string;
  nextTask: string;
  completedTasks: string[];
  pendingDecision: string;
  updatedAt: string | null;
}

const ICON: Record<string, string> = { chatgpt: '💬', claude: '🟣', gemini: '✨' };

function EditableField({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try { await onSave(draft); setEditing(false); } catch { alert('保存に失敗しました'); } finally { setSaving(false); }
  }

  return (
    <div className="mb-2.5">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{label}</span>
        {!editing && <button onClick={() => { setDraft(value); setEditing(true); }} className="text-[10px]" style={{ color: 'var(--accent)' }}>✏️</button>}
      </div>
      {editing ? (
        <div className="space-y-1">
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={2}
            className="w-full text-[12px] rounded-md px-2 py-1.5 resize-none"
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} />
          <div className="flex gap-1.5">
            <button onClick={save} disabled={saving} className="text-[10px] font-bold rounded px-2 py-1"
              style={{ background: 'var(--accent)', color: '#fff', opacity: saving ? 0.6 : 1 }}>保存</button>
            <button onClick={() => setEditing(false)} className="text-[10px] rounded px-2 py-1"
              style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>キャンセル</button>
          </div>
        </div>
      ) : (
        <p className="text-xs leading-relaxed" style={{ color: value ? 'var(--text)' : 'var(--muted)' }}>{value || '未設定'}</p>
      )}
    </div>
  );
}

function MemberCard({ member, onChange }: { member: Member; onChange: (patch: Partial<Member>) => void }) {
  async function update(patch: Record<string, string>) {
    const res = await fetch('/api/ai-team/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: member.id, ...patch }),
    });
    if (!res.ok) throw new Error(await res.text());
    onChange(patch);
  }

  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-bold">{ICON[member.id] ?? '🤖'} {member.name}</div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
          style={{
            background: member.status === '稼働中' ? 'rgba(34,197,94,0.15)' : 'rgba(107,107,138,0.15)',
            color: member.status === '稼働中' ? '#22c55e' : '#8b899e',
          }}>
          {member.status}
        </span>
      </div>
      <p className="text-[10px] mb-3" style={{ color: 'var(--muted)' }}>{member.role}</p>

      <EditableField label="現在の仕事" value={member.currentTask} onSave={v => update({ currentTask: v })} />
      <EditableField label="次の仕事" value={member.nextTask} onSave={v => update({ nextTask: v })} />
      <EditableField label="判断待ち" value={member.pendingDecision} onSave={v => update({ pendingDecision: v })} />

      <div className="mb-2">
        <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>完了した仕事</div>
        {member.completedTasks.length > 0 ? (
          <ul className="space-y-0.5">
            {member.completedTasks.slice(0, 5).map((t, i) => (
              <li key={i} className="text-[11px]" style={{ color: 'var(--text)' }}>・{t}</li>
            ))}
          </ul>
        ) : <p className="text-[11px]" style={{ color: 'var(--muted)' }}>なし</p>}
      </div>

      {member.updatedAt && (
        <p className="text-[9px]" style={{ color: 'var(--muted)' }}>
          最終更新: {new Date(member.updatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
        </p>
      )}
    </div>
  );
}

export default function AiTeamPage() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(AI_TEAM_URL, { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => setMembers(d.members))
      .catch(e => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🤖 AI TEAM</h1>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 16 }}>
        <p className="text-sm" style={{ color: '#ef4444' }}>データ未取得: {error}</p>
      </div>
    </div>
  );

  if (!members) return <div className="p-6" style={{ color: 'var(--muted)' }}>読み込み中...</div>;

  function patchLocal(id: string, patch: Partial<Member>) {
    setMembers(prev => prev ? prev.map(m => m.id === id ? { ...m, ...patch } : m) : prev);
  }

  return (
    <div className="space-y-4 pb-10">
      <div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>AI TEAM</div>
        <h1 className="text-xl font-bold">ChatGPT / Claude / Gemini</h1>
        <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>自動連携なし。ClaudeはChatGPT・Geminiの作業状況を把握できないため、全項目オーナーが手動で更新します</p>
      </div>

      {members.map(m => <MemberCard key={m.id} member={m} onChange={p => patchLocal(m.id, p)} />)}
    </div>
  );
}
