import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { photoAlternateMessages } from '../scripts/lib/organic-photo-overlap.mjs';
import { isOrganicDuplicate } from '../scripts/lib/organic-threads-message.mjs';
import { preparePhotoThread, runPhotoThread } from '../scripts/lib/rakutabi-photo-thread.mjs';
const review = JSON.parse(readFileSync('data/rakutabi-sunhatoya-photo-review-20261101.json', 'utf8'));
test('photo aliases are scoped to the existing Rakutabi candidate slot only', () => {
  const post = { brand: 'rakutabi', day: 13, text: 'old text' };
  const aliases = photoAlternateMessages(post, review);
  for (const text of [review.parent, review.reply, '【広告】\n' + review.parent])
    assert.equal(isOrganicDuplicate({ text }, post, post.text, aliases), true);
  for (const p of [{ brand: 'lens', day: 13 }, { brand: 'mitama', day: 13 }, { brand: 'rakutabi', day: 12 }])
    assert.deepEqual(photoAlternateMessages(p, review), []);
  assert.throws(() => photoAlternateMessages(post, { ...review, parent: '' }));
});
test('legacy publishing CLI skips after a photo parent or reply, without any POST', () => {
  for (const text of [review.parent, review.reply, '【広告】\n' + review.parent]) {
    const preload = `globalThis.fetch=async (url,options={})=>{
      if(options.method==='POST') throw Error('Unexpected POST');
      const u=new URL(url);
      return new Response(JSON.stringify(u.pathname.endsWith('/me')?{id:'12',username:'rakutabi_navi'}:{data:[{id:'99',text:${JSON.stringify(text)}}]}),{status:200});
    };`;
    const result = spawnSync(process.execPath, ['--import', 'data:text/javascript,' + encodeURIComponent(preload), 'scripts/post-organic-threads.mjs', '--brand', 'rakutabi', '--day', '13', '--publish'],
      { encoding: 'utf8', env: { ENABLE_ORGANIC_THREADS_PUBLISH: 'true', RAKUTABI_THREADS_ACCESS_TOKEN: 'test', RAKUTABI_THREADS_USER_ID: '12' } });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout.trim().split('\n').at(-1)).status, 'skipped-already-published');
  }
});
test('photo core refuses an already published replaced text before making containers', async () => {
  const today = '2026-11-08';
  const draft = { id: 'fixture', brand: 'rakutabi', date: today, parent: 'photo fixture', reply: 'reply fixture', destination: review.destination,
    previousTexts: review.previousTexts,
    advertising: { status: 'required', hasProvisionOrDirection: false, evidence: 'Test fixture only' },
    photos: [1, 2].map(n => ({ url: `https://photos.example.test/${n}.jpg`, alt: 'test', rights: { basis: 'own-photo', holder: 'Fixture', credit: '', commercialSocial: true,
      platformRedistribution: true, evidenceUrl: 'https://photos.example.test/license', checkedOn: today, validThrough: today } })) };
  const plan = preparePhotoThread(draft, { today, allowedDestinations: [review.destination], allowedImageHosts: ['photos.example.test'] });
  let saves = 0;
  await assert.rejects(runPhotoThread(plan, { today, approval: { fingerprint: plan.fingerprint, date: today },
    api: { identity: async () => ({ id: '12', username: 'rakutabi_navi' }), history: async () => ({ complete: true, posts: [{ text: review.previousTexts[0] }] }), create: async () => assert.fail('No container allowed') },
    journal: { exclusive: async (_key, body) => body(), load: async () => null, save: async () => saves++ },
  }), /Already published/);
  assert.equal(saves, 0);
});
test('photo review remains unscheduled and its old-message alias matches the real draft', () => {
  const posts = JSON.parse(readFileSync('data/organic-threads-posts-20261013.json', 'utf8')).posts;
  assert.equal(review.publishEnabled, false); assert.equal(review.scheduledAt, null);
  assert.ok(review.previousTexts.includes(posts.find(p => p.brand === 'rakutabi' && p.day === 13).text));
  assert.equal(review.photos.length, 3);
});
test('an activated photo slot never falls back to text, including before a parent appears', () => {
  const dir = mkdtempSync(join(tmpdir(), 'photo-slot-'));
  try {
    mkdirSync(join(dir, 'scripts/lib'), { recursive: true }); mkdirSync(join(dir, 'data'));
    for (const file of ['scripts/post-organic-threads.mjs', 'scripts/lib/organic-threads-message.mjs', 'scripts/lib/organic-photo-overlap.mjs', 'data/organic-threads-posts-20261013.json'])
      copyFileSync(file, join(dir, file));
    writeFileSync(join(dir, 'data/rakutabi-sunhatoya-photo-review-20261101.json'), JSON.stringify({ ...review, publishEnabled: true }));
    const preload = `globalThis.fetch=async()=>{throw Error('Network must not be reached');};`;
    const result = spawnSync(process.execPath, ['--import', 'data:text/javascript,' + encodeURIComponent(preload), 'scripts/post-organic-threads.mjs', '--brand', 'rakutabi', '--day', '13', '--publish'], { cwd: dir, encoding: 'utf8', env: {} });
    assert.notEqual(result.status, 0); assert.match(result.stderr, /Photo release owns this slot/);
    assert.ok(!result.stderr.includes('Network must not be reached'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
