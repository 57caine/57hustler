import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const run=(...args)=>spawnSync(process.execPath,['scripts/post-organic-threads.mjs','--brand','rakutabi','--day','16',...args],{encoding:'utf8',env:{...process.env,ENABLE_ORGANIC_THREADS_PUBLISH:'false'}});
test('Rakutabi fails closed without verified hotel photo / booking reply',()=>{
 const r=run();
 assert.notEqual(r.status,0);
 assert.match(r.stderr,/No verified hotel-image campaign/);
 assert.doesNotMatch(r.stdout,/mode.*publish/);
});
test('Rakutabi never falls back to obsolete text-only campaign on publish attempt',()=>{
 const r=run('--publish');
 assert.notEqual(r.status,0);
 assert.match(r.stderr,/No verified hotel-image campaign/);
 assert.doesNotMatch(r.stdout,/ひとり温泉|朝が苦手/);
});
