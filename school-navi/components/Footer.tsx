import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white mb-3">カテゴリから探す</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/%E8%BB%A2%E8%81%B7%E7%89%B9%E5%8C%96" className="hover:text-white transition-colors">転職特化</Link></li>
              <li><Link href="/category/%E3%82%B9%E3%82%AD%E3%83%AB%E3%82%A2%E3%83%83%E3%83%97" className="hover:text-white transition-colors">スキルアップ</Link></li>
              <li><Link href="/category/%E3%83%95%E3%83%AA%E3%83%BC%E3%83%A9%E3%83%B3%E3%82%B9%E7%89%B9%E5%8C%96" className="hover:text-white transition-colors">フリーランス特化</Link></li>
              <li><Link href="/category/AI%E7%89%B9%E5%8C%96" className="hover:text-white transition-colors">AI特化</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">スクール一覧</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/schools/techcamp" className="hover:text-white transition-colors">TECH CAMP</Link></li>
              <li><Link href="/schools/dmm-webcamp" className="hover:text-white transition-colors">DMM WEBCAMP</Link></li>
              <li><Link href="/schools/runteq" className="hover:text-white transition-colors">RUNTEQ</Link></li>
              <li><Link href="/schools/progate" className="hover:text-white transition-colors">Progate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">コラム</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/column/programming-school-hikaku-2025" className="hover:text-white transition-colors">スクール比較2025年版</Link></li>
              <li><Link href="/column/teiten-hojo-programming-school" className="hover:text-white transition-colors">給付金で学ぶ方法</Link></li>
              <li><Link href="/column/mikeiken-engineer-tenshi" className="hover:text-white transition-colors">未経験から転職</Link></li>
              <li><Link href="/column/programming-school-ryokin-hikaku" className="hover:text-white transition-colors">料金比較</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">このサイトについて</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/disclosure" className="hover:text-white transition-colors">アフィリエイト表示</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-sm text-center text-gray-500">
          <p className="mb-2">当サイトはアフィリエイト広告プログラムに参加しています。スクールリンクから申し込まれた場合、当サイトに手数料が発生することがあります。</p>
          <p>© 2026 スクールナビ (nsplot.com). 掲載情報は変更される場合があります。最新情報は各スクール公式サイトでご確認ください。</p>
        </div>
      </div>
    </footer>
  );
}
