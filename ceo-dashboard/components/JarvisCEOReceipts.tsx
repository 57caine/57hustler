'use client';

import { useCallback, useEffect, useState } from 'react';

type Receipt = {
  recordedAt: string;
  commentAt: string;
  url: string;
  stage: 'implemented' | 'verified' | 'observing' | 'blocked' | 'no_change';
  task: string;
  evidence: string | null;
  next: string;
  impact: string;
};
type Payload = {
  available: boolean;
  fetchedAt?: string;
  receipts?: Receipt[];
  error?: string;
  limited?: boolean;
};
const label: Record<Receipt['stage'], string> = {
  implemented: '実装記録',
  verified: '検証記録',
  observing: '観察中',
  blocked: '支障あり',
  no_change: '変更なし',
};
function format(date: string | undefined) {
  return date && !Number.isNaN(Date.parse(date))
    ? new Date(date).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '未取得';
}

export default function JarvisCEOReceipts() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/jarvis/receipts', { cache: 'no-store' });
      if (!response.ok) throw new Error('取得失敗');
      setData(await response.json() as Payload);
    } catch {
      setData(null);
      setError('CEO実行の報告を確認できません。停止とは断定しません。');
    } finally { setBusy(false); }
  }, []);
  useEffect(() => {
    void refresh();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, 300_000);
    return () => clearInterval(timer);
  }, [refresh]);

  const receipts = data?.available ? data.receipts ?? [] : [];
  const latest = receipts[0];
  const stale = !!latest && Date.now() - Date.parse(latest.commentAt) > 8 * 3600_000;
  return (
    <section className="jv-section" aria-label="JARVIS CEOの実行報告">
      <div className="jv-sectiontop">
        <div>
          <h2 className="jv-sectiontitle">CEOの自走報告</h2>
          <p className="jv-subtle" style={{ marginTop: 6 }}>既存のCEO定期実行が残した要約だけを表示します。</p>
        </div>
        <button type="button" className="jv-refresh" disabled={busy} onClick={() => void refresh()}>{busy ? '取得中…' : '↻ 更新'}</button>
      </div>
      {error && <div className="jv-message" role="status">{error}</div>}
      {data && !data.available && <div className="jv-message" role="status">{data.error ?? '記録が未取得です'}</div>}
      {data?.available && !latest && (
        <div className="jv-message">新形式のCEO自走報告はまだ確認できません。自動タスクが稼働していないという意味ではありません。次の定期実行で実際に記録されたかを確認します。</div>
      )}
      {data?.available && latest && (
        <>
          {stale && <div className="jv-message" role="status">直近の報告は8時間以上前です。現在の稼働を示すものではありません。</div>}
          <div className="jv-tasklist">
            {receipts.slice(0, 3).map((receipt, index) => (
              <article className="jv-task" key={receipt.url}>
                <div className="jv-taskhead">
                  <span className="jv-taskname">{index === 0 ? '直近：' : ''}{receipt.task}</span>
                  <span className={`jv-chip ${receipt.stage === 'blocked' ? 'jv-chip--warn' : receipt.stage === 'no_change' ? 'jv-chip--quiet' : ''}`}>{label[receipt.stage]}</span>
                </div>
                <p className="jv-subtle">記録 {format(receipt.commentAt)} ／ 売上への影響：{receipt.impact}</p>
                <p className="jv-subtle">次の一手：{receipt.next}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
                  <a href={receipt.url} target="_blank" rel="noopener noreferrer">報告の原本 ↗</a>
                  {receipt.evidence && <a href={receipt.evidence} target="_blank" rel="noopener noreferrer">作業の証拠 ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {!error && !data && !busy && <p className="jv-message">まだ取得していません。</p>}
      <p className="jv-subtle" style={{ marginTop: 10 }}>
        CEOの自己申告です。GitHub Actionsの成功やPRのマージ、本番公開、確定報酬は、それぞれの原本を別途確認します。
        {data?.limited ? ' 取得件数が上限に達したため、一部の報告は省略されている可能性があります。' : ''}
      </p>
    </section>
  );
}
