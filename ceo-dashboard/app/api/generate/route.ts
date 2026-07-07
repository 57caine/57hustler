import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

const CATEGORY_HINTS: Record<string, string> = {
  '日本神事': '神社・祭り・禊・大祓・鎮守・神様・古来の風習など日本の神事にまつわるテーマで',
  '量子': '量子力学・観測問題・重ね合わせ・量子もつれ・波動関数など量子の視点で',
  '宇宙': '宇宙・銀河・星・時間・宇宙哲学・宇宙の法則などのテーマで',
  'オカルト': '霊的なもの・見えない力・結界・エネルギー・波動などオカルト的な視点で',
  '都市伝説': '都市伝説・未確認情報・俗説・言い伝えをやんわり取り上げる形で',
  '日常の気づき': '日常のふとした気づきや季節の移ろい・身近な出来事から',
  'ミックス': '日常・季節・神事・量子・宇宙・スピリチュアルを自由にミックスして',
};

export async function POST(req: NextRequest) {
  const { hint, category } = await req.json() as { hint?: string; category?: string };

  const categoryLine = category && CATEGORY_HINTS[category]
    ? `\nカテゴリ指定：${CATEGORY_HINTS[category]}書いてください。`
    : '';
  const hintLine = hint ? `\nテーマヒント：${hint}` : '';

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: `あなたは「夜中のおじさん」というキャラクターです。
以下のルールと文体参考例を踏まえて投稿文を生成してください。

【文体の参考例】
「地震がおきる、おきない、色んな話がありますよね。それも自分で世界線が選べると思うんですよ。心配してれば意識しているから起こりやすい世界線に寄る。気にしてなければ起こらない世界線に寄る。」

「夏越の大祓ですね。お近くの神社で茅の輪が出ていたら、これまでの感謝と共に邪気を払っていただきましょう。」

「雨の日が無いと、晴れの日のありがたさが分からないですよね。ハレとケ、意識して日々を過ごしたいですね」

【ルール】
- ですます調・柔らかい語り口
- 日常・季節・気づきからスピリチュアル・宇宙・神事・量子につなげる
- 説教臭くない・押しつけがましくない
- 3〜5文程度
- 絵文字は使わないか最小限（🙏程度）
- ハッシュタグなし
- 事実は断言、未確認情報は「とも言われています」で表現
- 現代に生きる実在人物の名前は使わない`,
      messages: [{ role: 'user', content: `投稿文を生成してください。${categoryLine}${hintLine}` }],
    });

    const text = (message.content[0] as { type: string; text: string }).text.trim();
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
