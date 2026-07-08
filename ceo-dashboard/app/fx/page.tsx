import FxClient from './FxClient';

export default function FxPage() {
  return (
    <div>
      <div className="mb-4 px-3 py-2 rounded-md text-xs"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
        ⚠️ このツールは個人的な学習・分析目的のみ。投資判断の根拠に使用しないこと。
      </div>
      <FxClient />
    </div>
  );
}
