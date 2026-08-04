import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-500 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-sky-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-gray-800 font-bold">ショップナビ</span>
          </div>
          <p className="text-sm text-gray-500 max-w-md">
            目もとのケアグッズを中心に取り扱うオンラインストアです。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-t border-gray-200 pt-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">ショップ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-sky-600 transition-colors">商品一覧</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-sky-600 transition-colors">運営者情報</Link></li>
              <li><Link href="/tokushoho" className="hover:text-sky-600 transition-colors">特定商取引法に基づく表記</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-600 transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/contact" className="hover:text-sky-600 transition-colors">お問い合わせ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-xs text-gray-400">
          <p>© 2026 ショップナビ（shop.lens-navi.jp）</p>
        </div>
      </div>
    </footer>
  );
}
