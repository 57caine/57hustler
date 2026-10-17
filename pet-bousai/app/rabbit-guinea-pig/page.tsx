import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/rabbit-guinea-pig');
export const metadata = pageMetadata(meta);

export default function SmallAnimalPage() {
  return (
    <Article
      meta={meta}
      lead={
        <>
          <p>
            うさぎやモルモットは、犬や猫に比べて防災の情報が少なく、何を基準に備えればよいか分かりにくい動物です。
            環境省のガイドラインは犬・猫を中心に書かれていますが、持ち物の優先順位の中で、キャリーバッグやケージを「猫や小動物には避難時に欠かせないアイテム」としています。
          </p>
          <p>このページでは、ガイドラインの記載のうち小動物にも当てはまる備えを整理しました。</p>
        </>
      }
      products={<ProductSection groupIds={['small-carrier']} intro="通院などにも使える、うさぎ・モルモット向けのキャリーを掲載しています。" />}
    >
      <OfficialInfo title="キャリーやケージは優先順位1" cite={[{ id: 'owner-guide', pages: 'p.19' }]}>
        <p>
          ガイドラインは、持ち出す物の優先順位1（動物の健康や命に関わるもの）に、キャリーバッグやケージを含めています。そこでは、猫や小動物には避難時に欠かせないアイテムと書かれています。
        </p>
        <p>同じ優先順位1には、次の物も挙げられています。</p>
        <ul>
          <li>療法食、薬</li>
          <li>フード、水（少なくとも5日分、できれば7日分以上）</li>
          <li>ペットシーツ、排泄物の処理用具、トイレ用品</li>
          <li>食器</li>
        </ul>
      </OfficialInfo>

      <OfficialInfo title="ケージに慣らしておくこと" cite={[{ id: 'owner-guide', pages: 'p.5、p.17' }]}>
        <p>
          ガイドラインは、平常時からの適正な飼養が最も有効な災害対策になるとしています。犬・猫の項目では、ケージなどの中に入ることを嫌がらないよう日頃から慣らしておくことが挙げられています。
          小動物についての個別の記載はありませんが、キャリーに入って移動することに慣れておくことは、同じ考え方で準備できます。
        </p>
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>種類ごとの具体的な飼養管理は、動物病院に相談を</h2>
        <p>
          うさぎ・モルモットに合ったフードの種類や、避難中の温度の管理など、種類ごとの具体的な飼養管理については、ガイドラインに詳しい記載がありません。
          当サイトでは根拠を示せないため具体的な方法は記載していません。かかりつけの動物病院などに相談しておくことをおすすめします。
        </p>
        <h2>キャリーを選ぶときに確認したい点</h2>
        <ul>
          <li>扉の数と開き方（出し入れしやすいか）</li>
          <li>飼っている動物の大きさに合っているか（サイズ表記は商品ページで確認）</li>
          <li>持ち運べる重さか、肩掛けなど両手が空く持ち方ができるか</li>
          <li>通院などで普段から使えるか</li>
        </ul>
        <p>
          持ち物全体は<Link href="/checklist">同行避難の持ち物チェックリスト</Link>で確認できます。
        </p>
      </section>
    </Article>
  );
}
