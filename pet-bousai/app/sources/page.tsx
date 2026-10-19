import StaticPage from '@/components/StaticPage';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';
import { SOURCES, SOURCES_CHECKED_AT } from '@/lib/sources';

const meta = getPage('/sources');
export const metadata = pageMetadata(meta);

export default function SourcesPage() {
  return (
    <StaticPage title={meta.title}>
      <p>
        当サイトの「公的資料にもとづく情報」の欄は、次の資料の記載をもとにしています。
        各ページでは記載ページ（「一般飼い主編」の冊子に印字されたページ番号）を示しています。
        資料の内容は{SOURCES_CHECKED_AT}に原文と照合しました。
      </p>
      <ul>
        {Object.values(SOURCES).map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.publisher}「{s.title}」
            </a>
            （{s.issued}）{s.note ? <span className="block text-sm text-gray-600">{s.note}</span> : null}
          </li>
        ))}
      </ul>
      <h2>用品の選び方について</h2>
      <p>
        各ページの「確認したい点」などの用品の選び方は、上の資料ではなく、当サイトが一般的な観点として整理したものです。
        安全性や効果を保証するものではありません。商品の仕様は、リンク先の商品ページでご確認ください。
      </p>
    </StaticPage>
  );
}
