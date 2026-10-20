import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incomingTrafficSource } from '../rakutabi/lib/traffic-source.ts';
test('recognized campaign takes precedence over referrer', () => {
  assert.equal(incomingTrafficSource('?utm_source=instagram', 'https://l.threads.com/'), 'instagram');
  assert.equal(incomingTrafficSource('?utm_source=threads', ''), 'threads');
});
test('Threads profile referral is recognized without UTM', () => {
  for (const host of ['threads.com', 'www.threads.com', 'l.threads.com', 'threads.net', 'www.threads.net', 'l.threads.net']) {
    assert.equal(incomingTrafficSource('', `https://${host}/?tracking=private`), 'threads');
  }
});
test('missing evidence and lookalike hosts are never attributed', () => {
  for (const ref of ['', 'broken', 'https://threads.com.evil.test/', 'https://example.com/?url=https://threads.com/', 'https://rakutabi-nine.vercel.app/']) {
    assert.equal(incomingTrafficSource('', ref), null);
  }
});
