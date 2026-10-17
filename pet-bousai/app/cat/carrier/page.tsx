import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/cat/carrier');
export const metadata = pageMetadata(meta);

export default function CatCarrierPage() {
  return (
    <Article
      meta={meta}
      lead={
        <p>
          猫の避難では、キャリーに入れて移動することが基本になります。
          このページでは、環境省のガイドラインにある猫の同行避難の準備例と、キャリー・ケージを選ぶときに確認したい点を整理しました。
        </p>
      }
      products={<ProductSection groupIds={['cat-carrier', 'cat-cage']} intro="通院や来客時にも使えるキャリー・ケージを掲載しています。" />}
    >
      <OfficialInfo title="ガイドラインに書かれていること" cite={[{ id: 'owner-guide', pages: 'p.6〜7、p.11、p.17、p.19、p.22' }]}>
        <ul>
          <li>キャリーバッグやケージは、猫や小動物には避難時に欠かせないアイテムとされています（持ち出す物の優先順位1）。</li>
          <li>同行避難の準備例として、猫はキャリーバッグやケージに入れ、扉が開いて逃げ出さないようにガムテープなどで固定するとよい、とされています。</li>
          <li>平常時の対策として、ケージなどの中に入ることを嫌がらないよう、日頃から慣らしておくことが挙げられています。</li>
        </ul>
        <p>
          避難先での飼養のしかたは避難所によって異なり、ガイドラインには、人と同じ部屋で過ごす例のほか、ペット用の部屋に分ける例、屋外で飼養する例、車やテントを活用する例が示されています。
        </p>
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>キャリーとケージの違い</h2>
        <p>
          キャリーは移動のための入れ物、ケージは避難先での居場所として使う物です。避難先でキャリーの中だけで長く過ごすことになる場合もあるため、
          折りたためるケージを別に用意しておく考え方もあります。どちらが必要になるかは、避難先の環境によって変わります。
        </p>

        <h2>キャリーを選ぶときに確認したい点</h2>
        <ul>
          <li>扉の開き方（上開き・前開きなど）と、留め具がしっかりしているか</li>
          <li>猫の体の大きさに合っているか（サイズは商品ページで確認）</li>
          <li>中が見えるか、空気の通り道があるか</li>
          <li>多頭飼育の場合、全頭分を一度に持ち出せるか（ガイドライン p.11 では、多頭飼育の場合は全てのペットを連れて逃げられるよう準備しておくよう書かれています）</li>
          <li>普段の通院で使い、中に入ることに慣れておけるか</li>
        </ul>

        <h2>ケージを選ぶときに確認したい点</h2>
        <ul>
          <li>たたんだときの大きさと重さ（キャリーと一緒に持ち出せるか）</li>
          <li>中にトイレと寝る場所を置ける広さがあるか</li>
          <li>扉やファスナーの留め方</li>
        </ul>
        <p>
          トイレの備えは<Link href="/cat/toilet">猫の避難用ポータブルトイレ</Link>にまとめています。
        </p>
      </section>
    </Article>
  );
}
