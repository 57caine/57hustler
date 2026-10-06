import StaticPage from '@/components/StaticPage';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/privacy');
export const metadata = pageMetadata(meta);

export default function PrivacyPage() {
  return (
    <StaticPage title={meta.title}>
      <h2>個人情報の取得について</h2>
      <p>
        当サイトには、会員登録・お問い合わせフォーム・コメント欄などの、氏名やメールアドレスを入力する仕組みはありません。
        持ち物チェックリストのチェック欄も、入力内容を保存・送信しません。
      </p>

      <h2>アクセス解析について</h2>
      <p>
        当サイトでは、利用状況を把握するため、Google LLC のアクセス解析ツール「Google アナリティクス」を利用しています。
        Google アナリティクスは Cookie を使用してデータを収集しますが、個人を特定する情報は含みません。
        当サイトでは、ページの閲覧状況と、商品リンク（広告）がクリックされたこと（クリックされたページ・商品名・商品の分類・リンク先）を計測します。
      </p>
      <p>
        データの収集・処理の仕組みは
        <a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer">Google のポリシーと規約</a>
        をご覧ください。データの収集を無効にしたい場合は、
        <a href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank" rel="noopener noreferrer">Google アナリティクス オプトアウト アドオン</a>
        をご利用ください。
      </p>

      <h2>広告（楽天アフィリエイト）について</h2>
      <p>
        当サイトは楽天アフィリエイトを利用しています。商品リンクをクリックして楽天市場へ移動した後の情報の取り扱いは、
        <a href="https://privacy.rakuten.co.jp/" target="_blank" rel="noopener noreferrer">楽天グループ株式会社のプライバシーポリシー</a>
        をご確認ください。
      </p>

      <h2>改定</h2>
      <p>このポリシーは、必要に応じて内容を見直し、このページで公開します。</p>
      <p className="text-sm text-gray-500">制定：2026年10月5日</p>
    </StaticPage>
  );
}
