import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import ProductSection from '@/components/ProductSection';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/bousai-set');
export const metadata = pageMetadata(meta);

/**
 * ガイドライン（一般飼い主編 p.19）の持ち物と、市販セットとの関係。
 * 特定の商品の内容物を断定しないよう、「物の性質上、セットでは用意しにくいか」で分類している。
 */
const ROWS: { item: string; priority: string; set: string }[] = [
  { item: '療法食、薬', priority: '1', set: 'セットでは用意しにくい（ペットごとに異なるため、かかりつけの動物病院と相談して用意）' },
  { item: 'ペットフード、水（少なくとも5日分、できれば7日分以上）', priority: '1', set: '含まれるセットもあるが、普段食べているフードかどうか・日数分あるかは別に確認が必要' },
  { item: 'キャリーバッグやケージ', priority: '1', set: '含まれるセットもあるが、ペットの体の大きさに合うかの確認が必要' },
  { item: '予備の首輪、リード（伸びないもの）', priority: '1', set: '含まれるセットもあるが、サイズが合うかの確認が必要' },
  { item: 'ペットシーツ、排泄物の処理用具、トイレ用品', priority: '1', set: 'セットに含まれる場合がある物（内容物は商品ページで確認）。猫の場合は使い慣れた猫砂を別に用意' },
  { item: '食器', priority: '1', set: 'セットに含まれる場合がある物（内容物は商品ページで確認）' },
  { item: '飼い主の連絡先、緊急連絡先・預け先などの情報', priority: '2', set: 'セットでは用意できない（自分で記入・準備）' },
  { item: 'ペットの写真', priority: '2', set: 'セットでは用意できない（印刷と携帯電話への保存）' },
  { item: 'ワクチン接種状況、既往症、投薬中の薬、かかりつけの動物病院などの情報', priority: '2', set: 'セットでは用意できない' },
  { item: 'タオル、ブラシ、ウェットタオル、ビニール袋、ガムテープなど', priority: '3', set: 'セットに含まれる場合がある物。家にある物でも代用できる' },
  { item: 'お気に入りのおもちゃなど匂いがついた用品', priority: '3', set: 'セットでは用意できない（普段使っている物）' },
];

export default function BousaiSetPage() {
  return (
    <Article
      meta={meta}
      lead={
        <>
          <p>
            ペット用の防災セットは、必要そうな物がまとめて手に入る便利さがある一方で、中身は商品ごとに異なり、そのペットに合った物かどうかは個別に確認が必要です。
          </p>
          <p>
            このページでは、環境省のガイドラインにある持ち物の優先順位と照らし合わせて、セットで用意できる物と、セットでは用意しにくい物を整理しました。
            特定の商品の中身を評価したものではありません。
          </p>
        </>
      }
      products={
        <ProductSection
          groupIds={['pet-set']}
          intro="セットの内容物は商品ごとに異なります。購入前に、この一覧と商品ページの内容物を照らし合わせて確認してください。"
        />
      }
    >
      <OfficialInfo title="ガイドラインの持ち物とセットの関係" cite={[{ id: 'owner-guide', pages: 'p.19' }]}>
        <p>
          ガイドラインは、持ち出す物を優先順位1（動物の健康や命に関わるもの）、優先順位2（情報）、優先順位3（ペット用品）に分けて例示しています。
          下の一覧の「持ち物」と「優先順位」はガイドラインの記載、「セットとの関係」は物の性質から当サイトが整理したものです。
        </p>
      </OfficialInfo>

      <ul className="mt-2 space-y-3" aria-label="ガイドラインの持ち物とセットの関係">
        {ROWS.map((r) => (
          <li key={r.item} className="rounded-lg border border-gray-200 px-4 py-3">
            <p className="flex items-start gap-2">
              <span className="mt-0.5 flex-none rounded bg-brand-100 px-1.5 py-0.5 text-xs font-bold text-brand-800">優先順位{r.priority}</span>
              <span className="font-bold text-[15px] leading-snug">{r.item}</span>
            </p>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-xs text-gray-500">セットとの関係（当サイトの整理）：</span>
              {r.set}
            </p>
          </li>
        ))}
      </ul>

      <section className="prose-body text-[15px]">
        <h2>セットが向いている場合、向いていない場合</h2>
        <p>
          一覧のとおり、優先順位2の「情報」や、療法食・薬、使い慣れたフードや猫砂は、どのセットにも代わりができません。
          一方で、トイレ用品や食器、タオルなどの「物」は、セットでまとめて用意できる場合があります。
        </p>
        <ul>
          <li>何から用意すればよいか分からず、まず一通りそろえたい場合は、セットを土台にして足りない物を足す方法があります。</li>
          <li>すでに散歩用品や通院用のキャリーがある場合は、持っている物の予備を用意し、足りない物だけを個別に買う方法もあります。</li>
        </ul>
        <p>
          どちらの場合も、<Link href="/checklist">同行避難の持ち物チェックリスト</Link>で抜けている物がないかを確認できます。
        </p>
      </section>
    </Article>
  );
}
