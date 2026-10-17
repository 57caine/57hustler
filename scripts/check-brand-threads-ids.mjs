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
    if (!response.ok) {
      // Only numeric HTTP/API codes; never include server messages or request URLs.
      let code = 'unknown';
      let subcode = 'none';
      try {
        const failure = await response.json();
        if (Number.isInteger(failure?.error?.code)) code = String(failure.error.code);
        if (Number.isInteger(failure?.error?.error_subcode)) subcode = String(failure.error.error_subcode);
      } catch { /* no response body logged */ }
      throw new Error('HTTP ' + response.status + ' / API code ' + code + ' / subcode ' + subcode);
    }
    const me = await response.json();
    if (!String(me.id ?? '').match(/^[0-9]+$/)) throw new Error('ID field missing or invalid');
    if (String(me.username ?? '').toLowerCase().replace(/^@/, '') !== account.handle) {
      throw new Error('Unexpected Threads account (username mismatch)');
    }
    lines.push(`| ${account.label} (@${account.handle}) | OK | \`${me.id}\` | \`${account.idSecret}\` |`);
    console.log(`${account.label}: account verified (no post created)`);
  } catch (error) {
    // Only messages authored above are allowed. No request URL, response body or token.
    const detail = error?.name === 'TimeoutError' ? '通信タイムアウト'
      : error?.message?.startsWith('HTTP ') ? error.message
      : error?.message === 'ID field missing or invalid' ? 'ユーザーIDの形式不正'
      : error?.message?.startsWith('Unexpected Threads account') ? 'アカウント名不一致'
      : '通信または応答解析エラー';
    lines.push(`| ${account.label} (@${account.handle}) | ${detail} | — | \`${account.idSecret}\` |`);
    console.error(`${account.label}: ${detail}`);
    failures++;
  }
}
lines.push('', '確認したIDを、上記の名前で GitHub Actions Secrets に登録してください。IDはアクセストークンではありません。', 'この処理は読み取り専用で、投稿しません。');
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join(String.fromCharCode(10)) + String.fromCharCode(10));
else console.log(lines.join(String.fromCharCode(10)));
if (failures) process.exitCode = 1;
