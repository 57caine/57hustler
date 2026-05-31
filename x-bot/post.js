#!/usr/bin/env node
/**
 * 自動投稿スクリプト
 * queue.json から次の投稿を取り出してXに投稿する
 * フォーマット: サンプル動画のみ（文章なし）→ リプライに商品リンク
 */

const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const QUEUE_FILE = path.join(__dirname, 'queue.json');

async function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const tmpFile = path.join('/tmp', `dmm_sample_${Date.now()}.mp4`);
    const file = fs.createWriteStream(tmpFile);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadVideo(res.headers.location).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(tmpFile); });
    }).on('error', reject);
  });
}

async function main() {
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });

  const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
  const pending = queue.posts.filter((p) => !p.posted);

  if (pending.length === 0) {
    console.log('投稿キューが空です');
    return;
  }

  const post = pending[0];
  console.log('投稿準備中:', post.productTitle);

  try {
    let mediaId;

    if (post.sampleVideoUrl) {
      // 動画をダウンロードしてアップロード
      console.log('動画ダウンロード中...');
      const videoPath = await downloadVideo(post.sampleVideoUrl);
      console.log('動画アップロード中...');
      mediaId = await client.v1.uploadMedia(videoPath, { mimeType: 'video/mp4' });
      fs.unlinkSync(videoPath);
      console.log('✅ 動画アップロード完了');
    }

    // メインポスト（文章なし・動画のみ）
    const tweetPayload = mediaId ? { media: { media_ids: [mediaId] } } : { text: post.productTitle };
    const tweet = await client.v2.tweet(tweetPayload);
    console.log('✅ 投稿成功:', tweet.data.id);

    // リプライに商品リンクのみ
    await client.v2.reply(post.affiliateLink, tweet.data.id);
    console.log('✅ リプライ投稿成功');

    // 投稿済みフラグ
    post.posted = true;
    post.postedAt = new Date().toISOString();
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
  } catch (e) {
    console.error('❌ 投稿失敗:', e.message);
    process.exit(1);
  }
}

main();
