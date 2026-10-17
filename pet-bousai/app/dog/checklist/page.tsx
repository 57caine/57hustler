import Link from 'next/link';
import Article from '@/components/Article';
import OfficialInfo from '@/components/OfficialInfo';
import { getPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';

const meta = getPage('/dog/checklist');
export const metadata = pageMetadata(meta);

/** 項目と優先順位は環境省「一般飼い主編」の記載（犬に関係するもの）。link は当サイトの関連ページ */
const LISTS: { title: string; pages: string; items: { text: string; link?: { href: string; label: string } }[] }[] = [
  {
    title: '優先順位1：動物の健康や命に関わるもの',
    pages: 'p.19',
    items: [
      { text: '療法食、薬' },
      { text: 'ペットフード、水（少なくとも5日分、できれば7日分以上）', link: { href: '/dog/water-food', label: '給水器・食器' } },
      { text: 'キャリーバッグやケージ', link: { href: '/dog/evacuation-carrier', label: '避難用キャリー' } },
      { text: '予備の首輪、リード（伸びないもの）' },
      { text: 'ペットシーツ', link: { href: '/dog/toilet', label: 'トイレ用品' } },
      { text: '排泄物の処理用具', link: { href: '/dog/toilet', label: 'トイレ用品' } },
      { text: 'トイレ用品', link: { href: '/dog/toilet', label: 'トイレ用品' } },
      { text: '食器', link: { href: '/dog/water-food', label: '給水器・食器' } },
    ],
  },
  {
    title: '優先順位2：情報',
    pages: 'p.19',
    items: [
      { text: '飼い主の連絡先と、ペットに関した飼い主以外の緊急連絡先・預け先などの情報' },
      { text: 'ペットの写真（印刷物とともに携帯電話などに画像を保存）' },
      { text: 'ワクチン接種状況、既往症、投薬中の薬情報、検査結果、健康状態、かかりつけの動物病院などの情報' },
    ],
  },
  {
    title: '優先順位3：ペット用品',
    pages: 'p.19',
    items: [
      { text: 'タオル、ブラシ' },
      { text: 'ウェットタオルや清浄綿（目や耳の掃除など）' },
      { text: 'ビニール袋（排泄物の処理など）' },
      { text: 'お気に入りのおもちゃなど匂いがついた用品' },
      { text: 'ガムテープやマジック（ケージの補修、動物情報の掲示など）' },
    ],
  },
  {
    title: '所有者明示（犬）',
    pages: 'p.18',
    items: [
      { text: '首輪と迷子札' },
      { text: '鑑札、狂犬病予防注射済票の装着（狂犬病予防法により義務）' },
      { text: 'マイクロチップ（装着した場合は飼い主情報・動物情報の登録）' },
    ],
  },
  {
    title: '同行避難するとき（犬）',
    pages: 'p.22',
    items: [
      { text: 'リードを付け、首輪が緩んでいないか、鑑札・狂犬病予防注射済票を装着しているかを確認' },
      { text: '小型犬は、リードをつけた上でキャリーバッグやケージに入れる' },
      { text: '避難用品を持って指定緊急避難場所へ向かう' },
    ],
  },
  {
    title: '事前に確認しておくこと',
    pages: 'p.20〜21',
    items: [
      { text: 'ハザードマップで危険な場所を把握する' },
      { text: 'ペットの受入れが可能な指定避難所を把握する' },
      { text: '避難所までの所要時間、通行できないときの迂回路を確認する' },
      { text: '避難所へペットを連れて行けない場合の避難先や預け先を想定する' },
      { text: '家族で連絡方法・集合場所、ペットの避難方法や役割分担を話し合う' },
      { text: '親戚や友人など、複数の一時預け先を探しておく' },
    ],
  },
];

export default function DogChecklistPage() {
  return (
    <Article
      meta={meta}
      lead={
        <>
          <p>
            環境省の「人とペットの災害対策ガイドライン＜一般飼い主編＞」に書かれている持ち物と準備のうち、犬に関係するものをチェックリストにまとめました。
            項目と優先順位はガイドラインの記載にそっています。
          </p>
          <p className="text-sm text-gray-600">チェック欄はこの画面上で確認するためのもので、入力内容は保存・送信されません。</p>
        </>
      }
    >
      <OfficialInfo title="犬の持ち出し用品と準備のチェックリスト" cite={[{ id: 'owner-guide', pages: 'p.18〜22' }]}>
        {LISTS.map((list) => (
          <div key={list.title}>
            <h3>
              {list.title}
              <span className="ml-1 text-xs font-normal text-gray-500">（{list.pages}）</span>
            </h3>
            <ul className="!list-none !pl-0 space-y-1">
              {list.items.map((item) => (
                <li key={item.text}>
                  <label className="flex min-h-[44px] items-start gap-2 py-1">
                    <input type="checkbox" className="mt-1.5 h-5 w-5 flex-none accent-brand-600" />
                    <span>{item.text}</span>
                  </label>
                  {item.link && (
                    <Link href={item.link.href} className="ml-7 inline-flex min-h-[32px] items-center text-sm">
                      → {item.link.label}の選び方
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </OfficialInfo>

      <section className="prose-body text-[15px]">
        <h2>用品ごとの選び方と比較</h2>
        <ul>
          <li><Link href="/dog/evacuation-carrier">犬の避難用キャリーの選び方</Link></li>
          <li><Link href="/dog/water-food">犬の避難用 携帯給水器・折りたたみ食器の選び方</Link></li>
          <li><Link href="/dog/toilet">犬の避難時のトイレ用品</Link></li>
        </ul>
        <h2>「同行避難」の意味</h2>
        <p>
          ガイドラインでいう同行避難は、ペットと一緒に避難する行動を指す言葉で、避難所でペットを人と同じ部屋で飼養することを意味するものではありません（一般飼い主編 p.6）。
          自宅が安全な場合は、在宅避難（自宅内避難）も考えるよう書かれています（同 p.10）。
        </p>
      </section>
    </Article>
  );
}
