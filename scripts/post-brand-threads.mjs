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
const configuredId = process.env[config.userId];
const token = process.env[config.token];
if (!token) throw new Error('Brand-specific Threads token is missing');
const API = 'https://graph.threads.net/v1.0';
async function call(url, options = {}) {
  // Never surface a fetch exception that may contain a credential-bearing URL.
  let response, json;
  try {
    response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
    json = await response.json();
  } catch {
    throw new Error('Threads request outcome unknown. Check account history before retrying.');
  }
  if (!response.ok || json.error) throw new Error('Threads API request failed: ' + JSON.stringify({ status: response.status, code: Number.isInteger(json.error?.code) ? json.error.code : null }));
  return json;
}
// Check authenticated account to prevent accidental posts to the legacy account.
const me = await call(API + '/me?fields=id,username&access_token=' + encodeURIComponent(token));
if (!/^[0-9]+$/.test(String(me.id ?? '')) || (configuredId && String(me.id) !== String(configuredId)) || me.username?.toLowerCase() !== config.handle) {
  throw new Error('Account mismatch: expected @' + config.handle);
}
// A verified /me identity removes the need for the owner to copy IDs manually.
const id = String(me.id);
// Read the authenticated account's complete available history before creating
// a container. The campaign URL is unique per brand/day and survives copy edits.
// Rebuild cursor requests ourselves rather than trusting credential-bearing next URLs.
let after;
let historyComplete = false;
const cursors = new Set();
for (let page = 0; page < 10; page++) {
  const query = new URLSearchParams({ fields: 'id,text', limit: '100', access_token: token });
  if (after) query.set('after', after);
  const history = await call(API + '/' + encodeURIComponent(id) + '/threads?' + query);
  if (!Array.isArray(history.data)) throw new Error('Cannot verify posting history. Publish stopped.');
  if (history.data.some(item => typeof item.text === 'string' && (item.text === message || item.text.includes(post.url)))) {
    console.log(JSON.stringify({ status: 'skipped-already-published', brand, day }));
    process.exit(0);
  }
  if (!history.paging?.next) { historyComplete = true; break; }
  after = history.paging?.cursors?.after;
  if (typeof after !== 'string' || !after || cursors.has(after)) break;
  cursors.add(after);
}
if (!historyComplete) throw new Error('Posting history incomplete. Publish stopped.');
const form = new URLSearchParams({ media_type: 'TEXT', text: message, access_token: token });
const container = await call(API + '/' + encodeURIComponent(id) + '/threads', { method: 'POST', body: form });
if (!container.id) throw new Error('Threads media container was not created');
const published = await call(API + '/' + encodeURIComponent(id) + '/threads_publish', {
  method: 'POST',
  body: new URLSearchParams({ creation_id: container.id, access_token: token }),
});
if (!published.id) throw new Error('Threads did not return a published post ID');
console.log(JSON.stringify({ status: 'published', brand, day, postId: published.id }));

