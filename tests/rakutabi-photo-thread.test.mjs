import test from 'node:test';
import assert from 'node:assert/strict';
import { preparePhotoThread, runPhotoThread } from '../scripts/lib/rakutabi-photo-thread.mjs';

// Synthetic fixtures only: these are NOT licensed assets or approved posts.
const today = '2026-11-01';
const options = { today, allowedDestinations: ['https://rakutabi-nine.vercel.app/area/ito'], allowedImageHosts: ['photos.example.test'] };
function draft() {
  return { id: 'offline-fixture', brand: 'rakutabi', date: today,
    parent: '海のそばでのんびりしない？🌊 写真：テスト', reply: '伊東の宿を比べるならこちら♨️',
    destination: options.allowedDestinations[0],
    advertising: { status: 'optional', hasProvisionOrDirection: false, evidence: 'Synthetic test only' },
    photos: [1, 2].map(n => ({ url: `https://photos.example.test/${n}.jpg`, alt: `写真${n}の説明`,
      rights: { basis: 'explicit-license', holder: 'Fixture', commercialSocial: true, platformRedistribution: true,
        evidenceUrl: 'https://photos.example.test/license', checkedOn: today, validThrough: '2026-11-30', credit: '写真：テスト' } })) };
}
function harness(plan, failure = {}) {
  let saved, counter = 0, locked = false;
  const calls = [];
  const api = {
    identity: async () => ({ id: '123', username: failure.wrongAccount ? 'other' : 'rakutabi_navi' }),
    history: async () => ({ complete: !failure.incomplete, posts: failure.duplicate ? [{ text: plan.parent }] : [] }),
    create: async params => { calls.push(['create', params]); if (failure.replyCreate && params.reply_to_id) throw Error('reply unavailable'); return { id: String(++counter) }; },
    status: async () => failure.processing ? 'IN_PROGRESS' : 'FINISHED',
    publish: async id => { calls.push(['publish', id]); if (failure.publish || (failure.replyPublish && id === '4')) throw Error('timeout'); return { id: String(100 + Number(id)) }; },
  };
  const journal = {
    exclusive: async (_key, fn) => { if (locked) throw Error('Locked'); locked = true; try { return await fn(); } finally { locked = false; } },
    load: async () => structuredClone(saved),
    save: async (_key, state) => { if (failure.saveAfterPublish && state.stage === 'parent-published') throw Error('disk failure'); saved = structuredClone(state); },
  };
  const deps = { api, journal, today, approval: { fingerprint: plan.fingerprint, date: today } };
  return { deps, calls, state: () => saved };
}
test('optional disclosure is omitted only after an explicit assessment', () => {
  const d = draft(), p = preparePhotoThread(d, options);
  assert.equal(p.parent, d.parent);
  assert.ok(!p.reply.includes('【広告】'));
  d.advertising = { status: 'required', hasProvisionOrDirection: true, evidence: 'Provided by hotel' };
  const disclosed = preparePhotoThread(d, options);
  assert.ok(disclosed.parent.startsWith('【広告】'));
  assert.ok(disclosed.reply.startsWith('【広告】'));
  assert.notEqual(p.fingerprint, disclosed.fingerprint);
});
test('unconfirmed rights, credits, disclosure, destinations and dates fail closed', () => {
  for (const mutate of [
    d => { d.photos[0].rights.commercialSocial = false; },
    d => { delete d.id; },
    d => { d.photos[0].rights.platformRedistribution = false; },
    d => { d.photos[0].rights.validThrough = '2026-10-31'; },
    d => { d.photos[0].rights.checkedOn = '2026-11-02'; },
    d => { d.parent = 'credit omitted'; },
    d => { d.photos[0].rights.basis = 'rakuten-api'; },
    d => { d.photos[0].url = 'https://photos.example.test.evil.test/1.jpg'; },
    d => { d.photos[0].url = 'http://photos.example.test/1.jpg'; },
    d => { d.photos[0].alt = ''; },
    d => { d.photos[1].url = d.photos[0].url; },
    d => { d.photos = []; },
    d => { d.advertising.status = 'unknown'; },
    d => { d.advertising.hasProvisionOrDirection = true; },
    d => { d.advertising.evidence = ''; },
    d => { d.destination = 'https://travel.rakuten.co.jp/'; },
    d => { d.date = '2026-10-31'; },
    d => { d.date = '2026-02-30'; },
    d => { d.parent = 'a'.repeat(501); },
    d => { d.reply += ' https://evil.test'; },
  ]) { const d = draft(); mutate(d); assert.throws(() => preparePhotoThread(d, options)); }
});
test('carousel then reply records both post IDs; completed reruns publish nothing', async () => {
  const p = preparePhotoThread(draft(), options), h = harness(p);
  const result = await runPhotoThread(p, h.deps);
  assert.equal(result.stage, 'complete');
  assert.equal(result.parentPostId, '103'); assert.equal(result.replyPostId, '104');
  assert.equal(h.calls.filter(c => c[0] === 'publish').length, 2);
  const reply = h.calls.find(c => c[1]?.reply_to_id);
  assert.equal(reply[1].reply_to_id, '103');
  await runPhotoThread(p, h.deps);
  assert.equal(h.calls.filter(c => c[0] === 'publish').length, 2);
});
test('wrong account, incomplete history, duplicate and unready images never publish', async () => {
  const p = preparePhotoThread(draft(), options);
  for (const failure of [{ wrongAccount: true }, { incomplete: true }, { duplicate: true }, { processing: true }]) {
    const h = harness(p, failure);
    await assert.rejects(runPhotoThread(p, h.deps));
    assert.equal(h.calls.filter(c => c[0] === 'publish').length, 0);
  }
});
test('publish timeout and a failed post-ID save prevent any automatic retry', async () => {
  const p = preparePhotoThread(draft(), options);
  for (const failure of [{ publish: true }, { saveAfterPublish: true }]) {
    const h = harness(p, failure);
    await assert.rejects(runPhotoThread(p, h.deps));
    assert.equal(h.state().stage, 'parent-publish-intent');
    await assert.rejects(runPhotoThread(p, h.deps), /partial or uncertain/);
    assert.equal(h.calls.filter(c => c[0] === 'publish').length, 1);
  }
});
test('parent-only success retains its ID and stops before repeating parent', async () => {
  const p = preparePhotoThread(draft(), options), h = harness(p, { replyCreate: true });
  await assert.rejects(runPhotoThread(p, h.deps));
  assert.equal(h.state().parentPostId, '103');
  await assert.rejects(runPhotoThread(p, h.deps), /partial or uncertain/);
  assert.equal(h.calls.filter(c => c[0] === 'publish').length, 1);
});
test('uncertain reply publish retains parent ID and never retries either post', async () => {
  const p = preparePhotoThread(draft(), options), h = harness(p, { replyPublish: true });
  await assert.rejects(runPhotoThread(p, h.deps));
  assert.equal(h.state().stage, 'reply-publish-intent');
  assert.equal(h.state().parentPostId, '103');
  await assert.rejects(runPhotoThread(p, h.deps), /partial or uncertain/);
  assert.equal(h.calls.filter(c => c[0] === 'publish').length, 2);
});
test('changing a photo or caption after approval invalidates the plan', async () => {
  const p = preparePhotoThread(draft(), options), h = harness(p);
  p.photos[0].url = 'https://photos.example.test/replaced.jpg';
  await assert.rejects(runPhotoThread(p, h.deps), /mutated/);
  assert.equal(h.calls.length, 0);
});
test('changed campaign, expired approval and concurrent execution are blocked', async () => {
  const p = preparePhotoThread(draft(), options), h = harness(p);
  await assert.rejects(runPhotoThread(p, { ...h.deps, today: '2026-11-02' }), /approval/);
  const first = runPhotoThread(p, h.deps);
  await assert.rejects(runPhotoThread(p, h.deps), /Locked/);
  await first;
  const changed = preparePhotoThread({ ...draft(), parent: '別の原稿 写真：テスト' }, options);
  await assert.rejects(runPhotoThread(changed, { ...h.deps, approval: { fingerprint: changed.fingerprint, date: today } }), /changed/);
});
