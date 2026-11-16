/** Rakutabi image transport preflight; read-only, never posts or modifies affiliate links.
 * Emits status for each required photo. A CDN network error is NOT proof of bad licensing.
 */
import {readFile,writeFile} from 'node:fs/promises';
import {evaluateImageResponse,validateMediaSource} from './lib/rakutabi-media-preflight.mjs';
const args=process.argv.slice(2);
const arg=(k)=>{const n=args.indexOf('--'+k);return n>=0?args[n+1]:null;};
const day=Number(arg('day'));
if(!Number.isInteger(day)||day<1||day>365)throw new Error('Day must be 1..365');
const output=process.env.RAKUTABI_MEDIA_PREFLIGHT_OUTPUT||'rakutabi-media-preflight.json';
const doc=JSON.parse(await readFile(new URL('../data/rakutabi-threads-hotel-posts.json',import.meta.url),'utf8'));
const post=doc.posts.find(p=>p.day===day);
const report={day,checkedAt:new Date().toISOString(),status:'not_scheduled',hotelNo:post?.hotelNo??null,photos:[],note:'Transport availability only, not legal image licensing proof; no user data or affiliate tracking.'};
async function inspect(p,index){
 const row={index:index+1,status:'unavailable',httpStatus:null,contentType:null,url:p.url,reason:null};
 try{
  const source=validateMediaSource(p);
  // HEAD avoids downloading files. A single small ranged GET is a fallback for blocked HEAD.
  const request=async(method)=>fetch(source,{method,headers:method==='GET'?{Range:'bytes=0-0'}:{},redirect:'follow',signal:AbortSignal.timeout(9000)});
  let response=await request('HEAD');
  if([403,405,501].includes(response.status))response=await request('GET');
  row.httpStatus=response.status;row.contentType=response.headers.get('content-type');
  row.status=evaluateImageResponse(response.status,row.contentType);
  if(row.status!=='ok')row.reason='http_or_content_type_not_image';
  if(response.body)await response.body.cancel();
 }catch(e){row.status='unavailable';row.reason=e instanceof TypeError?'network_error':'timeout_or_invalid_url';}
 return row;
}
if(post){
 report.photos=await Promise.all(post.photos.map(inspect));
 report.status=report.photos.length===0?'no_photos':report.photos.every(p=>p.status==='ok')?'ok':report.photos.some(p=>p.status==='ok')?'partial':'unavailable';
}
await writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({day:report.day,status:report.status,ok:report.photos.filter(x=>x.status==='ok').length,total:report.photos.length,output}));
if(report.status!=='ok')console.warn('::warning::Rakutabi photo URL transport not fully verified for day '+day+' ('+report.status+'). Review artifact; publication still uses existing fail-closed rules.');
