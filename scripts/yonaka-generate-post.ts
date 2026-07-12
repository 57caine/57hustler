/**
 * 夜中のおじさん Threads自動投稿スクリプト
 *
 * Anthropic APIで1文を動的生成してThreadsに投稿する。
 * API失敗時はdata/yonaka-posts.jsonのストックからフォールバック。
 * 投稿後はdata/yonaka-post-history.jsonに履歴を保存（最大100件）。
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

const HISTORY_PATH = path.join(process.cwd(), 'data', 'yonaka-post-history.json');
const STOCK_PATH   = path.join(process.cwd(), 'data', 'yonaka-posts.json');
const HISTORY_KEEP = 100;

interface HistoryEntry { date: string; text: string; }

function loadHistory(): HistoryEntry[] {
  try {
    if (!fs.existsSync(HISTORY_PATH)) return [];
    const data = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8')) as { posts: HistoryEntry[] };
    return data.posts ?? [];
  } catch { return []; }
}

function saveHistory(existing: HistoryEntry[], newText: string): void {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const posts = [{ date: today, text: newText }, ...existing].slice(0, HISTORY_KEEP);
  fs.writeFileSync(HISTORY_PATH, JSON.stringify({ posts }, null, 2), 'utf-8');
}

// 現在のJST時刻から投稿枠ヒントを返す
function getSlotHint(): string {
  const jstHour = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })).getHours();
  if (jstHour >= 3  && jstHour < 6)  return '深夜（04:00）枠。深夜の静けさ、眠れない夜、深夜だからこそ気づくこと、星空や月から入る。';
  if (jstHour >= 6  && jstHour < 10) return '朝（08:00）枠。朝のルーティン、朝の光や空気、朝食、目覚めの感覚から入る。';
  if (jstHour >= 10 && jstHour < 14) return '昼（12:00）枠。季節・天気・昼の雑踏・日常の出来事・食事の時間から入る。';
  if (jstHour >= 14 && jstHour < 18) return '夕方（16:00）枠。夕焼け・影が長くなる時間・今日の出来事の振り返りから入る。';
  if (jstHour >= 18 && jstHour < 21) return '夜（20:00）枠。夜の静けさ・夕食後・夜空・一日の終わりの気づきから入る。';
  if (jstHour >= 21 && jstHour < 23) return '深夜前（22:00）枠。夜が深まる感覚・静寂・自分の内側への問いから入る。';
  return '夜更け（23:00以降）枠。就寝前の思考・夢・意識の境目・日付が変わる頃の感覚から入る。';
}

// 直近7日間で「夜中に〜」系の書き出しを使った件数を返す
function countNightOpenings(history: HistoryEntry[]): number {
  const jst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  jst.setDate(jst.getDate() - 7);
  const cutoff = jst.toLocaleDateString('en-CA');
  const NIGHT_PATTERN = /^(夜中に|夜中、|夜、|夜は|夜が|夜へ|深夜に|深夜、|深夜は)/;
  return history
    .filter(e => e.date >= cutoff)
    .filter(e => NIGHT_PATTERN.test(e.text.trimStart()))
    .length;
}

async function generatePost(history: HistoryEntry[]): Promise<string> {
  const client = new Anthropic();

  const todayJST   = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const todayPosts = history.filter(e => e.date === todayJST);
  const nightCount = countNightOpenings(history);
  const slotHint   = getSlotHint();

  // 直近履歴（重複防止用）
  const recentText = history.length > 0
    ? history.slice(0, 30).map(p => `- ${p.text}`).join('\n')
    : '（履歴なし）';

  // 当日投稿済みコンテンツ（同日重複防止）
  const todaySection = todayPosts.length > 0
    ? `【今日すでに投稿した内容（${todayPosts.length}件）】
${todayPosts.map(p => `「${p.text.slice(0, 60)}」`).join('\n')}
→ 上記と同じ書き出し・同じテーマ・同じトーンにならないようにすること。`
    : '';

  // 夜中書き出し制限
  const nightWarning = nightCount >= 2
    ? `【書き出し制限】「夜中に〜」「夜、〜」「深夜に〜」の書き出しは直近7日間ですでに${nightCount}回使用済み。今回は絶対に使わないこと。`
    : '';

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: `あなたは「夜中のおじさん」というキャラクターです。
以下のルールと文体参考例を踏まえて投稿文を生成してください。

【文体の参考例】
「地震がおきる、おきない、色んな話がありますよね。それも自分で世界線が選べると思うんですよ。心配してれば意識しているから起こりやすい世界線に寄る。気にしてなければ起こらない世界線に寄る。みんなで全体意識をコントロールして変えていければ良いですね。」

「夏越の大祓ですね。お近くの神社で茅の輪が出ていたら、これまでの感謝と共に邪気を払っていただきましょう。26年後半もみなさまに良い事が起こりますように🙏」

「雨の日が無いと、晴れの日のありがたさが分からないですよね。ハレとケ、意識して日々を過ごしたいですね」

【ルール】
- ですます調・柔らかい語り口
- 日常の出来事・季節・気づきからスピリチュアル・宇宙・神事・量子につなげる
- 説教臭くない・押しつけがましくない
- 3〜5文程度
- 絵文字は使わないか最小限（🙏程度）
- ハッシュタグなし
- 事実は断言、未確認情報は「とも言われています」で表現
- 現代に生きる実在人物の名前は使わない
- 過去の投稿と重複しない
- 【改行ルール】文と文の間に改行を1つ入れる。話題が変わるタイミングで空行（改行2つ）を入れる。改行を加えても500文字以内に収まるよう本文を短く調整してよい

過去の投稿履歴（直近30件）：
${recentText}`,
    messages: [{
      role: 'user',
      content: `【今回の投稿枠】${slotHint}
${todaySection}
${nightWarning}

上記の枠に合った切り口・書き出しで投稿文を生成してください。`,
    }],
  });

  return (message.content[0] as { type: string; text: string }).text.trim();
}

function pickStockPost(history: HistoryEntry[]): string {
  const stock = JSON.parse(fs.readFileSync(STOCK_PATH, 'utf-8')) as { posts: string[] };
  const used = new Set(history.map(p => p.text));
  const pool = stock.posts.filter(p => !used.has(p));
  const source = pool.length > 0 ? pool : stock.posts;
  return source[Math.floor(Math.random() * source.length)];
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
  console.log(`=== 夜中のおじさん投稿開始${dryRun ? '（DRY RUN）' : ''} ===`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const history = loadHistory();
  const todayJST   = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const todayCount = history.filter(e => e.date === todayJST).length;
  const nightCount = history.filter(e => {
    const jst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    jst.setDate(jst.getDate() - 7);
    return e.date >= jst.toLocaleDateString('en-CA') && /^(夜中に|夜中、|夜、|夜は|夜が|深夜に|深夜、|深夜は)/.test(e.text.trimStart());
  }).length;
  console.log(`投稿履歴: 直近${history.length}件 / 今日${todayCount}件 / 夜中書き出し直近7日:${nightCount}回`);

  let text: string;
  let fromStock = false;

  try {
    console.log('Claude API でネタ生成中...');
    text = await generatePost(history);
  } catch (e) {
    console.warn('⚠️ API生成失敗。ストックからフォールバック:', (e as Error).message);
    text = pickStockPost(history);
    fromStock = true;
  }

  console.log('--- 生成テキスト ---');
  console.log(text);
  console.log(`文字数: ${text.length}${fromStock ? '（ストックから）' : ''}`);
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

  saveHistory(history, text);
  console.log('✓ 投稿履歴を保存しました');
}

main().catch(e => { console.error(e); process.exit(1); });
