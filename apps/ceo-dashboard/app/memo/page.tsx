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

const MEMOS = [
  {
    category: 'アイデア',
    items: [
      'lens-naviに「眼科クリニック検索」機能追加',
      'noteマガジンをKindle出版化（第12回以降）',
      'henkutsuのX（Twitter）アカウント展開',
    ],
  },
  {
    category: '要対応',
    items: [
      'ANTHROPIC_API_KEY を GitHub Secrets に登録',
      'product-url-map.json の全商品URL補完',
      'Amazon アソシエイト本審査クリア（180日以内に3件）',
    ],
  },
];

export default function MemoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>メモ</h1>

      {MEMOS.map(section => (
        <Card key={section.category}>
          <SectionTitle>{section.category}</SectionTitle>
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span style={{ color: 'var(--accent)' }}>·</span>
                <span style={{ color: 'var(--text)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
