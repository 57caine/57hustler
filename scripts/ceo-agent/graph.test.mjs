import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createTask, transition } from './graph.mjs';
const source = [{ url: 'https://example.test/log', checked_at: '2026-11-10T00:00:00Z', result: 'fixture evidence, not production' }];
const spec = { task: 'fixture', owner: 'CEO', rollback: 'revert fixture', acceptance: ['CI', 'mobile'], evidence: source, approval: 'existing' };
const sha = 'a'.repeat(40);
const go = (s, type, extra = {}) => transition(s, { type, actor: 'CEO', revision: s.revision, ...extra });
const checks = result => spec.acceptance.map(name => ({ name, result, evidence: source }));
const start = () => go(createTask(spec), 'implement', { commit_sha: sha });
test('complete verified route preserves SHA and observation', () => {
 let s = go(start(), 'verify', { commit_sha: sha, checks: checks('pass') });
 assert.equal(s.status, 'ready');
 s = go(s, 'published', { commit_sha: sha, evidence: source });
 assert.equal(s.status, 'observing');
 assert.equal(go(s, 'observe', { evidence: source, conclusion: 'Effect unknown' }).status, 'done');
});
test('missing/duplicate criteria, stale SHA, revision and owner cannot pass', () => {
 const s = start();
 for (const extra of [{ checks: checks('pass').slice(0,1) }, { checks: [checks('pass')[0], checks('pass')[0]] }, { commit_sha: 'b'.repeat(40) }, { revision: 99 }, { actor: 'Claude' }]) {
  assert.throws(() => go(s, 'verify', { commit_sha: sha, checks: checks('pass'), ...extra }));
 }
});
test('not_run does not pass; third failed verification blocks', () => {
 let s = start();
 for (let i = 0; i < 3; i++) {
  s = go(s, 'verify', { commit_sha: sha, checks: checks('not_run') });
  assert.equal(s.status, i === 2 ? 'blocked' : 'implementing');
  if (i < 2) s = go(s, 'implement', { commit_sha: sha });
 }
 assert.throws(() => go(s, 'implement', { commit_sha: sha }));
});
test('contract mutation, no evidence, early publication and AI approval rejected', () => {
 const s = start(); s.spec.acceptance = ['CI'];
 assert.throws(() => go(s, 'verify', { commit_sha: sha, checks: checks('pass') }));
 assert.throws(() => createTask({ ...spec, evidence: [] }));
 assert.throws(() => go(start(), 'published', { commit_sha: sha, evidence: source }));
 let final = go(createTask({ ...spec, approval: 'final' }), 'implement', { commit_sha: sha });
 final = go(final, 'verify', { commit_sha: sha, checks: checks('pass') });
 assert.equal(final.status, 'awaiting_approval');
 assert.throws(() => go(final, 'approve', { approved: true }));
});
test('CLI persists resume state and stale writes leave checkpoint intact', () => {
 const dir = mkdtempSync(join(tmpdir(), 'ceo-graph-'));
 const state = join(dir, 'state.json'), input = join(dir, 'input.json');
 const run = cmd => spawnSync(process.execPath, ['scripts/ceo-agent/state.mjs', cmd, state, input], { encoding: 'utf8' });
 try {
  writeFileSync(input, JSON.stringify(spec)); assert.equal(run('init').status, 0);
  assert.notEqual(run('init').status, 0);
  writeFileSync(input, JSON.stringify({ type: 'implement', actor: 'CEO', revision: 0, commit_sha: sha }));
  assert.equal(run('advance').status, 0);
  const before = readFileSync(state, 'utf8');
  assert.notEqual(run('advance').status, 0);
  assert.equal(readFileSync(state, 'utf8'), before);
  assert.equal(JSON.parse(before).status, 'verifying');
 } finally { rmSync(dir, { recursive: true, force: true }); }
});
