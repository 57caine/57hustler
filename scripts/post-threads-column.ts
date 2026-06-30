/**
 * Threads 夜間コラム自動投稿スクリプト（動的生成版）
 *
 * 毎晩19:00 JST に投稿。テーマはAPIが8カテゴリから都度選択・生成。
 * 直近14件の投稿履歴をContextに渡して重複を防ぐ。
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const USER_ID = process.env.THREADS_USER_ID!;
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;

const HISTORY_PATH = path.join(process.cwd(), 'data', 'column-history.json');
const HISTORY_KEEP = 14;

interface ColumnPost {
  date: string;
  text: string;
}

function loadHistory(): ColumnPost[] {
  try {
    if (!fs.existsSync(HISTORY_PATH)) return [];
    const data = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8')) as { posts: ColumnPost[] };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

function saveHistory(existing: ColumnPost[], newText: string): void {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  const posts = [{ date: today, text: newText.slice(0, 200) }, ...existing].slice(0, HISTORY_KEEP);
  fs.writeFileSync(HISTORY_PATH, JSON.stringify({ posts }, null, 2), 'utf-8');
}

async function generateColumnText(): Promise<string> {
  const client = new Anthropic();
  const recentPosts = loadHistory();

  const historyContext = recentPosts.length > 0
    ? `\n【直近の投稿内容（これと同じネタ・切り口は避けること）】\n` +
      recentPosts.map((p, i) => `${i + 1}. ${p.date}: ${p.text}`).join('\n')
    : '';

  const prompt = `以下の8カテゴリから、過去14日間に使っていないテーマを1つ選んでください。たまに（3回に1回程度の頻度で）関連する別カテゴリの話題も1つ軽く絡めて、Threadsコラムを書いてください。

【カテゴリ】
1. 気学・易経
2. 日本の妖怪・神々
3. 日常の結界・しきたり（箸・敷居・塩などの所作）
4. 古代ミステリー（シュメール、ピラミッド等）
5. 量子力学・宇宙論
6. 都市伝説・スピリチュアル
7. 宗教の共通項（黄金律、因果応報など）
8. 科学・化学のふしぎ
${historyContext}

【絶対守ること】
- 500文字以内（超えると投稿できない）
- 「〜です」「〜ます」「〜かもしれません」というですます調で丁寧で温かい口調（「〜ですよ」「〜ますよ」は使わない）
- 怪しい・神秘的すぎる表現はNG。知的好奇心を刺激する読み物にする
- 構成：身近な事実 → 意外な背景・他分野との関連 → 余韻のある一言 → 軽いnote誘導
- ハッシュタグは一切入れない

投稿文のみ出力（前置き・説明は不要）。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: 'あなたは「夜中のおじさん」というキャラクターで、Threadsにコラムを投稿します。30歳まで鳴かず飛ばず、九星気学の吉方位参拝で人生が逆転した経験を持つ、親しみやすいおじさんです。20〜50代の読者に向けて、専門用語を使わず「〜です」「〜ます」「〜してみてください」というですます調で丁寧に語りかけます。「〜ですよ」「〜ますよ」は使いません。怪しい表現は避け、知的好奇心を刺激する読み物を書きます。',
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text;
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
  console.log(`=== Threads 夜間コラム投稿開始${dryRun ? '（DRY RUN）' : ''} ===`);
  if (!dryRun && (!USER_ID || !ACCESS_TOKEN)) throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を設定してください');

  const history = loadHistory();
  console.log(`投稿履歴: 直近${history.length}件を参照`);

  console.log('Claude API でコラムテキスト生成中...');
  const text = await generateColumnText();
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

  saveHistory(history, text);
  console.log('✓ 投稿履歴を保存しました');
}

main().catch(e => { console.error(e); process.exit(1); });
