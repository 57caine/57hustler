'use client';
import { useState, useEffect } from 'react';

interface TradeEntry {
  id: string;
  date: string;
  time: string;
  pair: 'USDJPY' | 'EURUSD' | 'EURJPY';
  direction: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  lots: number;
  pnl: number;
  reason: string;
  notes: string;
  result: 'win' | 'loss' | 'draw';
}

const STORAGE_KEY = 'fx-journal-entries';
const PAIRS = ['USDJPY', 'EURUSD', 'EURJPY'] as const;

function autoPnl(pair: string, dir: 'buy' | 'sell', entry: number, exit: number, lots: number): number {
  if (!entry || !exit || !lots) return 0;
  const diff = dir === 'buy' ? exit - entry : entry - exit;
  const jpyFactor = pair === 'EURUSD' ? 150 : 1;
  return Math.round(diff * lots * 100000 * jpyFactor);
}

function autoResult(pnl: number): 'win' | 'loss' | 'draw' {
  return pnl > 0 ? 'win' : pnl < 0 ? 'loss' : 'draw';
}

function calcStats(entries: TradeEntry[]) {
  const wins = entries.filter(e => e.result === 'win').length;
  const losses = entries.filter(e => e.result === 'loss').length;
  const totalPnl = entries.reduce((s, e) => s + e.pnl, 0);

  let maxWin = 0, maxLoss = 0, curWin = 0, curLoss = 0;
  [...entries].reverse().forEach(e => {
    if (e.result === 'win') { curWin++; curLoss = 0; maxWin = Math.max(maxWin, curWin); }
    else if (e.result === 'loss') { curLoss++; curWin = 0; maxLoss = Math.max(maxLoss, curLoss); }
    else { curWin = 0; curLoss = 0; }
  });

  const pairStats: Record<string, { w: number; l: number; d: number }> = {
    USDJPY: { w: 0, l: 0, d: 0 }, EURUSD: { w: 0, l: 0, d: 0 }, EURJPY: { w: 0, l: 0, d: 0 },
  };
  entries.forEach(e => {
    const ps = pairStats[e.pair];
    if (!ps) return;
    if (e.result === 'win') ps.w++; else if (e.result === 'loss') ps.l++; else ps.d++;
  });

  return { wins, losses, totalPnl, maxWin, maxLoss, pairStats };
}

function toCSV(entries: TradeEntry[]): string {
  const header = '日付,時間,通貨ペア,売買,エントリー,決済,ロット,損益(円),理由,反省,結果';
  const rows = entries.map(e =>
    [e.date, e.time, e.pair, e.direction === 'buy' ? '買い' : '売り',
      e.entryPrice, e.exitPrice, e.lots, e.pnl,
      `"${e.reason.replace(/"/g, '""')}"`,
      `"${e.notes.replace(/"/g, '""')}"`,
      e.result === 'win' ? '勝ち' : e.result === 'loss' ? '負け' : '引き分け',
    ].join(',')
  );
  return [header, ...rows].join('\n');
}

const todayJST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
const nowTimeJST = () => new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo' });

function emptyForm(): Omit<TradeEntry, 'id'> {
  return {
    date: todayJST(), time: nowTimeJST(),
    pair: 'USDJPY', direction: 'buy',
    entryPrice: 0, exitPrice: 0, lots: 0.1,
    pnl: 0, reason: '', notes: '', result: 'win',
  };
}

const input = (style?: React.CSSProperties): React.CSSProperties => ({
  background: 'var(--bg)', border: '1px solid var(--border)',
  color: 'var(--text)', borderRadius: 6, padding: '6px 10px',
  width: '100%', fontSize: 14, ...style,
});

