import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mitamaDayForDate, mitamaDayAt } from '../scripts/lib/mitama-schedule.mjs';
import { buildOrganicMessage } from '../scripts/lib/organic-threads-message.mjs';
const posts = JSON.parse(readFileSync('data/mitama-threads-posts.json')).posts;
const drafts = JSON.parse(readFileSync('docs/drafts/mitama-20261108-14.json')).posts;
test('finite November dates retain old mapping and map seven new drafts', () => {
  for (let day = 1; day <= 14; day++) {
    const n = mitamaDayForDate(`2026-11-${String(day).padStart(2, '0')}`);
    assert.equal(n, day + 17);
    assert.equal(posts.filter(p => p.day === n).length, 1);
  }
  for (const date of ['2026-10-31','2026-11-00','2026-11-15','2026-12-01','2027-11-01','2026-11-1','2026-11-99']) {
    assert.throws(() => mitamaDayForDate(date));
  }
});
test('JST day boundaries stop at expiry and do not use the prior UTC day', () => {
  assert.throws(() => mitamaDayAt(new Date('2026-10-31T14:59:59Z')));
  assert.equal(mitamaDayAt(new Date('2026-10-31T15:00:00Z')), 18);
  assert.equal(mitamaDayAt(new Date('2026-11-07T15:00:00Z')), 25);
  assert.equal(mitamaDayAt(new Date('2026-11-14T14:59:59Z')), 31);
  assert.throws(() => mitamaDayAt(new Date('2026-11-14T15:00:00Z')));
});
test('seven reviewed drafts match, fit, remain unique and dry-run without credentials', () => {
  assert.equal(posts.length, 31);
  assert.equal(new Set(posts.map(p => p.text)).size, 31);
  for (const draft of drafts) {
    const p = posts.find(p => p.day === draft.day);
    assert.equal(p.text, draft.text);
    const message = buildOrganicMessage(p, 'mitama');
    assert.ok(message.length <= 500 && message.includes('?'));
    assert.match(message, /japan|japanese/i);
    const r = spawnSync(process.execPath, ['scripts/post-organic-threads.mjs','--brand','mitama','--day',String(p.day)], { encoding:'utf8',env:{} });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(JSON.parse(r.stdout).message, message);
  }
});
test('workflow keeps retry hours, identity credentials, opt-in and serial execution', () => {
  const w = readFileSync('.github/workflows/mitama-threads-post.yml', 'utf8');
  assert.match(w, /cron: '15 0,3,6,9 1-14 11 \*'/);
  assert.match(w, /node scripts\/lib\/mitama-schedule.mjs >> "\$GITHUB_OUTPUT"/);
  assert.match(w, /cancel-in-progress: false/);
  assert.match(w, /MITAMA_THREADS_USER_ID/);
  assert.match(w, /default: false/);
  for (let d=25;d<=31;d++) assert.ok(w.includes(`- '${d}'`));
});
function publish(scenario) {
  const dir = mkdtempSync(join(tmpdir(), 'mitama-next-'));
  const mock = join(dir, 'fetch.mjs');
  writeFileSync(mock, `
    globalThis.fetch=async(url,options={})=>{
      const reply=data=>({ok:true,status:200,json:async()=>data});
      if(String(url).includes('/me?')) return reply({id:'123',username:${JSON.stringify(scenario === 'wrong' ? 'wrong.account' : 'mitama.wisdom')}});
      if(!options.method) return reply(${JSON.stringify(scenario === 'duplicate' ? {data:[{text:posts.find(p=>p.day===25).text}]} : {data:[],paging:{next:'https://invalid.test',cursors:{after:'same'}}})});
      console.log('UNEXPECTED_WRITE');throw new Error('No real writes allowed');
    };`);
  try { return spawnSync(process.execPath, ['--import',mock,'scripts/post-organic-threads.mjs','--brand','mitama','--day','25','--publish'], {
    encoding:'utf8',env:{ENABLE_ORGANIC_THREADS_PUBLISH:'true',MITAMA_THREADS_USER_ID:'123',MITAMA_THREADS_ACCESS_TOKEN:'test-only'},
  }); } finally { rmSync(dir,{recursive:true,force:true}); }
}
test('existing duplicate, wrong account and incomplete history never publish', () => {
  for (const s of ['duplicate','wrong','incomplete']) {
    const r = publish(s);
    assert.equal(r.stdout.includes('UNEXPECTED_WRITE'), false);
    if(s==='duplicate') {assert.equal(r.status,0);assert.match(r.stdout,/skipped-already-published/);}
    else assert.notEqual(r.status,0);
  }
});
test('upper bound and unauthorized publication fail closed', () => {
  for (const args of [ ['--brand','mitama','--day','32'], ['--brand','lens','--day','18'], ['--brand','rakutabi','--day','19'], ['--brand','mitama','--day','25','--publish'] ]) {
    const r=spawnSync(process.execPath,['scripts/post-organic-threads.mjs',...args],{encoding:'utf8',env:{}});
    assert.notEqual(r.status,0);
  }
});
