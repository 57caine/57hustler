#!/usr/bin/env node
/**
 * 一回だけ実行する認証スクリプト
 * @tokyo_only のアクセストークンを取得する
 *
 * 使い方:
 *   node auth.js
 */

const { TwitterApi } = require('twitter-api-v2');
const readline = require('readline');

const API_KEY = process.env.X_API_KEY;
const API_SECRET = process.env.X_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('環境変数を設定してください:');
  console.error('  export X_API_KEY=あなたのAPIキー');
  console.error('  export X_API_SECRET=あなたのAPIシークレット');
  process.exit(1);
}

async function main() {
  const client = new TwitterApi({ appKey: API_KEY, appSecret: API_SECRET });

  const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
    'oob',
    { linkMode: 'authenticate' }
  );

  console.log('\n以下のURLをブラウザで開いてください（@tokyo_only でログインした状態で）:');
  console.log('\n' + url + '\n');
  console.log('認証後に表示される数字（PINコード）を入力してください:');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('PIN: ', async (pin) => {
    rl.close();
    try {
      const loginClient = new TwitterApi({
        appKey: API_KEY,
        appSecret: API_SECRET,
        accessToken: oauth_token,
        accessSecret: oauth_token_secret,
      });

      const { accessToken, accessSecret, screenName } = await loginClient.login(pin.trim());

      console.log('\n✅ 認証成功！ @' + screenName + ' のトークンを取得しました');
      console.log('\nGitHub Secretsに以下を登録してください:');
      console.log('  X_ACCESS_TOKEN=' + accessToken);
      console.log('  X_ACCESS_TOKEN_SECRET=' + accessSecret);
    } catch (e) {
      console.error('❌ 認証失敗:', e.message);
    }
  });
}

main();
