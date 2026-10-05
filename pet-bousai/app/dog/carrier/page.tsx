import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/dog/carrier');
export const metadata = pageMetadata(meta);

export default function DogCarrierPage() {
  return (
    <Article
      meta={meta}
      lead={
        <p>
          犬の避難用キャリーは、リュック型・肩掛け型・ハード型（クレート）など形がさまざまです。
          このページでは、環境省のガイドラインにある同行避難の準備例を確認したうえで、購入前に確認したい点を整理しました。
        </p>
      }
      products={<ProductSection groupIds={['dog-carrier']} intro="通院や外出にも使えるキャリーを掲載しています。" />}
    >
      <OfficialInfo title="ガイドラインでのキャリー・ケージの位置づけ" cite={[{ id: 'owner-guide', pages: 'p.13、p.17、p.19、p.22' }]}>
        <ul>
          <li>キャリーバッグやケージは、持ち出す物の優先順位1（動物の健康や命に関わるもの）に含まれています。</li>
          <li>同行避難の準備例では、小型犬はリードをつけた上でキャリーバッグやケージに入れる、とされています。</li>
          <li>平常時の対策として、ケージなどの中に入ることを嫌がらないよう、日頃から慣らしておくことが挙げられています。</li>
        </ul>
        <p>
          ガイドラインには、ケージを持っていなかったために避難先でペットが落ち着かず、飼い主が近くにいないと吠えてしまった、という例も紹介されています。
        </p>
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>形ごとの特徴</h2>
        <h3>リュック型</h3>
        <p>両手が空くため、他の避難用品と一緒に持ち出しやすい形です。背負ったときの重さは、犬の体重に本体の重さが加わります。</p>
        <h3>ハード型（クレート）</h3>
        <p>形が崩れにくく、避難先でそのまま犬の居場所として使える形です。持ち運びは手提げが中心になります。</p>
        <h3>折りたたみ・ソフト型</h3>
        <p>収納しやすい一方、形の保ち方や扉の留め方は製品によって異なります。</p>

        <h2>購入前に確認したい点</h2>
        <ul>
          <li>犬の体重・体の大きさに合っているか（耐荷重とサイズは商品ページで確認）</li>
          <li>実際に持ち運べる重さか（犬の体重＋本体の重さ）</li>
          <li>扉やファスナーがしっかり閉まり、留め具があるか</li>
          <li>中が見えるか、空気の通り道があるか</li>
          <li>普段の通院や外出で使えるか（使い慣れておくことにつながります）</li>
        </ul>
        <p>
          中型犬・大型犬は、キャリーで運ぶことが難しい場合もあります。その場合も、伸びないリードと予備の首輪は優先順位1の持ち物として挙げられています（
          <Link href="/checklist">持ち物チェックリスト</Link>参照）。
        </p>
      </section>
    </Article>
  );
}
