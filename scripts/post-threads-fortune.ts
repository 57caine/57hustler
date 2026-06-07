/**
 * Threads 占い日次自動投稿スクリプト
 *
 * Claude API で今日の12星座占いを生成し、Threads API で投稿する。
 * GitHub Actions で毎朝7:00 JST に自動実行。
 */

import Anthropic from '@anthropic-ai/sdk';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

async function generateFortuneText(): Promise<string> {
  const client = new Anthropic();

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  const prompt = `今日（${today}）の12星座の運勢をThreadsに投稿します。

【厳守事項】
- 投稿全体を**必ず450文字以内**に収めること（超えると投稿エラーになる）
- 各星座は「絵文字＋星座名＋運勢（10〜15字）＋ラッキー（色or物）」を1行に収める
- 冒頭1行：🔮 今日の星座占い【${today}】
- 末尾：詳細はnoteで🌟 #占い #今日の運勢

【フォーマット例（このくらい短く）】
♈牡羊 行動力が鍵🔑 🍀赤
♉牡牛 安定の運気💛 🍀緑
（以下同様）

本文のみ出力（前置き・説明不要）。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: 'あなたは人気占い師です。毎日Threadsに星座占いを投稿しています。読者が保存・シェアしたくなる内容を書きます。',
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
  // Threads APIは500文字制限
  return text.length <= 500 ? text : text.slice(0, 497) + '…';
}

async function createThreadsContainer(text: string): Promise<string> {
  const params = new URLSearchParams({
    media_type: 'TEXT',
    text,
    access_token: ACCESS_TOKEN,
  });

  const res = await fetch(`${THREADS_API_BASE}/${USER_ID}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Container creation failed: ${res.status} ${err}`);
  }

  const data = await res.json() as { id: string };
  return data.id;
}

async function publishThread(creationId: string): Promise<string> {
  const params = new URLSearchParams({
    creation_id: creationId,
    access_token: ACCESS_TOKEN,
  });

  const res = await fetch(`${THREADS_API_BASE}/${USER_ID}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Publish failed: ${res.status} ${err}`);
  }

  const data = await res.json() as { id: string };
  return data.id;
}

async function main() {
  console.log('=== Threads 占い投稿開始 ===');

  if (!USER_ID || !ACCESS_TOKEN) {
    throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を環境変数に設定してください');
  }

  console.log('Claude API で運勢テキスト生成中...');
  const text = await generateFortuneText();
  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log('-------------------');

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(text);
  console.log(`コンテナID: ${creationId}`);

  // APIレート制限対策: コンテナ作成後30秒待機
  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });
