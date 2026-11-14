import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const run=(day,...args)=>spawnSync(process.execPath,['scripts/post-organic-threads.mjs','--brand','rakutabi','--day',String(day),...args],{encoding:'utf8',env:{...process.env,ENABLE_ORGANIC_THREADS_PUBLISH:'false'}});
test('day16 has three independently licensed photos and booking reply content',()=>{
 const r=run(16);
 assert.equal(r.status,0,r.stderr);
 const v=JSON.parse(r.stdout);
 assert.equal(v.mode,'dry-run');
 assert.equal(v.hotelNo,2013);
 assert.equal(v.photos.length,3);
 assert.deepEqual(v.photos.map(p=>p.rights.owner),['Volfgang','Kounosu','Morio']);
 assert.ok(v.photos.every(p=>p.rights.license && p.rights.proofUrl && p.rights.scope.includes('Threads')));
 assert.ok(v.photoCredits.some(text=>text.includes('Kounosu')));
 assert.ok(v.photoCredits.every(text=>text.length<=500));
 assert.match(v.reply,/【PR】.*ホテルニューグランド/);
 assert.match(v.reply,/hb\.afl\.rakuten\.co\.jp/);
 assert.ok(v.photos.every(p=>p.url.includes('upload.wikimedia.org')));
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

test('photo counts: zero skips, one is IMAGE, two through six are CAROUSEL, seven rejected',async()=>{
 const {selectPhotoMedia}=await import('../scripts/lib/rakutabi-photo-policy.mjs');
 assert.equal(selectPhotoMedia([]),'SKIP');
 assert.equal(selectPhotoMedia([1]),'IMAGE');
 for(const n of [2,3,4,5,6]) assert.equal(selectPhotoMedia(Array(n).fill(1)),'CAROUSEL');
 assert.throws(()=>selectPhotoMedia(Array(7).fill(1)),/Maximum 6/);
 assert.throws(()=>selectPhotoMedia(null),/array/);
});

test('six photos fit in multiple copyright replies when required',async()=>{
 const {photoCreditMessages}=await import('../scripts/lib/rakutabi-photo-policy.mjs');
 const photos=Array.from({length:6},(_,i)=>({
  rights:{owner:'Photographer '+i,license:'CC BY-SA 4.0',proofUrl:'https://commons.wikimedia.org/wiki/File:Hotel_photo_'+i+'.jpg',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'}
 }));
 const replies=photoCreditMessages(photos);
 assert.ok(replies.length>=2);
 assert.ok(replies.every(reply=>reply.length<=500));
 for(let i=0;i<6;i++)assert.ok(replies.some(reply=>reply.includes('Photographer '+i)));
});

test('API diagnostics preserve cause and codes while removing credentials and URLs',async()=>{
 const {threadsApiError}=await import('../scripts/lib/threads-api-error.mjs');
 const token='fixture-token+with/slash';
 const message=threadsApiError('carousel-container',400,{
  code:100,error_subcode:2207008,is_transient:false,
  message:'Media is not ready\n'+token+' '+encodeURIComponent(token)+' '+new URLSearchParams({t:token}).toString().slice(2)+' https://example.invalid/?access_token=other-secret Bearer other-secret access_token=other-secret client_secret=other-secret',
  extra:'raw-response-must-not-be-logged'
 },token);
 assert.match(message,/HTTP 400, code 100, subcode 2207008, transient false/);
 assert.match(message,/Media is not ready/);
 for(const secret of [token,encodeURIComponent(token),'other-secret','example.invalid','raw-response-must-not-be-logged'])assert.ok(!message.includes(secret),message);
 assert.doesNotMatch(message,/[\r\n]/);
});

test('missing, malformed and oversized error details remain bounded',async()=>{
 const {threadsApiError}=await import('../scripts/lib/threads-api-error.mjs');
 assert.match(threadsApiError('history',502,null,'fixture'),/code unknown.*unavailable/);
 const error=threadsApiError('history',400,{code:'secret',error_subcode:{secret:true},message:'x'.repeat(2000)},'fixture');
 assert.doesNotMatch(error,/secret/);
 assert.ok(error.length<650);
});

test('mock carousel rejection reports sanitized cause, exits and never publishes or retries',()=>{
 const mock=`
 const calls=[];
 process.on('exit',()=>console.log('MOCK_CALLS='+JSON.stringify(calls)));
 globalThis.fetch=async (input,options={})=>{
  const url=new URL(input);const form=options.body;
  calls.push({path:url.pathname,method:options.method});
  let body;
  if(url.pathname==='/v1.0/me')body={id:'fixture-account',username:'rakutabi_navi'};
  else if(options.method==='GET')body={data:[]};
  else if(form.get('is_carousel_item')==='true')body={id:'child-'+calls.length};
  else if(form.get('media_type')==='CAROUSEL')return {ok:false,status:400,json:async()=>({error:{code:100,error_subcode:2207008,message:'Media is not ready; access_token=fixture-secret-token'}})};
  else throw new Error('Unexpected request');
  return {ok:true,status:200,json:async()=>body};
 };
 `;
 const r=spawnSync(process.execPath,['--import','data:text/javascript,'+encodeURIComponent(mock),'scripts/post-organic-threads.mjs','--brand','rakutabi','--day','16','--publish'],{
  encoding:'utf8',env:{...process.env,ENABLE_ORGANIC_THREADS_PUBLISH:'true',RAKUTABI_THREADS_ACCESS_TOKEN:'fixture-secret-token',RAKUTABI_THREADS_USER_ID:'fixture-account'}
 });
 assert.notEqual(r.status,0);
 assert.match(r.stderr,/carousel-container failed.*subcode 2207008.*Media is not ready/);
 assert.ok(!r.stderr.includes('fixture-secret-token'));
 const calls=JSON.parse(r.stdout.match(/MOCK_CALLS=(.*)/)[1]);
 assert.equal(calls.length,6,'one identity, one history, three children, one carousel; no retry');
 assert.ok(calls.every(c=>!c.path.includes('threads_publish')));
 assert.doesNotMatch(r.stdout,/parent-published|complete-with-photo-credits/);
});
