import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getAffiliatePlatform } from '../lib/affiliate-platform.ts';

test('recognizes actual A8 and Rakuten tracking hosts', () => {
  assert.equal(getAffiliatePlatform('https://px.a8.net/svt/ejp?a8mat=abc&a8ejpredirect=https%3A%2F%2Fshop.test%2Fitem%2F1'), 'a8');
  assert.equal(getAffiliatePlatform('https://hb.afl.rakuten.co.jp/hgc/abc'), 'rakuten');
  assert.equal(getAffiliatePlatform('https://afl.rakuten.co.jp/test'), 'rakuten');
});
test('does not attribute placeholders, direct shops, embedded hosts or lookalike hosts', () => {
  for (const url of ['https://example.com/charm/myday-1day', 'https://shop.test/item/1', 'https://shop.test/?next=https://px.a8.net', 'https://px.a8.net.evil.test/', 'https://hb.afl.rakuten.evil.test/', 'https://px.a8.net@evil.test/', 'http://px.a8.net/test', '/product/test', 'broken']) {
    assert.equal(getAffiliatePlatform(url), null, url);
  }
});
