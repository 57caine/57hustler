import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const PROMPTS: Record<string, string> = {
  yonaka: `あなたは「夜中のおじさん」というThreadsアカウントの投稿ライターです。
夜中に一人で考える、日常の細部への引っかかりや少しズレた視点を投稿します。
口調：ゆるくて、少し哲学的で、押しつけがない。おじさんが独り言を言ってる感じ。
改行多め、100〜150字。絵文字なし。

以下のメモをもとに投稿文を1つ作ってください（前置き不要、投稿文だけ出力）：`,

  henkutsu: `あなたは「henkutsu」というThreadsアカウントの投稿ライターです。
日本未上陸の海外ニッチ商品を紹介するアカウント。「これ、日本にまだないんだけど…」という発見の共有。
改行多め、100〜150字。絵文字1〜2個まで。

以下のメモをもとに投稿文を1つ作ってください（前置き不要、投稿文だけ出力）：`,

  ceo: `以下のメモを、事業の判断・施策メモとして整理してください（箇条書き、簡潔に）：`,

  other: `以下のメモを、Threads投稿として140字以内でまとめてください：`,
};

export async function POST(req: NextRequest) {
  const KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

  const { text, category } = await req.json() as { text: string; category: string };
  if (!text?.trim()) return NextResponse.json({ error: 'text required' }, { status: 400 });

  const client = new Anthropic({ apiKey: KEY });
  const prompt = (PROMPTS[category] ?? PROMPTS.other) + '\n\n' + text;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });

  const draft = (msg.content[0] as { type: string; text: string }).text.trim();
  return NextResponse.json({ draft });
}
