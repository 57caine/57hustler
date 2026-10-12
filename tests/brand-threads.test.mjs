import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const data = JSON.parse(await readFile(new URL('../data/social-launch-posts-20261011.json', import.meta.url), 'utf8'));
const script = new URL('../scripts/post-brand-threads.mjs', import.meta.url);
test('exactly six unique brand/day drafts and all messages fit 500 characters', () => {
  assert.equal(data.posts.length, 6);
  assert.deepEqual([...new Set(data.posts.map(p => p.brand + ':' + p.day))].sort(),
    ['lens:1','lens:2','lens:3','rakutabi:1','rakutabi:2','rakutabi:3']);
  for (const p of data.posts) {
    assert.ok(p.text.startsWith('【PR】'));
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

function publishWithMock(scenario) {
  const dir = mkdtempSync(join(tmpdir(), 'brand-threads-'));
  const mock = join(dir, 'fetch.mjs');
  writeFileSync(mock, `
    let reads = 0;
    globalThis.fetch = async (url, options = {}) => {
      const scenario = ${JSON.stringify(scenario)};
      const respond = body => ({ ok:true, status:200, json:async()=>body });
      if (String(url).includes('/me?')) return respond({id:'123',username:scenario === 'wrong-account' ? 'westin_lab' : 'lens_navi_jp'});
      if (!options.method) {
        reads++;
        if (scenario === 'history-error') return {ok:false,status:400,json:async()=>({error:{code:190,message:'secret-token'}})};
        if (scenario === 'network-error') throw new Error('secret-token');
        if (scenario === 'malformed') return respond({});
        if (scenario === 'incomplete') return respond({data:[],paging:{next:'https://evil.invalid/?access_token=secret-token',cursors:{after:'same'}}});
        if (scenario === 'duplicate' || scenario === 'page-two' && reads === 2) return respond({data:[{id:'999',text:${JSON.stringify(data.posts.find(p=>p.brand==='lens'&&p.day===1).url)}}]});
        if (scenario === 'page-two') return respond({data:[],paging:{next:'https://evil.invalid',cursors:{after:'next'}}});
        return respond({data:[]});
      }
      console.log('MOCK_POST');
      return respond({id:'456'});
    };
  `);
  try {
    return spawnSync(process.execPath, ['--import', mock, script.pathname, '--brand','lens','--day','1','--publish'], {
      encoding:'utf8', env:{PATH:process.env.PATH,ENABLE_BRAND_THREADS_PUBLISH:'true',LENS_THREADS_USER_ID:'123',LENS_THREADS_ACCESS_TOKEN:'secret-token'},
    });
  } finally { rmSync(dir,{recursive:true,force:true}); }
}
test('duplicate campaign on first or later page makes no write request', () => {
  for (const scenario of ['duplicate','page-two']) {
    const r = publishWithMock(scenario);
    assert.equal(r.status,0,r.stderr);
    assert.match(r.stdout,/skipped-already-published/);
    assert.doesNotMatch(r.stdout,/MOCK_POST/);
  }
});
test('wrong identity, unreadable or incomplete history stops before any write', () => {
  for (const scenario of ['wrong-account','history-error','network-error','malformed','incomplete']) {
    const r = publishWithMock(scenario);
    assert.notEqual(r.status,0);
    assert.doesNotMatch(r.stdout,/MOCK_POST/);
    assert.doesNotMatch(r.stderr,/secret-token|evil.invalid|westin_lab/);
  }
});
test('verified identity and complete empty history permit one create and one publish', () => {
  const r = publishWithMock('new');
  assert.equal(r.status,0,r.stderr);
  assert.equal(r.stdout.match(/MOCK_POST/g)?.length,2);
  assert.match(r.stdout,/"status":"published"/);
});

