/** Read-only Rakutabi Threads media insights. No posting and no access-token logging. */
import {readFile,writeFile} from 'node:fs/promises';
import {matchRakutabiPost,parseMediaInsights} from './lib/rakutabi-insights.mjs';
const OUTPUT=process.env.RAKUTABI_INSIGHTS_OUTPUT||'rakutabi-threads-insights.json';
const report={snapshotAt:new Date().toISOString(),status:'unavailable',posts:[],meta:{note:'Read-only Meta Threads post metrics. These are NOT booking clicks, reservations or commissions. Missing metrics are null, not zero.'}};
async function query(path,token){
 const url=new URL('https://graph.threads.net/v1.0/'+path);url.searchParams.set('access_token',token);
 const res=await fetch(url,{signal:AbortSignal.timeout(12000)});
 const json=await res.json();
 if(!res.ok||json.error)throw new Error('Threads API unavailable (HTTP '+res.status+')');
 return json;
}
try{
 const token=process.env.RAKUTABI_THREADS_ACCESS_TOKEN;
 if(!token){report.status='not_configured';}
 else{
   const me=await query('me?fields=id,username',token);
   if(me.username?.toLowerCase()!=='rakutabi_navi'||(process.env.RAKUTABI_THREADS_USER_ID&&String(me.id)!==process.env.RAKUTABI_THREADS_USER_ID))throw Error('Account mismatch');
   const campaigns=JSON.parse(await readFile(new URL('../data/rakutabi-threads-hotel-posts.json',import.meta.url),'utf8')).posts;
   let after;let complete=false;let seen=new Set();
   const media=[];
   for(let page=0;page<5;page++){
    const params=new URLSearchParams({fields:'id,text,timestamp,media_type',limit:'100'});
    if(after)params.set('after',after);
    const batch=await query('me/threads?'+params,token);
    if(!Array.isArray(batch.data))throw Error('Unreadable Threads history');
    media.push(...batch.data);
    if(!batch.paging?.next){complete=true;break;}
    after=batch.paging?.cursors?.after;
    if(!after||seen.has(after))throw Error('Incomplete Threads history');
    seen.add(after);
   }
   report.meta.historyComplete=complete;
   report.meta.historyRows=media.length;
   const rows=media.map(m=>({media:m,post:matchRakutabiPost(m,campaigns)})).filter(x=>x.post);
   report.status=complete?'ok':'partial_history';
   for(const {media:m,post} of rows){
    const result={day:post.day,hotelNo:post.hotelNo,hotelName:post.hotelName,segment:post.experimentGroup||'unclassified',mediaId:String(m.id),postedAt:m.timestamp||null,views:null,likes:null,replies:null,reposts:null,quotes:null,shares:null,insightsStatus:'unavailable'};
    try{
      const v=await query(encodeURIComponent(String(m.id))+'/insights?metric=views,likes,replies,reposts,quotes,shares',token);
      Object.assign(result,parseMediaInsights(v));
      result.insightsStatus='ok';
    }catch {result.insightsStatus='permission_or_metric_unavailable';}
    report.posts.push(result);
   }
 }
}catch(e){report.status='unavailable';report.meta.errorCategory=e.message==='Account mismatch'?'account_mismatch':'api_or_permission_error';}
await writeFile(OUTPUT,JSON.stringify(report,null,2));
console.log(JSON.stringify({status:report.status,rows:report.posts.length,insightsOk:report.posts.filter(x=>x.insightsStatus==='ok').length,output:OUTPUT}));
