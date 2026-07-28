'use client';

import { useState, FormEvent } from 'react';
import type { KyuseiResult } from '@/lib/kyusei';

interface DiagnoseResponse {
  result: KyuseiResult;
  diagnosis: string;
  error?: string;
  detail?: string;
}

const STAR_COLORS: Record<number, string> = {
  1: 'text-blue-300',
  2: 'text-yellow-700',
  3: 'text-green-400',
  4: 'text-emerald-300',
  5: 'text-yellow-500',
  6: 'text-slate-300',
  7: 'text-red-300',
  8: 'text-amber-200',
  9: 'text-purple-300',
};

const STAR_BG: Record<number, string> = {
  1: 'from-blue-950 to-slate-950 border-blue-800',
  2: 'from-yellow-950 to-stone-950 border-yellow-800',
  3: 'from-green-950 to-slate-950 border-green-800',
  4: 'from-emerald-950 to-teal-950 border-emerald-800',
  5: 'from-yellow-950 to-amber-950 border-yellow-700',
  6: 'from-slate-900 to-slate-950 border-slate-600',
  7: 'from-red-950 to-rose-950 border-red-800',
  8: 'from-amber-950 to-stone-950 border-amber-800',
  9: 'from-purple-950 to-violet-950 border-purple-800',
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function Home() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiagnoseResponse | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!year || !month || !day) {
      setError('生年月日をすべて選択してください');
      return;
    }
    setError('');
    setLoading(true);
    setData(null);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: Number(year), month: Number(month), day: Number(day) }),
      });
      const json: DiagnoseResponse = await res.json();
      if (!res.ok || json.error) {
        setError(json.detail ? `${json.error}: ${json.detail}` : (json.error ?? '診断に失敗しました'));
        return;
      }
      setData(json);
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  const starColor = data ? (STAR_COLORS[data.result.starNumber] ?? 'text-amber-200') : '';
  const starBg = data ? (STAR_BG[data.result.starNumber] ?? 'from-slate-900 to-slate-950 border-slate-700') : '';

  const paragraphs = data
    ? data.diagnosis.split('\n').filter(l => l.trim().length > 0)
    : [];

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🌙</div>
        <h1 className="text-2xl font-bold text-amber-200 mb-2">
          夜中のおじさんの<br className="sm:hidden" />九星気学占い
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          生年月日を入力するだけ。<br />
          あなたの<span className="text-amber-300">本命星</span>を算出して、独自の視点で診断します。
        </p>
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8">
        <p className="text-slate-400 text-xs mb-4 text-center">生年月日を選んでください</p>

        <div className="flex gap-2 mb-5">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">年</label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="">年</option>
              {years.map(y => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <label className="block text-xs text-slate-500 mb-1">月</label>
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="">月</option>
              {months.map(m => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <label className="block text-xs text-slate-500 mb-1">日</label>
            <select
              value={day}
              onChange={e => setDay(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="">日</option>
              {days.map(d => (
                <option key={d} value={d}>{d}日</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center mb-3 break-all">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-colors text-sm"
        >
          {loading ? '占い中...' : '🔮 占う'}
        </button>
      </form>

      {/* ローディング */}
      {loading && (
        <div className="text-center py-10 text-slate-400 text-sm">
          <div className="text-3xl mb-3 animate-pulse">🌙</div>
          <p>星の配置を読んでいます...</p>
        </div>
      )}

      {/* 結果 */}
      {data && (
        <div id="result">
          {/* 本命星カード */}
          <div className={`bg-gradient-to-br ${starBg} border rounded-2xl p-6 mb-6 text-center`}>
            <p className="text-slate-400 text-xs mb-2">あなたの本命星</p>
            <p className={`text-3xl font-bold mb-1 ${starColor}`}>{data.result.starName}</p>
            <p className="text-slate-400 text-sm mb-3">
              {data.result.eto}年 / {data.result.junishiReading} / {data.result.element}の気
            </p>
            <div className="flex justify-center gap-4 text-xs text-slate-500">
              <span>吉方位：{data.result.direction}</span>
              <span>本質：{data.result.nature}</span>
            </div>
          </div>

          {/* 診断文 */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
            <p className="text-xs text-amber-400 mb-4 text-center">🌙 夜中のおじさんからの診断</p>
            <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
              {paragraphs.map((para, i) => (
                <p key={i} className={para.startsWith('■') ? 'font-bold text-amber-300 mt-2' : ''}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3 mb-8">
            <a
              href="https://www.threads.net/@westin_lab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-black border border-slate-700 hover:border-slate-500 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              <span className="text-lg">🧵</span>
              @westin_lab をフォローする（Threads）
            </a>
            <a
              href="https://note.com/kobayashi_done"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-slate-800 border border-slate-600 hover:border-amber-600 text-slate-200 font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              <span className="text-lg">📓</span>
              深堀り版はnoteで読む
            </a>
          </div>

          {/* 再占いボタン */}
          <div className="text-center">
            <button
              onClick={() => { setData(null); setYear(''); setMonth(''); setDay(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
            >
              もう一度占う
            </button>
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="mt-12 text-center text-xs text-slate-600">
        <p>九星気学に基づく診断です。占いは参考程度にどうぞ。</p>
        <p className="mt-1">© 夜中のおじさん</p>
      </footer>
    </main>
  );
}
