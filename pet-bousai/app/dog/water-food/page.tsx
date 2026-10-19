import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import CompareLink from '@/components/CompareLink';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/dog/water-food');
export const metadata = pageMetadata(meta);

export default function DogWaterFoodPage() {
  return (
    <Article
      meta={meta}
      lead={
        <>
          <p>
            避難先では、ペット用の水やフードがすぐに手に入るとは限りません。
            このページでは、環境省のガイドラインに書かれている水・フード・食器の備えを確認したうえで、持ち運び用の給水器と折りたたみ食器を選ぶときに確認したい点を整理しました。
          </p>
          <CompareLink label="楽天市場の給水器・食器の比較表を見る" />
        </>
      }
      products={
        <ProductSection
          groupIds={['water-bottle', 'dog-bowl']}
          variant="table"
          intro="散歩や外出にも使える給水器・食器を掲載しています。"
        />
      }
    >
      <OfficialInfo title="水・フード・食器はすべて優先順位1" cite={[{ id: 'owner-guide', pages: 'p.4、p.13、p.19' }]}>
        <p>ガイドラインは、持ち出す物の優先順位1（動物の健康や命に関わるもの）に、次の物を挙げています。</p>
        <ul>
          <li>療法食、薬</li>
          <li>ペットフード、水（少なくとも5日分、できれば7日分以上）</li>
          <li>食器</li>
        </ul>
        <p>
          また、支援物資が届くまでに5日程度かかる場合があることや、過去の災害で「人の支援物資はあるが、ペットフードの支援はなかった」「救援物資のペットフードを食べなくて困った」といった問題があったことが紹介されています。
        </p>
      </OfficialInfo>

      <OfficialInfo title="車の中で過ごす場合の飲み水" cite={[{ id: 'owner-guide', pages: 'p.22' }]}>
        <p>
          ガイドラインは、ペットだけを車中に残すときは車内の温度に常に注意し、十分な飲み水を用意しておくこととしています。
        </p>
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>フードと水は「普段のもの」を多めに</h2>
        <p>
          ガイドラインの例のとおり、慣れないフードを食べない場合があります。普段食べているフードを多めに買い置きして古いものから使う方法なら、特別な非常食を用意しなくても日数分を確保できます。
          療法食や薬が必要な場合の量や保管方法は、かかりつけの動物病院に相談してください。
        </p>

        <h2>携帯給水器を選ぶときに確認したい点</h2>
        <ul>
          <li>容量（散歩用の小さなものは、避難時の数日分の水の保管には足りません。保管用の水は別に用意します）</li>
          <li>片手で給水・水を戻せるか、閉めたときに水が漏れにくい構造か</li>
          <li>分解して洗えるか</li>
          <li>ペットボトルに取り付けるノズル型か、ボトル一体型か</li>
        </ul>

        <h2>折りたたみ食器を選ぶときに確認したい点</h2>
        <ul>
          <li>容量が犬の1回の食事量・飲む量に合っているか（容量は商品ページで確認）</li>
          <li>たたんだときの大きさと、持ち歩くときの留め具（カラビナなど）の有無</li>
          <li>洗いやすさ（水が限られる避難先では、汚れが落としやすいかも大事です）</li>
          <li>水用とフード用で2つ用意するか</li>
        </ul>
        <p>
          ほかの持ち物は<Link href="/dog/checklist">犬の持ち出し用品チェックリスト</Link>で確認できます。
        </p>
      </section>
    </Article>
  );
}
