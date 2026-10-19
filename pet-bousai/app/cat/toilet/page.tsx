import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/cat/toilet');
export const metadata = pageMetadata(meta);

export default function CatToiletPage() {
  return (
    <Article
      meta={meta}
      lead={
        <p>
          避難先では、普段のトイレをそのまま持ち出せないことがあります。
          このページでは、環境省のガイドラインに書かれているトイレの備えと、折りたたみ式のトイレを用意する場合に確認したい点を整理しました。
        </p>
      }
      products={<ProductSection groupIds={['cat-toilet']} intro="旅行や来客時にも使える、折りたためる猫用トイレを掲載しています。" />}
    >
      <OfficialInfo title="ガイドラインに書かれているトイレの備え" cite={[{ id: 'owner-guide', pages: 'p.4、p.17、p.19' }]}>
        <ul>
          <li>持ち出す物の優先順位1に、ペットシーツ、排泄物の処理用具、トイレ用品が含まれています。</li>
          <li>トイレ用品について、猫の場合は「使い慣れた猫砂、または使用済み猫砂の一部」と書かれています。</li>
          <li>平常時の対策として、決められた場所で排泄ができるようにすることが挙げられています。</li>
          <li>優先順位3には、排泄物の処理などに使えるビニール袋も挙げられています。</li>
        </ul>
        <p>
          また、過去の災害で起きた問題として、糞の放置などが原因で他の避難者とトラブルになった例が紹介されています。
        </p>
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>折りたたみ式トイレを用意するときに確認したい点</h2>
        <ul>
          <li>猫の体の大きさに対して、広さと縁の高さが足りているか</li>
          <li>防水かどうか、汚れたときに拭いたり洗ったりできるか</li>
          <li>たたんだときの大きさ（キャリーやケージと一緒に持ち出せるか）</li>
          <li>中に入れる猫砂やシーツを別に用意する必要があるか</li>
        </ul>
        <h2>普段から一度使ってみる</h2>
        <p>
          ガイドラインは決められた場所で排泄できるようにすることを挙げています。折りたたみ式のトイレを用意するなら、普段のうちに一度置いてみて、猫が使えるかを確認しておくと、いざというときの不安を減らせます。
          使い慣れた猫砂を少し持ち出せるようにしておくことも、ガイドラインの記載にそった備えです。
        </p>
        <p>
          キャリー・ケージについては<Link href="/cat/carrier">猫の避難用キャリー・ケージの選び方</Link>をご覧ください。
        </p>
      </section>
    </Article>
  );
}
