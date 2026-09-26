import type { Metadata } from 'next';
import StaticPage from '@/components/StaticPage';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'サイトについて',
  description: `${SITE_NAME}の掲載情報の取得方法と、アフィリエイトについて。`,
};

export default function AboutPage() {
  return (
    <StaticPage title="サイトについて" href="/about">
      <section>
        <h2>{SITE_NAME}とは</h2>
        <p>
          {SITE_NAME}は、エリアと旅のテーマ（週末旅行・温泉旅行・子連れ旅行・カップル旅行・一人旅）の組み合わせから、
          楽天トラベルに掲載されている宿泊施設を比較・案内するサイトです。
        </p>
      </section>
      <section>
        <h2>掲載情報の取得方法</h2>
        <ul>
          <li>宿泊施設の名称・写真・料金・口コミ評価・紹介文などは、楽天ウェブサービスの楽天トラベルAPIから自動で取得しています。</li>
          <li>「週末旅行」「一人旅」「温泉あり」「食事付き」は、楽天トラベルの空室検索の条件で該当した宿を掲載しています。</li>
          <li>「子連れ旅行」「カップル旅行」「客室」「景色」などは、施設紹介文に含まれるキーワードから判定した目安です。</li>
          <li>「おすすめポイント」は、取得した情報（口コミ評価・検索条件・最寄り駅など）をもとに記載しており、当サイト独自の評価ではありません。</li>
        </ul>
      </section>
      <section>
        <h2>アフィリエイトについて</h2>
        <p>
          当サイトは楽天アフィリエイトを利用しています。掲載している予約ボタン・リンクにはアフィリエイトリンクが含まれ、
          リンク先で予約が成立した場合、運営者が紹介料を受け取ることがあります。宿泊料金など、利用者の方のご負担が増えることはありません。
        </p>
      </section>
    </StaticPage>
  );
}
