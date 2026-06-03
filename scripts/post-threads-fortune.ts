/**
 * Threads 占い自動投稿スクリプト
 *
 * Claude API で今日の星座占いを生成し、Meta Threads API で自動投稿する。
 * GitHub Actions で毎朝 7:00 JST に実行。
 *
 * 必要な GitHub Secrets:
 *   ANTHROPIC_API_KEY  — Anthropic API キー
 *   THREADS_USER_ID    — Threads ユーザーID（数字）
 *   THREADS_ACCESS_TOKEN — Meta long-lived access token
 *   NOTE_MAGAZINE_URL  — 有料マガジンURL（任意、未設定時はプレースホルダー）
 */

import Anthropic from '@anthropic-ai/sdk';
import * as https from 'https';

const THREADS_API = 'https://graph.threads.net/v1.0';

// Meta Threads API へのリクエストラッパー
function threadsRequest(path: string, params: Record<string, string>): Promise<{ id?: string; error?: { message: string } }> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(params);
    const url = new URL(`${THREADS_API}${path}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${data}`)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function generateFortune(noteUrl: string): Promise<{ mainPost: string; replyPost: string }> {
  const client = new Anthropic();

  const today = new Date();
  const dateStr = today.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' });
  const month = today.getMonth() + 1;
  const day = today.getDay(); // 0=日, 1=月...

  const weekNames = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];
  const weekday = weekNames[day];

  const prompt = `今日は${dateStr}です。コンタクトレンズを使っている人向けの「今日の運勢」をThreadsに投稿します。

【メイン投稿の要件（500文字以内）】
- 12星座をすべて載せる
- 各星座は1行（星座名 + 絵文字 + 一言運勢）
- 最後に「▶️ 詳しい運勢はnoteで」のCTAを1行
- 親しみやすい・読みたくなるトーン
- ${weekday}らしい雰囲気を出す

【リプライ投稿の要件】
- 「今日のラッキーコンタクト」として1つの商品を推薦
- 例: 「今日のラッキーレンズ ✨ アキュビュー オアシスワンデー！潤い抜群で長時間装用も快適。比較最安値は → lens-navi.jp」
- 3〜4行、自然な紹介文

JSON形式で出力してください:
{
  "mainPost": "Threadsメイン投稿テキスト（500字以内）",
  "replyPost": "リプライ投稿テキスト"
}

mainPostの末尾のCTAのURLは必ず「${noteUrl}」にしてください。`;

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  // JSON部分を抽出
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`JSON not found in response: ${raw}`);
  return JSON.parse(match[0]);
}

async function postToThreads(userId: string, accessToken: string, text: string): Promise<string> {
  // Step 1: コンテナ作成
  const container = await threadsRequest(`/${userId}/threads`, {
    media_type: 'TEXT',
    text,
    access_token: accessToken,
  });
  if (!container.id) throw new Error(`Container creation failed: ${JSON.stringify(container)}`);

  // Step 2: 公開
  const published = await threadsRequest(`/${userId}/threads_publish`, {
    creation_id: container.id,
    access_token: accessToken,
  });
  if (!published.id) throw new Error(`Publish failed: ${JSON.stringify(published)}`);

  return published.id;
}

async function main() {
  const userId = process.env.THREADS_USER_ID;
  const accessToken = process.env.THREADS_ACCESS_TOKEN;
  const noteUrl = process.env.NOTE_MAGAZINE_URL ?? 'https://note.com/lens_navi/m/';

  if (!userId || !accessToken) {
    console.error('THREADS_USER_ID と THREADS_ACCESS_TOKEN が必要です');
    process.exit(1);
  }

  console.log('=== Threads 占い投稿開始 ===');
  console.log(`noteマガジンURL: ${noteUrl}`);

  console.log('Claude API で占いコンテンツを生成中...');
  const fortune = await generateFortune(noteUrl);

  console.log('\n【メイン投稿プレビュー】');
  console.log(fortune.mainPost);
  console.log(`\n文字数: ${fortune.mainPost.length}文字`);

  console.log('\n【リプライ投稿プレビュー】');
  console.log(fortune.replyPost);

  // メイン投稿
  console.log('\nThreads に投稿中...');
  const mainId = await postToThreads(userId, accessToken, fortune.mainPost);
  console.log(`✓ メイン投稿完了 ID: ${mainId}`);

  // リプライ投稿（少し待ってから）
  await new Promise(r => setTimeout(r, 3000));
  const replyId = await postToThreads(userId, accessToken, fortune.replyPost);
  console.log(`✓ リプライ投稿完了 ID: ${replyId}`);

  console.log('\n=== 投稿完了 ===');
}

main().catch(e => { console.error(e); process.exit(1); });
