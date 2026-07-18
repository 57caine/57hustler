function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
      {children}
    </h2>
  );
}

export default function FxPage() {
  const nisa = [
    { label: '商品', value: 'eMAXIS Slim 全世界株式（オルカン）' },
    { label: '積立額', value: '月3万円' },
    { label: '積立日', value: '毎月1日' },
    { label: 'ステータス', value: '🟢 稼働中' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>FX・投資</h1>

      <Card>
        <SectionTitle>NISA 積立</SectionTitle>
        <div className="space-y-2">
          {nisa.map(item => (
            <div key={item.label} className="flex justify-between text-sm">
              <span style={{ color: 'var(--muted)' }}>{item.label}</span>
              <span style={{ color: 'var(--text)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>メモ</SectionTitle>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          FX取引履歴・ポートフォリオ詳細は今後実装予定
        </p>
      </Card>
    </div>
  );
}
