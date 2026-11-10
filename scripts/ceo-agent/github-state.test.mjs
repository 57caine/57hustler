import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkpoint, checkpointPath, BRANCH } from './github-state.mjs';
const spec = { task: 'https://github.com/57caine/57hustler/pull/192', owner: 'CEO', rollback: 'no side effects', acceptance: ['published ID'], approval: 'existing', evidence: [{ url: 'https://example.test', checked_at: '2026-11-10T00:00:00Z', result: 'fixture only' }] };
const response = (status, data) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
function fake(conflict = false) {
 let file; const calls = [];
 return { calls, fetchImpl: async (url, options) => {
  calls.push({ url, options });
  if (options.method === 'PUT') {
   const body = JSON.parse(options.body);
   assert.equal(body.branch, BRANCH);
   if (conflict) return response(409);
   if (file) assert.equal(body.sha, file.sha);
   file = { content: body.content, sha: String(calls.length) };
   return response(200, {});
  }
  assert.ok(url.endsWith('?ref=ceo-agent-state'));
  return file ? response(200, file) : response(404);
 } };
}
test('remote initialize/read/advance persists and resumes with exact SHA lease', async () => {
 const backend = fake();
 const invoke = (command, input) => checkpoint({ ...backend, token: 'fixture', id: 'pr-192', command, input });
 assert.equal((await invoke('init', spec)).revision, 0);
 assert.equal((await invoke('show')).status, 'queued');
 assert.equal((await invoke('advance', { type: 'implement', actor: 'CEO', revision: 0, commit_sha: 'a'.repeat(40) })).revision, 1);
 await assert.rejects(invoke('advance', { type: 'implement', actor: 'CEO', revision: 0, commit_sha: 'a'.repeat(40) }), /Stale revision/);
 await assert.rejects(invoke('init', spec), /already exists/);
});
test('conflict does not retry or report a saved state', async () => {
 const backend = fake(true);
 await assert.rejects(checkpoint({ ...backend, token: 'fixture', id: 'pr-192', command: 'init', input: spec }), /409/);
 assert.equal(backend.calls.filter(c => c.options.method === 'PUT').length, 1);
});
test('missing credentials, arbitrary paths and forbidden commands cannot write', async () => {
 const backend = fake();
 await assert.rejects(checkpoint({ ...backend, id: 'pr-192', command: 'init', input: spec }), /credential unavailable/);
 for (const id of ['../../main', 'pr-0', 'pr-192?ref=main']) assert.throws(() => checkpointPath(id));
 await assert.rejects(checkpoint({ ...backend, token: 'fixture', id: 'pr-192', command: 'deploy' }), /Unknown command/);
 assert.equal(backend.calls.length, 0);
});
