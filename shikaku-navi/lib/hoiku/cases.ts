// 悩み別・目的別の出し分けデータ
// recommend は services.ts の slug。理由の文言は骨格段階の仮置きなので、
// 各社公式情報を確認したうえで具体化すること（根拠のない数値・断定表現は書かない）

export interface HoikuCase {
  id: string;
  title: string;
  lead: string;
  recommend: string[];
  reason: string;
}

export const hoikuCases: HoikuCase[] = [
  {
    id: 'local',
    title: '地方求人が多いサイトで選ぶなら',
    lead: '地方・郊外で働きたい人は、希望エリアの求人がどれだけあるかが最優先です。',
    recommend: ['hoikushibank', 'jobmedley'],
    reason: '【仮】全国対応のサービスを軸に、希望エリアで実際に求人を検索して比較するのがおすすめです（各社の地方求人の状況は要確認）。',
  },
  {
    id: 'first-time',
    title: '初めての転職・ブランクがあるなら',
    lead: '何から始めればいいか分からない人は、相談できる担当者がいるサービスが安心です。',
    recommend: ['hoikushibank', 'mynavi-hoikushi'],
    reason: '【仮】転職エージェント型なら、求人選びから面接対策まで相談しながら進められます（サポート範囲は要確認）。',
  },
  {
    id: 'own-pace',
    title: '自分のペースで求人を探したいなら',
    lead: '担当者からの連絡を減らしたい人は、自分で検索・応募できる求人サイト型が向いています。',
    recommend: ['jobmedley'],
    reason: '【仮】求人サイト型は、好きなタイミングで求人を比較できるのが特長です。',
  },
  {
    id: 'flexible',
    title: '派遣・パートなど働き方を柔軟にしたいなら',
    lead: '正社員以外の働き方も検討したい人は、雇用形態の選択肢が多いサービスを選びましょう。',
    recommend: ['hoikubatake', 'hoikushibank'],
    reason: '【仮】扱っている雇用形態はサービスによって異なります（各社の対応状況は要確認）。',
  },
];
