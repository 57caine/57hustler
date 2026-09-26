import Link from 'next/link';
import { AREA_FEATURES, SITE_NAME, THEMES } from '@/lib/site-config';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-500 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">テーマから探す</h3>
            <ul className="space-y-2 text-sm">
              {THEMES.map((t) => (
                <li key={t.slug}><Link href={`/theme/${t.slug}`} className="hover:text-sky-600">{t.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">地域から探す</h3>
            <ul className="space-y-2 text-sm">
              {AREA_FEATURES.map((f) => (
                <li key={f.slug}><Link href={`/area/${f.slug}`} className="hover:text-sky-600">{f.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-sm">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-sky-600">運営者情報・免責事項</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-2 text-xs text-gray-500 leading-relaxed">
          <p>
            当サイトは楽天アフィリエイトを利用しており、掲載している予約ボタン・リンクにはアフィリエイトリンクが含まれます。
            リンク先で予約が成立した場合、運営者が紹介料を受け取ることがあります。
          </p>
          <p>
            宿泊施設の情報・料金は楽天トラベルAPIから自動取得したもので、実際の内容と異なる場合があります。
            最新の料金・空室状況・プラン内容は、必ず予約先の楽天トラベルのページでご確認ください。
          </p>
          {/* 楽天ウェブサービスの利用規約で求められているクレジット表記 */}
          <p>
            <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener noreferrer nofollow">
              Supported by Rakuten Developers
            </a>
          </p>
          <p>© 2026 {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
