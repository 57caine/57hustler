/**
 * Two-brand Threads launcher. No scheduled posting and dry-run by default.
 * Never use the legacy THREADS_USER_ID / THREADS_ACCESS_TOKEN secrets.
 * node scripts/post-brand-threads.mjs --brand rakutabi --day 1
 * node scripts/post-brand-threads.mjs --brand lens --day 1 --publish
 */
import { readFile } from 'node:fs/promises';

const args = process.argv.slice(2);
function flag(name) { const i = args.indexOf('--' + name); return i < 0 ? undefined : args[i + 1]; }
const brand = flag('brand');
const day = Number(flag('day'));
const publish = args.includes('--publish');
const CONFIG = {
  rakutabi: { handle: 'rakutabi_navi', userId: 'RAKUTABI_THREADS_USER_ID', token: 'RAKUTABI_THREADS_ACCESS_TOKEN' },
  lens: { handle: 'lens_navi_jp', userId: 'LENS_THREADS_USER_ID', token: 'LENS_THREADS_ACCESS_TOKEN' },
};
if (!Object.hasOwn(CONFIG, brand) || !Number.isInteger(day) || day < 1 || day > 3) {
  throw new Error('Usage: --brand rakutabi|lens --day 1|2|3 [--publish]');
}
const config = CONFIG[brand];
const data = JSON.parse(await readFile(new URL('../data/social-launch-posts-20261011.json', import.meta.url), 'utf8'));
const post = data.posts.find(p => p.brand === brand && p.day === day);
if (!post || !post.text || !post.url) throw new Error('Missing post data');
if (new URL(post.url).protocol !== 'https:') throw new Error('Only HTTPS links are allowed');
const message = post.text + '\n\n' + post.url;
if (message.length > 500) throw new Error('Post exceeds 500 characters');
console.log(JSON.stringify({ mode: publish ? 'publish' : 'dry-run', brand, expectedHandle: config.handle, day, message }, null, 2));
if (!publish) process.exit(0);

if (process.env.ENABLE_BRAND_THREADS_PUBLISH !== 'true') {
  throw new Error('Publish disabled. Explicitly set ENABLE_BRAND_THREADS_PUBLISH=true after manual authorization.');
}
const id = process.env[config.userId];
const token = process.env[config.token];
if (!id || !token) throw new Error('Brand-specific Threads credentials are missing');
const API = 'https://graph.threads.net/v1.0';
async function call(url, options = {}) {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok || json.error) throw new Error('Threads API request failed: ' + JSON.stringify({ status: response.status, code: json.error?.code, type: json.error?.type }));
  return json;
}
// Check authenticated account to prevent accidental posts to the legacy account.
const me = await call(API + '/me?fields=id,username&access_token=' + encodeURIComponent(token));
if (String(me.id) !== String(id) || me.username?.toLowerCase() !== config.handle) {
  throw new Error('Account mismatch: expected @' + config.handle + ', got @' + (me.username || 'unknown'));
}
const form = new URLSearchParams({ media_type: 'TEXT', text: message, access_token: token });
const container = await call(API + '/' + encodeURIComponent(id) + '/threads', { method: 'POST', body: form });
if (!container.id) throw new Error('Threads media container was not created');
const published = await call(API + '/' + encodeURIComponent(id) + '/threads_publish', {
  method: 'POST',
  body: new URLSearchParams({ creation_id: container.id, access_token: token }),
});
if (!published.id) throw new Error('Threads did not return a published post ID');
console.log(JSON.stringify({ status: 'published', brand, day, postId: published.id }));
