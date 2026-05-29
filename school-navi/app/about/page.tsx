import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: 'スクールナビの編集ポリシー・掲載基準・運営方針について説明します。',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-slate-700">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">このサイトについて</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">このサイトについて</h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">スクールナビとは</h2>
          <p className="text-sm">
            スクールナビ（nsplot.com）は、プログラミングスクールを検討している方に向けて、客観的な情報を提供する比較メディアです。
            編集部が各スクールの公式情報・受講者の声・カリキュラム内容を独自に調査・検証し、掲載しています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">掲載基準・選定方法</h2>
          <p className="text-sm mb-3">掲載スクールは以下の基準をもとに選定しています。</p>
          <ul className="text-sm space-y-2 list-disc pl-5">
            <li>実績のある運営会社による正規のプログラミングスクールであること</li>
            <li>カリキュラム・料金・サポート体制が公開されていること</li>
            <li>受講者の評判・口コミが一定数確認できること</li>
            <li>反社会的な活動や法令違反が確認されていないこと</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">掲載順位について</h2>
          <p className="text-sm">
            スクールの掲載順位は、広告費用や掲載料によって変動するものではありません。
            編集部が料金・転職実績・カリキュラム内容・受講者満足度・サポート体制を総合的に評価して決定しています。
            ただし、本サイトはアフィリエイトプログラムに参加しており、一部リンクからの収益が運営費用に充てられています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">アフィリエイト・広告について</h2>
          <p className="text-sm">
            本サイトはA8.net等のアフィリエイトプログラムに参加しています。掲載スクールへのリンクから申し込みが行われた場合、
            当サイトに紹介料が発生することがあります。この仕組みはサイトの維持・更新費用に充てられます。
            アフィリエイト収益の有無は掲載内容・評価の客観性に影響を与えません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">情報の正確性について</h2>
          <p className="text-sm">
            掲載情報は定期的に更新していますが、スクールの料金・コース内容・転職支援の内容は変更される場合があります。
            最新の情報は必ず各スクールの公式サイトでご確認ください。
            掲載情報に誤りがある場合はお知らせいただけますと幸いです。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">お問い合わせ</h2>
          <p className="text-sm">
            掲載内容に関するご指摘・ご質問は、サイト下部のフッターよりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
