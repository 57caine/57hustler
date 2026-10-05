import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/cat');
export const metadata = pageMetadata(meta);

export default function CatPage() {
  return (
    <Article
      meta={meta}
      lead={
        <>
          <p>
            猫は、驚くと物陰に隠れて出てこなくなったり、外に出ると戻ってこなかったりと、避難のときに犬とは違う難しさがあります。
            環境省のガイドラインにも、地震におびえた猫が物陰に隠れ、呼んでもなかなか出てこなかったという例が載っています（一般飼い主編 p.10）。
          </p>
          <p>このページでは、ガイドラインの記載のうち、猫に関わる備えを整理しました。</p>
        </>
      }
      products={<ProductSection groupIds={['cat-id-tag', 'cat-net']} intro="通院や普段の生活でも使える用品を中心に掲載しています。" />}
    >
      <OfficialInfo title="普段のしつけと健康管理（猫）" cite={[{ id: 'owner-guide', pages: 'p.17' }]}>
        <p>ガイドラインが猫について挙げている平常時の対策は次のとおりです。</p>
        <ul>
          <li>ケージなどの中に入ることを嫌がらないよう、日頃から慣らしておく</li>
          <li>人や他の動物を怖がらないように慣らしておく</li>
          <li>決められた場所で排泄ができるようにする</li>
          <li>各種ワクチンの接種、寄生虫の駆除、不妊去勢措置</li>
          <li>できる限り室内で飼養する（放し飼いだと災害時に行方不明になることが多い、とされています）</li>
        </ul>
      </OfficialInfo>

      <OfficialInfo title="首輪・迷子札とマイクロチップ" cite={[{ id: 'owner-guide', pages: 'p.18' }]}>
        <p>ガイドラインは、猫の所有者明示として「首輪と迷子札」と「マイクロチップ」を挙げています。</p>
        <ul>
          <li>
            猫の首輪は、ひっかかりを避けるために力が加わると外れるタイプがよいと言われる一方で、そのタイプを使う場合はマイクロチップの装着が強く推奨されています。
          </li>
          <li>マイクロチップを装着したら、日本獣医師会などへの飼い主情報・動物情報の登録が必要です。</li>
        </ul>
      </OfficialInfo>

      <OfficialInfo title="猫に関わる持ち物" cite={[{ id: 'owner-guide', pages: 'p.19' }]}>
        <p>持ち出す物の優先順位の例のうち、猫について特に書かれているものは次のとおりです。</p>
        <ul>
          <li>キャリーバッグやケージ（猫や小動物には避難時に欠かせないアイテム、とされています）</li>
          <li>トイレ用品（猫の場合は使い慣れた猫砂、または使用済み猫砂の一部）</li>
          <li>洗濯ネットなど（猫の場合は屋外での診療や保護の際に有用、とされています）</li>
        </ul>
        <p>
          このほか、療法食・薬、フードと水（少なくとも5日分、できれば7日分以上）、食器、ペットの写真や健康情報なども優先順位の高い物として挙げられています。
          全体は<Link href="/checklist">同行避難の持ち物チェックリスト</Link>で確認できます。
        </p>
      </OfficialInfo>

      <OfficialInfo title="同行避難のときの準備例（猫）" cite={[{ id: 'owner-guide', pages: 'p.6、p.22' }]}>
        <ul>
          <li>キャリーバッグやケージに入れる</li>
          <li>キャリーバッグなどの扉が開いて猫が逃げ出さないよう、ガムテープなどで固定するとよい</li>
          <li>避難用品を持って指定緊急避難場所へ向かう</li>
        </ul>
        <p>
          「同行避難」は一緒に避難する行動を指す言葉で、避難所で人と同じ部屋で過ごせることを意味するものではありません。
        </p>
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>キャリーとトイレは個別のページで</h2>
        <p>
          キャリー・ケージの選び方は<Link href="/cat/carrier">猫の避難用キャリー・ケージの選び方</Link>、
          トイレの備えは<Link href="/cat/toilet">猫の避難用ポータブルトイレ</Link>にまとめています。
        </p>
      </section>
    </Article>
  );
}
