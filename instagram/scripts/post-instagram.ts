/**
 * Instagram Graph API 投稿スクリプト
 * 使い方: npx ts-node instagram/scripts/post-instagram.ts [--type=fortune|swipe]
 *
 * generate-images.ts で生成した画像を Instagram に投稿する。
 * 画像は raw.githubusercontent.com 経由で公開されている前提。
 */

import * as fs from 'fs';
import * as path from 'path';

const POST_TYPE: 'fortune' | 'swipe' = process.argv.includes('--type=swipe') ? 'swipe' : 'fortune';

const ACCOUNT_ID    = process.env.INSTAGRAM_ACCOUNT_ID!;
const ACCESS_TOKEN  = process.env.INSTAGRAM_ACCESS_TOKEN!;
const GITHUB_REPO   = '57caine/57hustler';
const GITHUB_BRANCH = 'main';
const API_BASE      = 'https://graph.instagram.com/v21.0';

const OUTPUT_DIR    = path.join(process.cwd(), 'instagram/output');
const HISTORY_PATH  = path.join(process.cwd(), 'data/instagram-history.json');

interface HistoryPost {
  date: string;
  type: 'fortune' | 'swipe';
  postId: string;
  images: string[];
}

function getJstDateSlug(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
}

function rawUrl(filename: string): string {
  return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/instagram/output/${encodeURIComponent(filename)}`;
}

function loadHistory(): HistoryPost[] {
  try {
    return (JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8')) as { posts: HistoryPost[] }).posts ?? [];
  } catch { return []; }
}

function saveHistory(posts: HistoryPost[], newPost: HistoryPost): void {
  const updated = [newPost, ...posts].slice(0, 60);
  fs.writeFileSync(HISTORY_PATH, JSON.stringify({ posts: updated }, null, 2), 'utf-8');
}

async function apiPost(endpoint: string, params: Record<string, string>): Promise<{ id: string }> {
  const body = new URLSearchParams({ ...params, access_token: ACCESS_TOKEN });
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Instagram API エラー [${res.status}]: ${err}`);
  }
  return res.json() as Promise<{ id: string }>;
}

async function createImageContainer(imageUrl: string, caption?: string, isCarouselItem = false): Promise<string> {
  const params: Record<string, string> = { image_url: imageUrl };
  if (isCarouselItem) {
    params.is_carousel_item = 'true';
  } else if (caption) {
    params.caption = caption;
  }
  const { id } = await apiPost(`${ACCOUNT_ID}/media`, params);
  return id;
}

async function publishContainer(creationId: string): Promise<string> {
  const { id } = await apiPost(`${ACCOUNT_ID}/media_publish`, { creation_id: creationId });
  return id;
}

async function postSingleImage(imageUrl: string, caption: string): Promise<string> {
  console.log(`  コンテナ作成: ${imageUrl}`);
  const containerId = await createImageContainer(imageUrl, caption);
  console.log(`  コンテナID: ${containerId} — 30秒待機中...`);
  await new Promise(r => setTimeout(r, 30000));
  const postId = await publishContainer(containerId);
  return postId;
}

async function postCarousel(imageUrls: string[], caption: string): Promise<string> {
  console.log(`  カルーセルアイテム作成（${imageUrls.length}枚）...`);
  const childIds: string[] = [];
  for (const url of imageUrls) {
    const id = await createImageContainer(url, undefined, true);
    childIds.push(id);
    console.log(`    アイテムID: ${id}`);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('  カルーセルコンテナ作成...');
  const { id: carouselId } = await apiPost(`${ACCOUNT_ID}/media`, {
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption,
  });
  console.log(`  カルーセルID: ${carouselId} — 30秒待機中...`);
  await new Promise(r => setTimeout(r, 30000));

  const postId = await publishContainer(carouselId);
  return postId;
}

async function main() {
  if (!ACCOUNT_ID || !ACCESS_TOKEN) {
    throw new Error('INSTAGRAM_ACCOUNT_ID と INSTAGRAM_ACCESS_TOKEN を設定してください');
  }

  const dateSlug = getJstDateSlug();
  const history  = loadHistory();

  if (POST_TYPE === 'fortune') {
    console.log('=== fortune-card 投稿 ===');

    const imageFile = `fortune-${dateSlug}.png`;
    const captionFile = path.join(OUTPUT_DIR, `fortune-${dateSlug}.caption.txt`);
    const caption = fs.existsSync(captionFile)
      ? fs.readFileSync(captionFile, 'utf-8').trim()
      : `今日（${dateSlug}）の運勢をお届けします。`;

    const imageUrl = rawUrl(imageFile);
    const postId = await postSingleImage(imageUrl, caption);
    console.log(`✓ 投稿完了: ${postId}`);

    saveHistory(history, { date: dateSlug, type: 'fortune', postId, images: [imageFile] });

  } else {
    console.log('=== swipe 投稿 ===');

    // swipe-{date}-*.png を昇順で取得
    const files = fs.readdirSync(OUTPUT_DIR)
      .filter(f => f.startsWith(`swipe-${dateSlug}-`) && f.endsWith('.png'))
      .sort();

    if (files.length < 2) {
      throw new Error(`スワイプ画像が見つかりません（${OUTPUT_DIR} に swipe-${dateSlug}-*.png が必要）`);
    }

    const captionFile = path.join(OUTPUT_DIR, `swipe-${dateSlug}.caption.txt`);
    const caption = fs.existsSync(captionFile)
      ? fs.readFileSync(captionFile, 'utf-8').trim()
      : `スワイプして読んでください。`;

    const imageUrls = files.map(f => rawUrl(f));
    const postId = await postCarousel(imageUrls, caption);
    console.log(`✓ 投稿完了: ${postId}`);

    saveHistory(history, { date: dateSlug, type: 'swipe', postId, images: files });
  }

  // キャプションファイルを削除（次回生成時の混在防止）
  const captionFile = path.join(OUTPUT_DIR, `${POST_TYPE === 'fortune' ? 'fortune' : 'swipe'}-${dateSlug}.caption.txt`);
  if (fs.existsSync(captionFile)) fs.unlinkSync(captionFile);

  console.log('✓ 履歴保存完了');
}

main().catch(e => { console.error(e); process.exit(1); });
