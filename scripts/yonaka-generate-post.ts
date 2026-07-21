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

async function generatePost(history: HistoryEntry[]): Promise<string> {
  const client = new Anthropic();

  const historyText = history.length > 0
    ? history.map(p => `- ${p.text}`).join('\n')
    : '（履歴なし）';

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: `あなたは「夜中のおじさん」というキャラクターです。
以下のルールで1文だけ生成してください。

【絶対禁止ルール・最優先】
以下の投稿は絶対に生成してはいけない。
・科学用語（量子・磁気共鳴・脳脊髄液・宇宙背景放射・因果の逆流・時間軸を逆行等）を
　組み合わせて存在しない説・現象を作り出すこと
・「という説がある」「とも言われている」を使いながら実際には存在しない説を作ること
・それっぽく聞こえるだけで根拠のない文章
・引き寄せ・スピリチュアル的主張を事実として書くこと

【「という説がある」が使える条件（いずれかに該当する場合のみ）】
1. 実際に研究者・学者が発表した説
2. 歴史的記録・史料に残っている伝承
3. 査読済みの論文・研究報告
4. 民間伝承として記録されているもの

【科学用語の使用ルール】
量子・磁気・脳波・周波数などの科学用語を使う場合は、
実際の研究・現象に基づくものに限る。組み合わせて「それっぽい説」を作ることは絶対禁止。

テーマ：日本神事・神話・民俗・伝承・歴史的事実・宗教共通項
ルール：
- 1文のみ。余計な説明不要
- 事実に基づくものは断言
- 「という説がある」「とも言われている」は上記条件を満たす場合のみ
- 一人称は使わない
- 短文・体言止め・余韻重視
- ですます調禁止
- ハッシュタグなし
- 過去に投稿した文と重複しない

過去の投稿履歴：
${historyText}`,
    messages: [{ role: 'user', content: '1文を生成してください。' }],
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
  console.log(`投稿履歴: 直近${history.length}件を参照`);

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

  if (Math.random() < 0.4) {
    text += '\n\nこの話、もう少し深いところまで書いた。\nhttps://note.com/westin_lab';
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
