/**
 * Threads 一文考察 自動投稿スクリプト（夜21時）
 *
 * 平日: 日本伝統・宗教・神話と量子力学・現代科学を掛け合わせた「一文考察」
 * 日曜: 「問いかけ投稿」（答えを言わず読者に考えさせる）
 */

import Anthropic from '@anthropic-ai/sdk';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID  = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

function getJstDayOfWeek(): number {
  const jstStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  return new Date(jstStr + 'T12:00:00Z').getDay();
}

async function generateShortPost(isSunday: boolean): Promise<string> {
  const client = new Anthropic();

  const [system, userPrompt] = isSunday
    ? [
        'あなたは「夜中のおじさん」です。Threadsに問いかけ投稿をします。',
        `九星気学・妖怪・神話・結界・量子論・宗教などのテーマに関連した「問いかけ」を1本書いてください。

【ルール】
- 答えを言わない。読者に考えさせる
- 短く。一文〜二文
- 「あなたは〜ですか」「〜を、考えたことがありますか」の形が望ましい
- ハッシュタグなし
- 500文字以内厳守

【参考トーン】
「柏手を打つ時、あなたは何を考えていますか。」
「あなたの地元に、妖怪はいますか。」

投稿文のみ出力（説明・前置き不要）。`,
      ]
    : [
        'あなたは「夜中のおじさん」です。Threadsに一文考察を投稿します。',
        `日本の伝統・儀式・文化・妖怪・神話・宗教と、量子力学・現代科学・宇宙論・心理学を掛け合わせた「一文考察」を1本書いてください。

【ルール】
- 一文〜三文以内。短いほど良い
- 断言せず「とも言われている」「のかもしれない」で余韻を残す
- 難しい専門用語は使わない
- 読んだ人が「え、そうなの？」と思う切り口を選ぶ
- ハッシュタグなし
- 500文字以内厳守

【参考トーン】
「大祓詞の音韻は、量子もつれと同じ原理で現実を書き換えるとも言われている。」
「易経の64卦は、DNAの64コドンと同じ数だ。偶然だと言い切れる人は、まだ少ない。」

投稿文のみ出力（説明・前置き不要）。`,
      ];

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  return text.length <= 500 ? text : text.slice(0, 497) + '…';
}

async function createThreadsContainer(text: string): Promise<string> {
  const params = new URLSearchParams({ media_type: 'TEXT', text, access_token: ACCESS_TOKEN });
  const res = await fetch(`${THREADS_API_BASE}/${USER_ID}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Container creation failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { id: string }).id;
}

async function publishThread(creationId: string): Promise<string> {
  const params = new URLSearchParams({ creation_id: creationId, access_token: ACCESS_TOKEN });
  const res = await fetch(`${THREADS_API_BASE}/${USER_ID}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Publish failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { id: string }).id;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const isSunday = getJstDayOfWeek() === 0;
  const postType = isSunday ? '問いかけ' : '一文考察';

  console.log(`=== Threads ${postType}投稿開始${dryRun ? '（DRY RUN）' : ''} ===`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  console.log(`Claude API で${postType}を生成中...`);
  const text = await generateShortPost(isSunday);

  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log(`文字数: ${text.length}`);
  console.log('-------------------');

  if (dryRun) {
    console.log('✓ DRY RUN 完了（投稿はしていません）');
    return;
  }

  console.log('Threads コンテナ作成中...');
  const creationId = await createThreadsContainer(text);
  console.log(`コンテナID: ${creationId}`);

  console.log('30秒待機中...');
  await new Promise(r => setTimeout(r, 30000));

  console.log('投稿公開中...');
  const postId = await publishThread(creationId);
  console.log(`✓ 投稿完了: ${postId}`);
}

main().catch(e => { console.error(e); process.exit(1); });
