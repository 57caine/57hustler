import Link from 'next/link';
import { Logo } from '@/components/Header';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site-config';

const SITE_LINKS = [
  { href: '/about', label: 'サイトについて' },
  { href: '/terms', label: '利用規約' },
  { href: '/privacy', label: 'プライバシーポリシー' },
  { href: '/contact', label: 'お問い合わせ' },
  { href: '/operator', label: '運営者情報' },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <Logo light />
            <p className="text-xs text-white/60 mt-2 md:hidden">{SITE_TAGLINE}</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {SITE_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-2 text-xs text-white/60 leading-relaxed">
          <p>
            当サイトは楽天グループ株式会社の「楽天アフィリエイト」プログラムを利用し、楽天トラベルの宿泊施設を紹介しています。
            掲載している予約ボタン・リンクにはアフィリエイトリンクが含まれ、リンク先で予約が成立した場合、運営者が紹介料を受け取ることがあります。
          </p>
          <p>
            掲載されている情報・価格は楽天トラベルAPIから自動取得したもので、変更される場合があります。
            最新の料金・空室状況・プラン内容は、必ず予約先の楽天トラベルのページでご確認ください。
          </p>
          {/* 楽天ウェブサービスの利用規約で求められているクレジット表記 */}
          <p>
            <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-white">
              Supported by Rakuten Developers
            </a>
          </p>
          <p>© 2026 {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
