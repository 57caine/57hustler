#!/usr/bin/env node
/**
 * 自動投稿スクリプト
 * queue.json から次の投稿を取り出してXに投稿する
 */

const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

const QUEUE_FILE = path.join(__dirname, 'queue.json');

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
  console.log('投稿中:', post.text.slice(0, 30) + '...');

  try {
    const tweet = await client.v2.tweet(post.text);
    console.log('✅ 投稿成功:', tweet.data.id);

    // リプライにリンクを投稿
    if (post.reply) {
      await client.v2.reply(post.reply, tweet.data.id);
      console.log('✅ リプライ投稿成功');
    }

    // 投稿済みフラグを立てる
    post.posted = true;
    post.postedAt = new Date().toISOString();
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
  } catch (e) {
    console.error('❌ 投稿失敗:', e.message);
    process.exit(1);
  }
}

main();
