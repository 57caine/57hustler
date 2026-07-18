import Link from 'next/link';

const CATEGORIES = [
  { href: '/category/1day',  label: 'コンタクトレンズ', icon: '👁' },
  { href: '/karakon',        label: 'カラコン',          icon: '👁‍🗨' },
  { href: '/megane',         label: '眼鏡・サングラス',  icon: '👓' },
  { href: '/vr',             label: 'VR・スマートグラス', icon: '🥽' },
  { href: '/lasik',          label: 'レーシック',        icon: '✨' },
  { href: '/eye-care',       label: 'アイケア・目薬',    icon: '💊' },
  { href: '/eye-goods',      label: '目のグッズ',        icon: '🛍' },
  { href: '/ranking',        label: '人気ランキング',    icon: '🏆' },
];

const POPULAR_COLUMNS = [
  { href: '/column/bc-to-ha',                      label: 'BCとは？正しい選び方ガイド' },
  { href: '/column/karakon-shoshinsha-guide',       label: 'カラコン初心者完全ガイド' },
  { href: '/column/korea-karakon-ranking-2026',     label: '韓国カラコン人気ランキング2026' },
  { href: '/column/lasik-hiyo-risk',                label: 'レーシックの費用・リスク解説' },
  { href: '/column/dryeye-taisaku',                 label: 'ドライアイ対策まとめ' },
];

const SITE_INFO = [
  { href: '/about',       label: '運営者情報' },
  { href: '/privacy',     label: 'プライバシーポリシー' },
  { href: '/disclosure',  label: 'アフィリエイト表示' },
  { href: '/contact',     label: 'お問い合わせ' },
  { href: '/column',      label: 'コラム記事一覧' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-500 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: カテゴリ一覧 */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">カテゴリ一覧</h3>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-sky-600 transition-colors">
                    {c.icon} {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: 人気コラム */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">人気コラム</h3>
            <ul className="space-y-2 text-xs">
              {POPULAR_COLUMNS.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-sky-600 transition-colors leading-snug block">
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/column" className="text-sky-600 hover:text-sky-500 transition-colors font-medium">
                  全記事を見る →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: サイト情報 */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">サイト情報</h3>
            <ul className="space-y-2 text-xs">
              {SITE_INFO.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-sky-600 transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: SNS・アフィリエイト表記 */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">アフィリエイト表記</h3>
            <p className="text-xs leading-relaxed mb-4">
              当サイトは楽天アフィリエイト・A8.netなどのアフィリエイトプログラムに参加しています。
              商品リンクから購入された場合、当サイトに手数料が発生することがあります。
            </p>
            <p className="text-xs leading-relaxed">
              掲載価格は自動スクレイピングにより定期更新しています。最新価格は各ショップでご確認ください。
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-xs text-center text-gray-400">
          <p>© 2026 レンズナビ (lens-navi.jp) — コンタクトレンズ・カラコン・目の情報メディア</p>
        </div>
      </div>
    </footer>
  );
}