export default function JournalClient() {
  const [entries, setEntries] = useState<TradeEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<TradeEntry, 'id'>>(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as TradeEntry[]);
    } catch {}
  }, []);

  function save(updated: TradeEntry[]) {
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function setField<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(prev => {
      const next = { ...prev, [k]: v };
      // auto-recalc pnl when price/lots/pair/direction change
      if (['pair', 'direction', 'entryPrice', 'exitPrice', 'lots'].includes(k)) {
        const pnl = autoPnl(next.pair, next.direction, next.entryPrice, next.exitPrice, next.lots);
        next.pnl = pnl;
        next.result = autoResult(pnl);
      }
      return next;
    });
  }

  function submit() {
    if (!form.entryPrice || !form.exitPrice || !form.lots) return;
    if (editId) {
      save(entries.map(e => e.id === editId ? { ...form, id: editId } : e));
      setEditId(null);
    } else {
      save([{ ...form, id: Date.now().toString() }, ...entries]);
    }
    setForm(emptyForm());
    setShowForm(false);
  }

  function startEdit(e: TradeEntry) {
    const { id, ...rest } = e;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteEntry(id: string) {
    if (confirm('このトレードを削除しますか？')) save(entries.filter(e => e.id !== id));
  }

  function exportCSV() {
    const csv = toCSV(entries);
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `fx-journal-${todayJST()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const stats = calcStats(entries);
  const winRate = (stats.wins + stats.losses) > 0
    ? Math.round(stats.wins / (stats.wins + stats.losses) * 100) : null;

  const surface: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
  };

  return (
    <div style={{ color: 'var(--text)' }}>
      {/* Stats */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-lg" style={surface}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>通算勝率</div>
            <div className="text-2xl font-bold font-mono"
              style={{ color: winRate !== null && winRate >= 50 ? 'var(--green)' : '#ef4444' }}>
              {winRate !== null ? `${winRate}%` : '—'}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{stats.wins}勝 {stats.losses}敗</div>
          </div>
          <div className="p-3 rounded-lg" style={surface}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>通算損益</div>
            <div className="text-2xl font-bold font-mono"
              style={{ color: stats.totalPnl >= 0 ? 'var(--green)' : '#ef4444' }}>
              {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl.toLocaleString()}円
            </div>
          </div>
          <div className="p-3 rounded-lg" style={surface}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>最大連勝 / 連敗</div>
            <div className="text-lg font-bold font-mono">
              <span style={{ color: 'var(--green)' }}>{stats.maxWin}連勝</span>
              {' / '}
              <span style={{ color: '#ef4444' }}>{stats.maxLoss}連敗</span>
            </div>
          </div>
          <div className="p-3 rounded-lg" style={surface}>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>通貨ペア別勝率</div>
            {PAIRS.map(p => {
              const ps = stats.pairStats[p];
              const total = ps.w + ps.l;
              const wr = total > 0 ? Math.round(ps.w / total * 100) : null;
              return (
                <div key={p} className="flex justify-between text-xs font-mono mb-1">
                  <span>{p}</span>
                  <span style={{ color: wr !== null && wr >= 50 ? 'var(--green)' : wr !== null ? '#ef4444' : 'var(--muted)' }}>
                    {wr !== null ? `${wr}%` : '—'} <span style={{ color: 'var(--muted)' }}>({ps.w}w {ps.l}l)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Header actions */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm()); }}
          className="px-4 py-2 rounded-lg text-sm font-medium flex-1"
          style={{ background: 'var(--accent)', color: '#fff' }}>
          {showForm && !editId ? '✕ キャンセル' : '+ トレード追加'}
        </button>
        {entries.length > 0 && (
          <button onClick={exportCSV}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            CSV
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg p-4 mb-5" style={surface}>
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--accent)' }}>
            {editId ? '✏️ トレード編集' : '📝 トレード記録'}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>日付</label>
              <input type="date" value={form.date} onChange={e => setField('date', e.target.value)} style={input()} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>時間</label>
              <input type="time" value={form.time} onChange={e => setField('time', e.target.value)} style={input()} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>通貨ペア</label>
              <select value={form.pair} onChange={e => setField('pair', e.target.value as typeof form.pair)} style={input()}>
                {PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>売買</label>
              <select value={form.direction} onChange={e => setField('direction', e.target.value as 'buy' | 'sell')} style={input()}>
                <option value="buy">買い（Long）</option>
                <option value="sell">売り（Short）</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>エントリー</label>
              <input type="number" step="any" value={form.entryPrice || ''} placeholder="0"
                onChange={e => setField('entryPrice', parseFloat(e.target.value) || 0)} style={input()} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>決済価格</label>
              <input type="number" step="any" value={form.exitPrice || ''} placeholder="0"
                onChange={e => setField('exitPrice', parseFloat(e.target.value) || 0)} style={input()} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>ロット数</label>
              <input type="number" step="0.01" min="0.01" value={form.lots || ''} placeholder="0.1"
                onChange={e => setField('lots', parseFloat(e.target.value) || 0)} style={input()} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>損益（円）自動計算</label>
              <input type="number" value={form.pnl}
                onChange={e => { const v = parseInt(e.target.value) || 0; setForm(p => ({ ...p, pnl: v, result: autoResult(v) })); }}
                style={input({ color: form.pnl > 0 ? 'var(--green)' : form.pnl < 0 ? '#ef4444' : 'var(--text)' })} />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>結果</label>
              <select value={form.result} onChange={e => setForm(p => ({ ...p, result: e.target.value as typeof form.result }))} style={input()}>
                <option value="win">勝ち</option>
                <option value="loss">負け</option>
                <option value="draw">引き分け</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>トレード理由</label>
            <textarea rows={2} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
              placeholder="エントリー根拠・戦略..."
              style={{ ...input(), resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div className="mb-4">
            <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>反省・メモ</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="改善点・次回への課題..."
              style={{ ...input(), resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <button onClick={submit}
            className="w-full py-2 rounded-lg font-medium text-sm"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            {editId ? '更新する' : '記録する'}
          </button>
        </div>
      )}

      {/* Trade list */}
      {entries.length === 0 && !showForm && (
        <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">📓</div>
          <div className="text-sm">まだトレードが記録されていません</div>
        </div>
      )}

      <div className="space-y-2">
        {entries.map(e => {
          const expanded = expandedId === e.id;
          return (
            <div key={e.id} className="rounded-lg overflow-hidden"
              style={{ border: `1px solid ${e.result === 'win' ? 'rgba(34,197,94,0.3)' : e.result === 'loss' ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`, background: 'var(--surface)' }}>
              <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : e.id)}>
                <span className="text-base">{e.result === 'win' ? '✅' : e.result === 'loss' ? '❌' : '➖'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold">{e.pair}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: e.direction === 'buy' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: e.direction === 'buy' ? 'var(--green)' : '#ef4444' }}>
                      {e.direction === 'buy' ? '買い' : '売り'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{e.date}</span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {e.entryPrice} → {e.exitPrice} | {e.lots}lot
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm"
                    style={{ color: e.pnl >= 0 ? 'var(--green)' : '#ef4444' }}>
                    {e.pnl >= 0 ? '+' : ''}{e.pnl.toLocaleString()}円
                  </div>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
              </div>

              {expanded && (
                <div className="px-3 pb-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  {e.reason && (
                    <div className="mt-2">
                      <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>理由</div>
                      <div className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{e.reason}</div>
                    </div>
                  )}
                  {e.notes && (
                    <div className="mt-2">
                      <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>反省</div>
                      <div className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{e.notes}</div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => startEdit(e)}
                      className="px-3 py-1 rounded text-xs"
                      style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                      編集
                    </button>
                    <button onClick={() => deleteEntry(e.id)}
                      className="px-3 py-1 rounded text-xs"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                      削除
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
