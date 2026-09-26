import type { Metadata } from 'next';
import StaticPage from '@/components/StaticPage';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = { title: 'プライバシーポリシー' };

export default function PrivacyPage() {
  return (
    <StaticPage title="プライバシーポリシー" href="/privacy">
      <p>{SITE_NAME}（以下「当サイト」）における、利用者の情報の取り扱いについて定めます。</p>
      <section>
        <h2>アフィリエイトプログラムについて</h2>
        <p>
          当サイトは楽天アフィリエイトを利用しています。予約ボタン・リンクをクリックした際、成果の計測のために
          楽天グループ株式会社によってCookie等が使用されることがあります。取り扱いの詳細は、楽天グループ株式会社のプライバシーポリシーをご確認ください。
        </p>
      </section>
      <section>
        <h2>アクセス解析について</h2>
        <p>
          当サイトでは、サイトの改善のためにアクセス解析ツールを導入することがあります。
          アクセス解析ツールはCookieを使用してトラフィックデータを収集しますが、個人を特定する情報は含みません。
          Cookieはブラウザの設定により無効にできます。
        </p>
      </section>
      <section>
        <h2>お問い合わせでいただいた情報</h2>
        <p>お問い合わせの際にいただいたお名前・メールアドレス等は、お問い合わせへの回答のためにのみ使用し、法令に基づく場合を除き第三者に提供しません。</p>
      </section>
      <section>
        <h2>改定</h2>
        <p>本ポリシーは、必要に応じて予告なく改定することがあります。</p>
      </section>
    </StaticPage>
  );
}
