import Link from 'next/link';
import AdNotice from './AdNotice';
import LocalGovNotice from './LocalGovNotice';
import { ARTICLES, type PageMeta } from '@/lib/pages';
import { SOURCES, SOURCES_CHECKED_AT } from '@/lib/sources';

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}年${m}月${d}日`;
}

/** 記事ページ共通の枠: パンくず・広告表記・見出し・自治体差の注意・関連ページ・改訂中の注記 */
export default function Article({
  meta,
  lead,
  children,
  products,
}: {
  meta: PageMeta;
  lead: React.ReactNode;
  children: React.ReactNode;
  products?: React.ReactNode;
}) {
  const related = ARTICLES.filter((a) => a.path !== meta.path && (a.animal === meta.animal || a.animal === 'all' || meta.animal === 'all')).slice(0, 5);
  return (
    <article>
      <nav className="pt-3 text-xs text-gray-500" aria-label="パンくずリスト">
        <Link href="/" className="underline">トップ</Link>
        <span className="mx-1">›</span>
        <span>{meta.short}</span>
      </nav>
      <div className="mt-3">
        <AdNotice />
      </div>
      <h1 className="mt-5 text-2xl font-bold leading-snug">{meta.title}</h1>
      <p className="mt-2 text-xs text-gray-500">更新日：{formatDate(meta.updatedAt)}</p>
      <div className="prose-body mt-4 text-[15px]">{lead}</div>
      {children}
      <LocalGovNotice />
      {products}
      <section className="mt-10">
        <h2 className="text-base font-bold">関連ページ</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {related.map((r) => (
            <li key={r.path}>
              <Link href={r.path} className="underline text-brand-700">{r.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-8 text-xs text-gray-500 leading-relaxed">
        公的情報は{SOURCES_CHECKED_AT}時点で環境省が掲載している資料（{SOURCES['owner-guide'].issued}）をもとにしています。
        {SOURCES.revision.note}
        <a href={SOURCES.revision.url} target="_blank" rel="noopener noreferrer" className="underline">改訂の検討状況（環境省）</a>
      </p>
    </article>
  );
}
