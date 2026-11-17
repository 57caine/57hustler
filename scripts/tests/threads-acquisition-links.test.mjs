// Threads流入導線の静的検証。外部通信・投稿・個人情報の読み取りなし。
// 実行: node --test scripts/tests/threads-acquisition-links.test.mjs
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const document = readFileSync(new URL('../../docs/threads-acquisition-test-20261018.md', import.meta.url), 'utf8');
const links = [...document.matchAll(/https:\/\/[^\s`]+/g)]
  .map(([raw]) => raw.replace(/[)」。,]+$/g, ''))
  .filter((url) => url.includes('utm_source=threads'));
const hosts = new Set(['www.lens-navi.jp', 'rakutabi-nine.vercel.app']);

test('Threads用のサイト誘導リンクが複数ある', () => {
  assert.ok(links.length >= 4, `リンク不足: ${links.length}`);
});
test('すべての導線が許可した公式サイトへ向き、UTMが一貫している', () => {
  for (const link of links) {
    const url = new URL(link);
    assert.equal(url.protocol, 'https:');
    assert.ok(hosts.has(url.hostname), `想定外のホスト: ${url.hostname}`);
    assert.equal(url.searchParams.get('utm_source'), 'threads');
    assert.equal(url.searchParams.get('utm_medium'), 'social');
    assert.ok(url.searchParams.get('utm_campaign'));
    assert.ok(!url.username && !url.password);
  }
});
test('楽天への直接誘導ではなくサイトの比較ページへ誘導する', () => {
  for (const link of links) {
    const url = new URL(link);
    assert.ok(url.pathname === '/' || url.pathname.startsWith('/ranking') || url.pathname.startsWith('/bc/') || url.pathname.startsWith('/theme/'), `想定外の遷移先: ${url.pathname}`);
  }
});
