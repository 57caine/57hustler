/**
 * Read-only Threads identity verification for the two new brand accounts.
 * Reads only brand-specific GitHub secrets; never touches legacy @westin_lab.
 * Does not publish, modify GitHub secrets, or print access tokens.
 */
import { appendFile } from 'node:fs/promises';

const accounts = [
  { label: '楽旅くん', handle: 'rakutabi_navi', secret: 'RAKUTABI_THREADS_ACCESS_TOKEN', idSecret: 'RAKUTABI_THREADS_USER_ID' },
  { label: 'レンズナビ', handle: 'lens_navi_jp', secret: 'LENS_THREADS_ACCESS_TOKEN', idSecret: 'LENS_THREADS_USER_ID' },
];
const lines = ['## Threads 接続確認（投稿なし）', '', '| アカウント | 結果 | ThreadsユーザーID | GitHub Secret名 |', '| --- | --- | --- | --- |'];
let failures = 0;
for (const account of accounts) {
  const token = process.env[account.secret];
  if (!token) {
    lines.push(`| ${account.label} (@${account.handle}) | トークン未登録 | — | \`${account.idSecret}\` |`);
    failures++;
    continue;
  }
  try {
    // Tokens are deliberately never written to stdout, stderr, or the job summary.
    const url = new URL('https://graph.threads.net/v1.0/me');
    url.searchParams.set('fields', 'id,username');
    url.searchParams.set('access_token', token);
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('API returned non-success status');
    const me = await response.json();
    if (!String(me.id ?? '').match(/^[0-9]+$/)) throw new Error('Invalid Threads user ID');
    if (String(me.username ?? '').toLowerCase().replace(/^@/, '') !== account.handle) {
      throw new Error('Unexpected Threads account (username mismatch)');
    }
    lines.push(`| ${account.label} (@${account.handle}) | OK | \`${me.id}\` | \`${account.idSecret}\` |`);
    console.log(`${account.label}: account verified (no post created)`);
  } catch {
    // Never print the request URL, response body, token, or exception details.
    lines.push(`| ${account.label} (@${account.handle}) | 認証失敗または通信エラー | — | \`${account.idSecret}\` |`);
    console.error(`${account.label}: identity check failed; verify the token and tester permissions`);
    failures++;
  }
}
lines.push('', '確認したIDを、上記の名前で GitHub Actions Secrets に登録してください。IDはアクセストークンではありません。', 'この処理は読み取り専用で、投稿しません。');
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join(String.fromCharCode(10)) + String.fromCharCode(10));
else console.log(lines.join(String.fromCharCode(10)));
if (failures) process.exitCode = 1;
