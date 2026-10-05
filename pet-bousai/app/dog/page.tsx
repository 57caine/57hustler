import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/dog');
export const metadata = pageMetadata(meta);

export default function DogPage() {
  return (
    <Article
      meta={meta}
      lead={
        <>
          <p>
            犬の防災グッズは、種類が多く、どこから手をつけるか迷いやすい分野です。このページでは、環境省の「人とペットの災害対策ガイドライン＜一般飼い主編＞」に書かれている備えを、優先順位の順に整理しました。
          </p>
          <p>
            用品をそろえる前に、ガイドラインが「最も有効な災害対策」として挙げている普段のしつけと健康管理から確認していきます。
          </p>
        </>
      }
      products={
        <ProductSection
          groupIds={['dog-id-tag', 'water-bottle', 'dog-manner-pouch']}
          intro="散歩や外出でも使える用品を中心に掲載しています。"
        />
      }
    >
      <OfficialInfo title="普段のしつけと健康管理が、備えの土台" cite={[{ id: 'owner-guide', pages: 'p.5、p.17' }]}>
        <p>
          ガイドラインは、健康面やしつけを含めた平常時からの適正な飼養が、最も有効な災害対策になるとしています。犬の場合に挙げられている主な項目は次のとおりです。
        </p>
        <ul>
          <li>「待て」「おいで」「お座り」「伏せ」などの基本的なしつけ</li>
          <li>ケージなどの中に入ることを嫌がらないよう、日頃から慣らしておく</li>
          <li>不必要に吠えないようにしつける</li>
          <li>人や他の動物を怖がったり、攻撃的にならないように慣らしておく</li>
          <li>決められた場所で排泄ができるようにする</li>
          <li>狂犬病予防接種（義務）に加え、各種ワクチンを接種する</li>
          <li>寄生虫の予防・駆除、身体を清潔に保つ、不妊去勢措置</li>
        </ul>
      </OfficialInfo>

      <OfficialInfo title="はぐれたときのための所有者明示" cite={[{ id: 'owner-guide', pages: 'p.18' }]}>
        <p>ガイドラインは、犬の所有者明示として次の3つを挙げています。</p>
        <ul>
          <li>首輪と迷子札</li>
          <li>鑑札と狂犬病予防注射済票（狂犬病予防法により装着が義務づけられています）</li>
          <li>マイクロチップ（装着したら、日本獣医師会などへの飼い主情報・動物情報の登録が必要です）</li>
        </ul>
      </OfficialInfo>

      <OfficialInfo title="持ち出す物の優先順位" cite={[{ id: 'owner-guide', pages: 'p.19' }]}>
        <p>ガイドラインは、ペット用の備蓄品と持ち出す際の優先順位の例を、次の3段階で示しています。</p>
        <h3>優先順位1：動物の健康や命に関わるもの</h3>
        <ul>
          <li>療法食、薬</li>
          <li>ペットフード、水（少なくとも5日分、できれば7日分以上）</li>
          <li>キャリーバッグやケージ</li>
          <li>予備の首輪、リード（伸びないもの）</li>
          <li>ペットシーツ、排泄物の処理用具、トイレ用品</li>
          <li>食器</li>
        </ul>
        <h3>優先順位2：情報</h3>
        <ul>
          <li>飼い主の連絡先と、飼い主以外の緊急連絡先・預け先などの情報</li>
          <li>ペットの写真（印刷物と、携帯電話などへの画像保存）</li>
          <li>ワクチン接種状況、既往症、投薬中の薬、かかりつけの動物病院などの情報</li>
        </ul>
        <h3>優先順位3：ペット用品</h3>
        <ul>
          <li>タオル、ブラシ、ウェットタオルや清浄綿</li>
          <li>ビニール袋、お気に入りのおもちゃなど匂いがついた用品</li>
          <li>ガムテープやマジック（ケージの補修や動物情報の掲示などに使えます）</li>
        </ul>
        <p>
          持ち物を一覧で確認したい場合は、<Link href="/checklist">同行避難の持ち物チェックリスト</Link>にまとめています。
        </p>
      </OfficialInfo>

      <OfficialInfo title="同行避難のときの準備例（犬）" cite={[{ id: 'owner-guide', pages: 'p.6、p.22' }]}>
        <ul>
          <li>リードを付け、首輪が緩んでいないか、鑑札・狂犬病予防注射済票を装着しているかを確認する</li>
          <li>小型犬は、リードをつけた上でキャリーバッグやケージに入れる</li>
          <li>避難用品を持って指定緊急避難場所へ向かう</li>
        </ul>
        <p>
          なお、ガイドラインでいう「同行避難」は、ペットと一緒に避難する行動を指す言葉で、避難所でペットを人と同じ部屋で飼養することを意味するものではありません。
        </p>
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>普段から使える用品を、そのまま備えにする</h2>
        <p>
          ガイドラインの持ち物には、迷子札、予備の首輪・リード、排泄物の処理用具など、散歩や外出で普段から使う物が多く含まれています。
          防災専用の物を別に買い足すより、普段使っている物の予備を用意しておくほうが、使い慣れた状態で持ち出せます。
        </p>
        <p>
          キャリーやケージについては<Link href="/dog/carrier">犬の避難用キャリーの選び方</Link>、
          市販のセットについては<Link href="/bousai-set">ペット防災セットは買うべき？</Link>で整理しています。
        </p>
      </section>
    </Article>
  );
}
