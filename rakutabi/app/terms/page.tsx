import type { Metadata } from 'next';
import StaticPage from '@/components/StaticPage';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = { title: '利用規約' };

export default function TermsPage() {
  return (
    <StaticPage title="利用規約" href="/terms">
      <p>この利用規約は、{SITE_NAME}（以下「当サイト」）の利用条件を定めるものです。当サイトを利用された方は、本規約に同意したものとみなします。</p>
      <section>
        <h2>掲載情報について</h2>
        <p>
          当サイトに掲載している料金・空室状況・施設情報は、楽天トラベルAPIから取得した時点のもので、実際と異なる場合があります。
          予約の前に、必ず楽天トラベルの予約ページで最新の内容をご確認ください。
        </p>
      </section>
      <section>
        <h2>予約・契約について</h2>
        <p>
          宿泊の予約・支払い・キャンセル等の契約は、利用者と楽天トラベルまたは宿泊施設との間で行われます。
          当サイトは予約の当事者ではなく、予約に関するお問い合わせには対応できません。
        </p>
      </section>
      <section>
        <h2>免責事項</h2>
        <p>当サイトの情報を利用したことによって生じたいかなる損害についても、運営者は責任を負いません。</p>
      </section>
      <section>
        <h2>禁止事項</h2>
        <ul>
          <li>当サイトの運営を妨げる行為</li>
          <li>当サイトの内容を無断で複製・転載する行為</li>
          <li>法令または公序良俗に反する行為</li>
        </ul>
      </section>
      <section>
        <h2>規約の変更</h2>
        <p>本規約は、必要に応じて予告なく変更することがあります。変更後の規約は、当ページに掲載した時点から効力を生じます。</p>
      </section>
    </StaticPage>
  );
}
