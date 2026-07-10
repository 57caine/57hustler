'use client';
import { useState } from 'react';

const PIP_SIZE: Record<string, number> = {
  USDJPY: 0.01, EURUSD: 0.0001, EURJPY: 0.01,
};
// JPY per pip per 1.0 standard lot (100,000 units)
const PIP_VALUE_JPY: Record<string, number> = {
  USDJPY: 1000,  // 0.01 × 100,000 JPY
  EURUSD: 1500,  // 0.0001 × 100,000 USD × 150 JPY/USD (approx)
  EURJPY: 1000,  // 0.01 × 100,000 JPY
};

const PAIRS = ['USDJPY', 'EURUSD', 'EURJPY'];

const inputStyle: React.CSSProperties = {
  background: 'var(--bg)', border: '1px solid var(--border)',
  color: 'var(--text)', borderRadius: 8, padding: '10px 12px',
  width: '100%', fontSize: 16, fontFamily: 'monospace',
};

export default function RiskClient() {
  const [capital, setCapital] = useState('1000000');
  const [riskPct, setRiskPct] = useState('2');
  const [entry, setEntry] = useState('');
  const [stop, setStop] = useState('');
  const [pair, setPair] = useState('USDJPY');

  const capitalNum  = parseFloat(capital.replace(/,/g, '')) || 0;
  const riskPctNum  = parseFloat(riskPct) || 0;
  const entryNum    = parseFloat(entry) || 0;
  const stopNum     = parseFloat(stop) || 0;

  const riskAmount  = capitalNum * riskPctNum / 100;
  const priceDiff   = Math.abs(entryNum - stopNum);
  const pipSize     = PIP_SIZE[pair] ?? 0.01;
  const pips        = priceDiff > 0 ? Math.round(priceDiff / pipSize) : 0;
  const pipValue    = PIP_VALUE_JPY[pair] ?? 1000;
  const lots        = pips > 0 ? riskAmount / (pips * pipValue) : 0;

  const canCalc     = capitalNum > 0 && riskPctNum > 0 && entryNum > 0 && stopNum > 0 && priceDiff > 0;
  const isOverRisk  = riskPctNum > 3;
  const isZeroStop  = entryNum > 0 && stopNum > 0 && priceDiff === 0;

  const surface: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
  };

  return (
    <div style={{ color: 'var(--text)' }}>
      {/* Warning banner */}
      <div className="rounded-lg px-3 py-2 mb-5 text-xs"
        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--amber)' }}>
        ⚠️ FXは元本割れリスクがあります。余剰資金のみで行ってください。
      </div>

      {/* Inputs */}
      <div className="rounded-xl p-4 mb-5" style={surface}>
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--accent)' }}>📊 入力</div>

        <div className="mb-4">
          <label className="text-xs block mb-2" style={{ color: 'var(--muted)' }}>通貨ペア</label>
          <div className="flex gap-2">
            {PAIRS.map(p => (
              <button key={p} onClick={() => setPair(p)}
                className="flex-1 py-2 rounded-lg text-sm font-mono font-medium"
                style={{
                  background: pair === p ? 'var(--accent)' : 'var(--bg)',
                  color: pair === p ? '#fff' : 'var(--muted)',
                  border: `1px solid ${pair === p ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--muted)' }}>総資金（円）</label>
            <input type="number" inputMode="numeric" value={capital}
              onChange={e => setCapital(e.target.value)}
              placeholder="1000000" style={inputStyle} />
          </div>
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--muted)' }}>
              リスク許容度（%）
              {isOverRisk && <span className="ml-1" style={{ color: '#ef4444' }}>⚠️高</span>}
            </label>
            <input type="number" inputMode="decimal" step="0.5" min="0.1" max="10"
              value={riskPct} onChange={e => setRiskPct(e.target.value)}
              style={{ ...inputStyle, borderColor: isOverRisk ? '#ef4444' : 'var(--border)', color: isOverRisk ? '#ef4444' : 'var(--text)' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--muted)' }}>エントリー価格</label>
            <input type="number" inputMode="decimal" step="any" value={entry}
              onChange={e => setEntry(e.target.value)}
              placeholder={pair === 'EURUSD' ? '1.0850' : pair === 'USDJPY' ? '150.00' : '163.00'}
              style={inputStyle} />
          </div>
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--muted)' }}>損切り価格（SL）</label>
            <input type="number" inputMode="decimal" step="any" value={stop}
              onChange={e => setStop(e.target.value)}
              placeholder={pair === 'EURUSD' ? '1.0800' : pair === 'USDJPY' ? '149.50' : '162.50'}
              style={{ ...inputStyle, borderColor: isZeroStop ? '#ef4444' : 'var(--border)' }} />
          </div>
        </div>
      </div>

      {/* Results */}
      {canCalc ? (
        <div className="space-y-3">
          {/* Max loss - big display */}
          <div className="rounded-xl p-5 text-center"
            style={{ ...surface, borderColor: isOverRisk ? '#ef4444' : 'var(--border)', background: isOverRisk ? 'rgba(239,68,68,0.05)' : 'var(--surface)' }}>
            <div className="text-xs mb-2" style={{ color: isOverRisk ? '#ef4444' : 'var(--muted)' }}>
              このトレードで失う最大額
            </div>
            <div className="text-4xl font-bold font-mono mb-1"
              style={{ color: isOverRisk ? '#ef4444' : 'var(--amber)' }}>
              {Math.round(riskAmount).toLocaleString()}円
            </div>
            {isOverRisk && (
              <div className="text-sm mt-2 font-medium" style={{ color: '#ef4444' }}>
                ⚠️ リスク {riskPctNum}% は推奨上限（3%）を超えています
              </div>
            )}
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={surface}>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>適切なロット数</div>
              <div className="text-xl font-bold font-mono">{lots.toFixed(2)}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>ロット</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={surface}>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>損切り幅</div>
              <div className="text-xl font-bold font-mono">{pips}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>pips</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={surface}>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>1pip価値</div>
              <div className="text-xl font-bold font-mono">{(pipValue * lots).toFixed(0)}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>円/pip</div>
            </div>
          </div>

          {/* Ruin table */}
          <div className="rounded-xl p-4" style={surface}>
            <div className="text-xs font-semibold mb-3" style={{ color: 'var(--accent)' }}>リスク・リワード参考</div>
            {[1, 1.5, 2, 3].map(rr => (
              <div key={rr} className="flex justify-between text-sm font-mono py-1.5"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>RR {rr}:1</span>
                <span style={{ color: rr >= 2 ? 'var(--green)' : 'var(--text)' }}>
                  +{Math.round(riskAmount * rr).toLocaleString()}円 目標
                </span>
              </div>
            ))}
          </div>

          {/* Pip value note for EURUSD */}
          {pair === 'EURUSD' && (
            <div className="text-xs px-3 py-2 rounded-lg" style={{ color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              ※ EURUSD の円換算は USD/JPY ≈ 150 で概算しています
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">🛡️</div>
          <div className="text-sm">
            {!capitalNum ? '総資金を入力してください' :
             !riskPctNum ? 'リスク許容度を入力してください' :
             'エントリー価格と損切り価格を入力してください'}
          </div>
        </div>
      )}
    </div>
  );
}
