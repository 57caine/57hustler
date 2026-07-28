import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { calcKyusei } from '@/lib/kyusei';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { year, month, day } = await req.json() as { year: number; month: number; day: number };

  if (!year || !month || !day) {
    return NextResponse.json({ error: '生年月日を入力してください' }, { status: 400 });
  }

  const result = calcKyusei(year, month, day);

  const prompt = `
以下の九星気学データをもとに、占い文を書いてください。

【本命星】${result.starName}（${result.element}の気）
【干支】${result.eto}（${result.junishiReading}）
【吉方位】${result.direction}
【本質的な性質】${result.nature}
【生年月日】${result.birthYear}年${result.birthMonth}月${result.birthDay}日

【出力形式】3つの段落で書いてください：
1. 全体運（今のエネルギーの流れ）
2. 性格傾向（この星の持つ本質）
3. ワンポイントアドバイス（日常で意識すること）

【文体ルール】
- 語り手は「私」（一人称）。ただし冒頭の一言以外は「私」は使わない
- ですます調と体言止めを自然に混ぜた、柔らかい文体
- 難しい専門用語は使わない。「確かにそうかも」と感じる平易な言葉で
- 日月神示・終末論・警告的なトーンは含めない
- 各段落100〜150字程度。全体で300〜400字
- 段落の前に「■全体運」「■性格傾向」「■ワンポイント」の見出しをつける
`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: `あなたは「夜中のおじさん」です。知的好奇心旺盛な中年男性が、ふとした気づきをつぶやくスタイルで語りかけます。占い師ではなく、九星気学に詳しい「おじさん」として、親しみやすく、少し哲学的に語ってください。`,
    messages: [{ role: 'user', content: prompt }],
  });

  const diagnosis = (response.content[0] as { type: string; text: string }).text.trim();

  return NextResponse.json({ result, diagnosis });
}
