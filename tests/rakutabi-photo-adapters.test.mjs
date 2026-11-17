import test from 'node:test';
import assert from 'node:assert/strict';
import { createThreadsPhotoApi, createPhotoJournal, createGitHubPhotoStore } from '../scripts/lib/rakutabi-photo-adapters.mjs';
import { preparePhotoThread, runPhotoThread } from '../scripts/lib/rakutabi-photo-thread.mjs';
const response = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
function memoryCas() {
  const rows = new Map(); let revision = 0;
  return {
    rows,
    async read(key) { return structuredClone(rows.get(key) ?? null); },
    async write(key, value, expected) {
      if ((rows.get(key)?.revision ?? null) !== expected) throw Error('Conflict');
      const row = { revision: String(++revision), value: structuredClone(value) };
      rows.set(key, row); return row.revision;
    },
  };
}
test('Threads adapter verifies configured account before any write', async () => {
  let calls = 0;
  const api = createThreadsPhotoApi({ token: 'secret', userId: '12', fetchImpl: async () => { calls++; return response({ id: '99', username: 'rakutabi_navi' }); } });
  await assert.rejects(api.create({ media_type: 'TEXT' }), /identity/);
  assert.equal(calls, 0);
  await assert.rejects(api.identity(), /mismatch/);
  await assert.rejects(api.publish('13'), /identity/);
  assert.equal(calls, 1);
});
test('Threads pagination never follows untrusted next URLs and reports incomplete data', async () => {
  const seen = [];
  const api = createThreadsPhotoApi({ token: 'secret', userId: '12', fetchImpl: async (url, options) => {
    seen.push(String(url)); assert.equal(url.host, 'graph.threads.net'); assert.equal(options.redirect, 'error');
    if (url.pathname.endsWith('/me')) return response({ id: '12', username: 'rakutabi_navi' });
    return response({ data: [{ id: '1', text: 'fixture' }], paging: { next: 'https://evil.test/?token=bad', cursors: { after: 'repeated' } } });
  } });
  await api.identity(); const history = await api.history();
  assert.equal(history.complete, false);
  assert.equal(seen.length, 3);
  assert.ok(seen.every(url => !url.includes('secret')));
});
test('Threads processing waits only on IN_PROGRESS and publish is never retried', async () => {
  let polls = 0, publishCalls = 0, waits = 0;
  const api = createThreadsPhotoApi({ token: 'secret', userId: '12', wait: async ms => { assert.equal(ms, 60000); waits++; }, fetchImpl: async url => {
    if (url.pathname.endsWith('/me')) return response({ id: '12', username: 'rakutabi_navi' });
    if (url.pathname.endsWith('/threads_publish')) { publishCalls++; throw Error('SECRET FAILURE'); }
    return response({ status: ++polls < 3 ? 'IN_PROGRESS' : 'FINISHED' });
  } });
  await api.identity(); assert.equal(await api.status('13'), 'FINISHED'); assert.equal(waits, 2);
  await assert.rejects(api.publish('13'), e => /outcome unknown/.test(e.message) && !e.message.includes('SECRET'));
  assert.equal(publishCalls, 1);
  await assert.rejects(api.create({ media_type: 'TEXT', auto_publish_text: true }), /Unsupported/);
});
test('processing timeout is bounded; terminal failures do not retry', async () => {
  for (const status of ['IN_PROGRESS', 'ERROR', 'EXPIRED', 'PUBLISHED', 'unexpected']) {
    let polls = 0;
    const api = createThreadsPhotoApi({ token: 'secret', userId: '12', wait: async () => {}, fetchImpl: async url => {
      if (url.pathname.endsWith('/me')) return response({ id: '12', username: 'rakutabi_navi' });
      polls++; return response({ status });
    } });
    await api.identity();
    if (status === 'IN_PROGRESS' || status === 'unexpected') await assert.rejects(api.status('13'));
    else assert.equal(await api.status('13'), status);
    assert.equal(polls, status === 'IN_PROGRESS' ? 6 : 1);
  }
});
test('remote CAS lock excludes another process and persists state across instances', async () => {
  const store = memoryCas(), first = createPhotoJournal(store), second = createPhotoJournal(store);
  let release, ready;
  const holding = new Promise(resolve => { release = resolve; });
  const acquired = new Promise(resolve => { ready = resolve; });
  const work = first.exclusive('campaign', async () => { await first.save('campaign', { stage: 'complete', parentPostId: '7', replyPostId: '8' }); ready(); await holding; });
  await acquired;
  await assert.rejects(second.exclusive('campaign', async () => {}), /locked/);
  release(); await work;
  await second.exclusive('campaign', async () => assert.deepEqual(await second.load('campaign'), { stage: 'complete', parentPostId: '7', replyPostId: '8' }));
  await assert.rejects(second.save('campaign', {}), /exclusive/);
});
test('simultaneous empty-store lock attempts have only one winner', async () => {
  const store = memoryCas(); let entries = 0, release;
  const hold = new Promise(resolve => { release = resolve; });
  const a = createPhotoJournal(store).exclusive('campaign', async () => { entries++; await hold; });
  const b = createPhotoJournal(store).exclusive('campaign', async () => { entries++; await hold; });
  // Observe the losing rejection while the winning process holds its lock.
  const result = Promise.allSettled([a, b]);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(entries, 1); release();
  const outcomes = await result;
  assert.equal(outcomes.filter(x => x.status === 'rejected').length, 1);
});
test('uncertain publish leaves a durable lock; a new process cannot resend', async () => {
  const store = memoryCas(), journal = createPhotoJournal(store);
  await assert.rejects(journal.exclusive('campaign', async () => {
    await journal.save('campaign', { stage: 'parent-publish-intent', parentContainerId: '7' });
    throw Error('publish timeout');
  }));
  const restarted = createPhotoJournal(store);
  await assert.rejects(restarted.exclusive('campaign', async () => assert.fail('must not resume')), /locked/);
  assert.equal(store.rows.get('campaign').value.state.stage, 'parent-publish-intent');
});
test('failed or ambiguous checkpoint write never unlocks or advances', async () => {
  for (const applied of [false, true]) {
    const underlying = memoryCas(); let writes = 0;
    const store = { read: underlying.read, async write(...args) {
      writes++;
      if (writes === 2) { if (applied) await underlying.write(...args); throw Error('lost response'); }
      return underlying.write(...args);
    } };
    const journal = createPhotoJournal(store);
    await assert.rejects(journal.exclusive('campaign', async () => { await journal.save('campaign', { stage: 'parent-publish-intent' }); assert.fail(); }));
    assert.equal(writes, 2);
    await assert.rejects(createPhotoJournal(underlying).exclusive('campaign', async () => assert.fail()), /locked/);
  }
});
test('GitHub store fixes repository and branch, uses revisions and fails closed on conflicts', async () => {
  assert.throws(() => createGitHubPhotoStore({ token: 'secret', branch: 'main' }), /isolated/);
  const seen = [];
  const store = createGitHubPhotoStore({ token: 'secret', branch: 'state/rakutabi-photo-threads', fetchImpl: async (url, options) => {
    seen.push({ url, options });
    if (options.method === 'GET') return response({ sha: 'old', encoding: 'base64', content: Buffer.from('{"version":1,"lock":null,"state":null}').toString('base64') });
    const body = JSON.parse(options.body);
    assert.equal(body.sha, 'old'); assert.equal(body.branch, 'state/rakutabi-photo-threads');
    assert.equal(JSON.parse(Buffer.from(body.content, 'base64')).lock, 'owner');
    return response({ message: 'secret data' }, 409);
  } });
  assert.equal((await store.read('campaign')).revision, 'old');
  await assert.rejects(store.write('campaign', { lock: 'owner' }, 'old'), e => e.message === 'Journal request failed: HTTP 409');
  assert.equal(seen[0].url.searchParams.get('ref'), 'state/rakutabi-photo-threads');
  assert.ok(seen.every(x => x.url.pathname.startsWith('/repos/57caine/57hustler/contents/data/rakutabi-photo-state/')));
  await assert.rejects(store.read('../escape'), /Invalid/);
});
test('core, API and durable journal compose without real network', async () => {
  const today = '2026-11-01', destination = 'https://rakutabi-nine.vercel.app/area/ito';
  const plan = preparePhotoThread({ id: 'integration-fixture', date: today, brand: 'rakutabi', parent: '海辺の旅へ🌊', reply: '宿を比べてみよう', destination,
    advertising: { status: 'optional', hasProvisionOrDirection: false, evidence: 'Synthetic fixture' },
    photos: [1, 2].map(n => ({ url: `https://photos.example.test/${n}.jpg`, alt: 'テスト画像', rights: { basis: 'own-photo', holder: 'Fixture', credit: '', commercialSocial: true,
      platformRedistribution: true, evidenceUrl: 'https://photos.example.test/license', checkedOn: today, validThrough: today } })) },
  { today, allowedDestinations: [destination], allowedImageHosts: ['photos.example.test'] });
  let containers = 0, published = 0;
  const api = createThreadsPhotoApi({ token: 'fixture', userId: '12', fetchImpl: async (url, options) => {
    if (url.pathname.endsWith('/me')) return response({ id: '12', username: 'rakutabi_navi' });
    if (url.pathname.endsWith('/threads') && options.method === 'GET') return response({ data: [] });
    if (url.pathname.endsWith('/threads_publish')) { published++; return response({ id: String(100 + published) }); }
    if (options.method === 'POST') return response({ id: String(++containers) });
    return response({ status: 'FINISHED' });
  } });
  const store = memoryCas(), deps = { api, journal: createPhotoJournal(store), today, approval: { fingerprint: plan.fingerprint, date: today } };
  const state = await runPhotoThread(plan, deps);
  assert.equal(state.stage, 'complete'); assert.equal(published, 2);
  await runPhotoThread(plan, { ...deps, journal: createPhotoJournal(store) });
  assert.equal(published, 2);
});
