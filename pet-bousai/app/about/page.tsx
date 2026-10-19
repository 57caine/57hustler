import Link from 'next/link';
import StaticPage from '@/components/StaticPage';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';
import { AD_NOTICE, SITE_NAME } from '@/lib/site';

const meta = getPage('/about');
export const metadata = pageMetadata(meta);

export default function AboutPage() {
  return (
    <StaticPage title={meta.title}>
      <h2>運営者情報</h2>
      <ul>
        <li>サイト名：{SITE_NAME}</li>
        <li>運営目的：犬・猫・うさぎ・モルモットの飼い主向けに、公的資料にもとづく災害への備えと、普段から使える用品の情報をまとめること</li>
        <li>開設：2026年</li>
        <li>お問い合わせ：当サイトはお問い合わせフォームを設けていません</li>
      </ul>

      <h2 id="ads">広告について</h2>
      <p>{AD_NOTICE}</p>
      <p>
        当サイトは楽天グループ株式会社の「楽天アフィリエイト」に参加しています。各ページの「広告」と表示した欄の商品リンクから楽天市場で商品が購入されると、当サイトに報酬が支払われる場合があります。
        商品の掲載順は楽天市場の商品検索の標準順で、当サイトが商品を評価・順位付けしたものではありません。
      </p>
      <p>
        商品名・画像は楽天市場の商品検索APIから取得したものです。表示を簡潔にするため、商品名のうちショップの宣伝文（【】などの括弧書き）を省いて表示しています。
        価格・在庫・仕様は変わることがあるため当サイトでは表示しておらず、リンク先の商品ページでご確認ください。
      </p>

      <h2>掲載内容について</h2>
      <p>
        災害への備えに関する情報は、環境省の資料をもとに記載し、各ページに出典を示しています（<Link href="/sources">出典・参考資料</Link>）。
        当サイトの内容は一般的な備えの整理であり、個別の避難方法やペットの健康管理を指示するものではありません。
        避難所でのペットの扱いは自治体・避難所によって異なるため、お住まいの自治体の情報を確認してください。
        ペットの健康に関することは、かかりつけの動物病院にご相談ください。
      </p>
    </StaticPage>
  );
}
