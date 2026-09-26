import Link from 'next/link';
import { FEATURES, REGIONS, SITE_NAME, THEMES } from '@/lib/site-config';

const SITE_LINKS = [
  { href: '/about', label: 'サイトについて' },
  { href: '/terms', label: '利用規約' },
  { href: '/privacy', label: 'プライバシーポリシー' },
  { href: '/contact', label: 'お問い合わせ' },
  { href: '/operator', label: '運営者情報' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 text-gray-600 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="font-serif text-lg font-bold text-season mb-8">{SITE_NAME}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-sm">
          <FooterCol title="テーマから探す" links={THEMES.map((t) => ({ href: `/theme/${t.slug}`, label: t.name }))} />
          <FooterCol title="エリアから探す" links={REGIONS.map((r) => ({ href: `/region/${r.slug}`, label: r.name }))} />
          <FooterCol title="特集" links={FEATURES.map((f) => ({ href: `/feature/${f.slug}`, label: f.title }))} />
          <FooterCol title="サイト情報" links={SITE_LINKS} />
        </div>

        <div className="border-t border-black/5 pt-6 space-y-2 text-xs text-gray-500 leading-relaxed">
          <p>
            当サイトは楽天グループ株式会社の「楽天アフィリエイト」プログラムを利用し、楽天トラベルの宿泊施設を紹介しています。
            掲載している予約ボタン・リンクにはアフィリエイトリンクが含まれ、リンク先で予約が成立した場合、運営者が紹介料を受け取ることがあります。
          </p>
          <p>
            宿泊施設の情報・料金は楽天トラベルAPIから自動取得したもので、実際の内容と異なる場合があります。
            最新の料金・空室状況・プラン内容は、必ず予約先の楽天トラベルのページでご確認ください。
          </p>
          {/* 楽天ウェブサービスの利用規約で求められているクレジット表記 */}
          <p>
            <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener noreferrer nofollow" className="underline">
              Supported by Rakuten Developers
            </a>
          </p>
          <p>© 2026 {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="font-medium text-gray-800 mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}><Link href={l.href} className="hover:text-season">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
