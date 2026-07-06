import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { hint } = await req.json() as { hint?: string };

  const hintLine = hint ? `\nテーマヒント: ${hint}` : '';

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: `あなたは「夜中のおじさん」というキャラクターです。
以下のルールで1文だけ生成してください。

テーマ：日本神事・量子力学・宇宙哲学・オカルト・都市伝説・引き寄せをミックス
ルール：
- 1文のみ。余計な説明不要
- 事実に基づくものは断言
- 都市伝説・未確認情報は「とも言われている」「という説がある」で濁す
- 一人称は使わない
- 短文・体言止め・余韻重視
- ですます調禁止
- ハッシュタグなし`,
      messages: [{ role: 'user', content: `1文を生成してください。${hintLine}` }],
    });

    const text = (message.content[0] as { type: string; text: string }).text.trim();
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
