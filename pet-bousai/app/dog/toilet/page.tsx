import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import CompareLink from '@/components/CompareLink';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/dog/toilet');
export const metadata = pageMetadata(meta);

export default function DogToiletPage() {
  return (
    <Article
      meta={meta}
      lead={
        <>
          <p>
            避難先では、犬の排泄の場所や後始末のしかたが、普段と大きく変わります。
            このページでは、環境省のガイドラインに書かれている排泄に関する備えを確認したうえで、ペットシーツ・処理袋・マナーポーチを選ぶときに確認したい点を整理しました。
          </p>
          <CompareLink label="楽天市場のトイレ用品の比較表を見る" />
        </>
      }
      products={
        <ProductSection
          groupIds={['dog-sheet', 'dog-waste-bag', 'dog-manner-pouch']}
          variant="table"
          intro="普段の散歩や留守番でも使えるトイレ用品を掲載しています。"
        />
      }
    >
      <OfficialInfo title="ガイドラインに書かれている排泄の備え" cite={[{ id: 'owner-guide', pages: 'p.4、p.17、p.19' }]}>
        <ul>
          <li>平常時の対策として、犬が決められた場所で排泄ができるようにすることが挙げられています。</li>
          <li>持ち出す物の優先順位1に、ペットシーツ、排泄物の処理用具、トイレ用品が含まれています。</li>
          <li>優先順位3には、排泄物の処理などに使えるビニール袋が挙げられています。</li>
        </ul>
        <p>
          過去の災害で起きた問題として、「犬がペットシーツに排尿、排便せず、苦労した」「糞の放置や毛の飛散などが原因で他の避難者とトラブルとなった」例が紹介されています。
        </p>
      </OfficialInfo>

      <OfficialInfo title="避難所ではルールに従って飼い主が世話をする" cite={[{ id: 'owner-guide', pages: 'p.22' }]}>
        <p>
          ガイドラインは、避難所では各避難所が定めたルールに従い、飼い主が責任を持って世話をすることとしています。
          排泄させる場所や排泄物の捨て方も、避難所のルールを確認してください。
        </p>
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>ペットシーツで排泄できるか、普段のうちに確認する</h2>
        <p>
          ガイドラインには、犬がペットシーツで排泄せずに苦労した例が紹介されています。
          用品をそろえるだけでなく、ペットシーツの上で排泄できるか、普段のうちに試しておくと備えになります。
        </p>

        <h2>ペットシーツを選ぶときに確認したい点</h2>
        <ul>
          <li>犬の大きさに合うサイズ（レギュラー・ワイド等の表記と寸法は商品ページで確認）</li>
          <li>普段使っているものと同じ種類か（使い慣れたものの予備を持つと、犬が戸惑いにくくなります）</li>
          <li>持ち出し用に小分けにできる枚数か</li>
        </ul>

        <h2>処理袋・マナーポーチを選ぶときに確認したい点</h2>
        <ul>
          <li>袋の大きさと枚数（数日分を想定して用意します）</li>
          <li>しっかり口を縛れるか、臭いが漏れにくいとうたっているか（性能は商品ページの記載で確認）</li>
          <li>マナーポーチは、リードや持ち出し用のバッグに取り付けられるか</li>
        </ul>
        <p>
          ほかの持ち物は<Link href="/dog/checklist">犬の持ち出し用品チェックリスト</Link>で確認できます。
        </p>
      </section>
    </Article>
  );
}
