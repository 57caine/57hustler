import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const run=(day,...args)=>spawnSync(process.execPath,['scripts/post-organic-threads.mjs','--brand','rakutabi','--day',String(day),...args],{encoding:'utf8',env:{...process.env,ENABLE_ORGANIC_THREADS_PUBLISH:'false'}});
test('day16 has licensed hotel image and booking reply content',()=>{
 const r=run(16);
 assert.equal(r.status,0,r.stderr);
 const v=JSON.parse(r.stdout);
 assert.equal(v.mode,'dry-run');
 assert.equal(v.hotelNo,2013);
 assert.match(v.caption,/Volfgang.*CC BY-SA 3.0/);
 assert.match(v.reply,/【PR】.*ホテルニューグランド/);
 assert.match(v.reply,/hb\.afl\.rakuten\.co\.jp/);
 assert.match(v.imageUrl,/upload\.wikimedia\.org/);
 assert.equal(v.nearbySources.length,2);
});
test('publishing remains disabled without authorized credentials',()=>{
 const r=run(16,'--publish');
 assert.notEqual(r.status,0);
 assert.match(r.stderr,/Publish not authorized/);
});
test('day17 refuses old text-only fallback when no hotel campaign is verified',()=>{
 const r=run(17);
 assert.notEqual(r.status,0);
 assert.match(r.stderr,/No verified hotel-image campaign/);
 assert.doesNotMatch(r.stdout,/荷物を預けて/);
});
