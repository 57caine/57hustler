import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const data = JSON.parse(await readFile(new URL('../data/social-launch-posts-20261011.json', import.meta.url), 'utf8'));
const script = new URL('../scripts/post-brand-threads.mjs', import.meta.url);
test('exactly six unique brand/day drafts and all messages fit 500 characters', () => {
  assert.equal(data.posts.length, 6);
  assert.deepEqual([...new Set(data.posts.map(p => p.brand + ':' + p.day))].sort(),
    ['lens:1','lens:2','lens:3','rakutabi:1','rakutabi:2','rakutabi:3']);
  for (const p of data.posts) {
    assert.ok(p.text.includes('※広告を含みます。'));
    assert.ok(p.text.length + 2 + p.url.length <= 500);
    assert.equal(new URL(p.url).searchParams.get('utm_source'), 'threads');
  }
});
test('dry-run prints only intended brand and never needs secrets', () => {
  for (const brand of ['rakutabi', 'lens']) {
    const r = spawnSync(process.execPath, [script.pathname, '--brand', brand, '--day', '1'], { encoding:'utf8', env: { PATH:process.env.PATH } });
    assert.equal(r.status, 0, r.stderr);
    const v = JSON.parse(r.stdout);
    assert.equal(v.mode, 'dry-run');
    assert.equal(v.brand, brand);
  }
});
test('publish remains disabled without explicit opt-in', () => {
  const r = spawnSync(process.execPath, [script.pathname, '--brand', 'lens', '--day', '1', '--publish'], {
    encoding:'utf8', env:{ PATH:process.env.PATH },
  });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Publish disabled/);
});
test('unknown brand cannot be used', () => {
  const r = spawnSync(process.execPath, [script.pathname, '--brand', 'yonaka', '--day', '1'], { encoding:'utf8' });
  assert.notEqual(r.status, 0);
});
