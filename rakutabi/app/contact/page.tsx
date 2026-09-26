import type { Metadata } from 'next';
import StaticPage from '@/components/StaticPage';

export const metadata: Metadata = { title: 'お問い合わせ' };

// 問い合わせ先（メールアドレス等）はオーナー確認待ち。決まったらここに記載する
export default function ContactPage() {
  return (
    <StaticPage title="お問い合わせ" href="/contact">
      <p>当サイトへのお問い合わせ窓口は、現在準備中です。</p>
      <section>
        <h2>ご予約に関するお問い合わせ</h2>
        <p>
          宿泊の予約内容・変更・キャンセルについては、当サイトではお答えできません。
          予約した楽天トラベル、または宿泊施設へ直接お問い合わせください。
        </p>
      </section>
    </StaticPage>
  );
}
