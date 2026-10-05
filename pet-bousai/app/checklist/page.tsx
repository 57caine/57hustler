import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/checklist');
export const metadata = pageMetadata(meta);

const LISTS: { title: string; pages: string; items: string[] }[] = [
  {
    title: '優先順位1：動物の健康や命に関わるもの',
    pages: 'p.19',
    items: [
      '療法食、薬',
      'ペットフード、水（少なくとも5日分、できれば7日分以上）',
      'キャリーバッグやケージ（猫や小動物には避難時に欠かせないアイテム）',
      '予備の首輪、リード（伸びないもの）',
      'ペットシーツ',
      '排泄物の処理用具',
      'トイレ用品（猫の場合は使い慣れた猫砂、または使用済み猫砂の一部）',
      '食器',
    ],
  },
  {
    title: '優先順位2：情報',
    pages: 'p.19',
    items: [
      '飼い主の連絡先と、ペットに関した飼い主以外の緊急連絡先・預け先などの情報',
      'ペットの写真（印刷物とともに携帯電話などに画像を保存）',
      'ワクチン接種状況、既往症、投薬中の薬情報、検査結果、健康状態、かかりつけの動物病院などの情報',
    ],
  },
  {
    title: '優先順位3：ペット用品',
    pages: 'p.19',
    items: [
      'タオル、ブラシ',
      'ウェットタオルや清浄綿（目や耳の掃除など）',
      'ビニール袋（排泄物の処理など）',
      'お気に入りのおもちゃなど匂いがついた用品',
      '洗濯ネットなど（猫の場合は屋外での診療・保護の際に有用）',
      'ガムテープやマジック（ケージの補修、段ボールを用いたハウス作り、動物情報の掲示など）',
    ],
  },
  {
    title: '所有者明示（はぐれたときのために）',
    pages: 'p.18',
    items: [
      '首輪と迷子札',
      '犬：鑑札、狂犬病予防注射済票の装着',
      'マイクロチップ（装着した場合は飼い主情報・動物情報の登録）',
    ],
  },
  {
    title: '同行避難するとき',
    pages: 'p.22',
    items: [
      '犬：リードを付け、首輪の緩み・鑑札・狂犬病予防注射済票を確認',
      '犬：小型犬はリードをつけた上でキャリーバッグやケージに入れる',
      '猫：キャリーバッグやケージに入れ、扉が開かないようガムテープなどで固定',
      '避難用品を持って指定緊急避難場所へ向かう',
    ],
  },
  {
    title: '事前に確認しておくこと',
    pages: 'p.20〜21',
    items: [
      'ハザードマップで危険な場所を把握する',
      'ペットの受入れが可能な指定避難所を把握する',
      '避難所までの所要時間、通行できないときの迂回路を確認する',
      '避難所へペットを連れて行けない場合の避難先や預け先を想定する',
      '家族で連絡方法・集合場所、ペットの避難方法や役割分担を話し合う',
      '親戚や友人など、複数の一時預け先を探しておく',
    ],
  },
];

export default function ChecklistPage() {
  return (
    <Article
      meta={meta}
      lead={
        <>
          <p>
            環境省の「人とペットの災害対策ガイドライン＜一般飼い主編＞」に書かれている持ち物と準備を、チェックリストの形にまとめました。
            項目と優先順位はガイドラインの記載にそっています。印刷したり、画面を見ながら確認したりするのにお使いください。
          </p>
          <p className="text-sm text-gray-600">
            チェック欄はこの画面上で確認するためのもので、入力内容は保存・送信されません。
          </p>
        </>
      }
    >
      <OfficialInfo title="持ち物と準備のチェックリスト" cite={[{ id: 'owner-guide', pages: 'p.18〜22' }]}>
        {LISTS.map((list) => (
          <div key={list.title}>
            <h3>
              {list.title}
              <span className="ml-1 text-xs font-normal text-gray-500">（{list.pages}）</span>
            </h3>
            <ul className="!list-none !pl-0 space-y-1">
              {list.items.map((item) => (
                <li key={item}>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1.5 h-4 w-4 flex-none accent-brand-600" />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>「同行避難」の意味</h2>
        <p>
          ガイドラインでいう同行避難は、ペットと一緒に避難する行動を指す言葉で、避難所でペットを人と同じ部屋で飼養することを意味するものではありません（一般飼い主編 p.6）。
          また、自宅が安全な場合は、在宅避難（自宅内避難）も考えるよう書かれています（同 p.10）。
        </p>
        <h2>動物ごとの備え</h2>
        <ul>
          <li><Link href="/dog">犬の防災グッズ｜本当に必要なもの</Link></li>
          <li><Link href="/cat">猫の防災グッズ｜本当に必要なもの</Link></li>
          <li><Link href="/rabbit-guinea-pig">うさぎ・モルモットの防災グッズ</Link></li>
        </ul>
      </section>
    </Article>
  );
}
