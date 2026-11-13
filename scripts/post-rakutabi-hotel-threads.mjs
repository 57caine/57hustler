/**
 * Threads image-parent + booking-link reply.
 * Only use independently licensed hotel photography; Rakuten Travel API photos
 * may NOT be posted on SNS (Rakuten Travel affiliate image rules).
 * Dry-run unless --publish and ENABLE_ORGANIC_THREADS_PUBLISH=true.
 */
import { readFile } from 'node:fs/promises';
const args=process.argv.slice(2);
const flag=(key)=>{const i=args.indexOf('--'+key);return i<0?null:args[i+1];};
const day=Number(flag('day'));
const publish=args.includes('--publish');
if(!Number.isInteger(day)||day<1||day>365)throw new Error('Invalid day');
const doc=JSON.parse(await readFile(new URL('../data/rakutabi-threads-hotel-posts.json',import.meta.url),'utf8'));
const post=doc.posts.find(x=>x.day===day);
if(!post)throw new Error('No verified hotel-image campaign for day '+day+'; legacy TEXT fallback prohibited');
if(!Number.isInteger(post.hotelNo)||post.hotelNo<1||!post.hotelName||!post.caption||!post.bookingUrl||!Array.isArray(post.nearbySources)||post.nearbySources.length<1)throw new Error('Missing hotel identity, booking link or independent nearby source');
if(!Array.isArray(post.photos)||post.photos.length<3||post.photos.length>10)throw new Error('At least 3 independently licensed photos required; no one-image fallback');
const photos=post.photos.map((p,index)=>{
 const rights=p.photoRights;
 if(!p.url||!p.alt||!rights||!['independent-licensed','hotel-permission','photographer-permission'].includes(rights.source))throw new Error('Missing rights for photo '+(index+1));
 if(!rights.proofUrl||!rights.licenseUrl||!rights.scope?.includes('Threads')||!rights.owner||!rights.license)throw new Error('Document photo license and attribution');
 const url=new URL(p.url);
 if(url.protocol!=='https:'||/rakuten\\.co\\.jp|rakuten\\.ne\\.jp/.test(url.hostname))throw new Error('Cannot post Rakuten images');
 return {...p,url:url.href,rights};
});
if(new Set(photos.map(x=>x.url)).size!==photos.length)throw new Error('Duplicate carousel images prohibited');
const booking=new URL(post.bookingUrl);
if(booking.protocol!=='https:'||booking.hostname!=='hb.afl.rakuten.co.jp'||booking.pathname==='/')throw new Error('Invalid Rakuten affiliate booking URL');
if(post.caption.length>460||post.caption.includes('http://')||post.caption.includes('https://'))throw new Error('Parent caption too long or contains link');
if(post.nearbySources.some(s=>!s.claim||!s.url||new URL(s.url).protocol!=='https:'))throw new Error('Nearby claims need primary source URLs');
const marker='【宿番号 '+post.hotelNo+'・企画'+day+'】';
const caption='【PR】 '+post.caption+'\n'+marker;
const reply='【PR】楽天トラベルで「'+post.hotelName+'」の宿泊プランを確認👇\\n'+post.bookingUrl;
const photoCredits='📷写真出典・ライセンス（画像は無加工）\\n'+photos.map((p,i)=>(i+1)+'. '+p.rights.owner+' / '+p.rights.license+'\\n'+p.rights.proofUrl).join('\\n')+'\\n各写真の詳細ライセンスは出典ページに記載。';
if(caption.length>500||reply.length>500||photoCredits.length>500)throw new Error('Threads 500 character limit exceeded');
console.log(JSON.stringify({mode:publish?'publish':'dry-run',hotelNo:post.hotelNo,hotelName:post.hotelName,photos:photos.map(p=>({url:p.url,alt:p.alt,rights:p.rights})),nearbySources:post.nearbySources,caption,reply,photoCredits},null,2));
if(!publish)process.exit(0);
if(process.env.ENABLE_ORGANIC_THREADS_PUBLISH!=='true')throw new Error('Publish not authorized');
const token=process.env.RAKUTABI_THREADS_ACCESS_TOKEN;
if(!token)throw new Error('RAKUTABI_THREADS_ACCESS_TOKEN absent');
const API='https://graph.threads.net/v1.0';
async function call(path,form,stage) {
 let response,json;
 try{
  response=await fetch(API+path,{method:form?'POST':'GET',...(form?{body:new URLSearchParams({...form,access_token:token})}:{}) ,signal:AbortSignal.timeout(20000)});
  json=await response.json();
 }catch{throw new Error(stage+' result ambiguous: inspect public account history BEFORE retry');}
 if(!response.ok||json.error)throw new Error(stage+' failed (HTTP '+response.status+', code '+(json.error?.code??'unknown')+')');
 return json;
}
const me=await call('/me?'+new URLSearchParams({fields:'id,username',access_token:token}),null,'identity');
if(me.username?.toLowerCase()!=='rakutabi_navi'||(process.env.RAKUTABI_THREADS_USER_ID&&String(me.id)!==process.env.RAKUTABI_THREADS_USER_ID))throw new Error('Wrong posting account');
const id=String(me.id);
let after;let complete=false;
const history=[];
for(let page=0;page<10;page++){
 const q=new URLSearchParams({fields:'id,text,reply_to_id',limit:'100',access_token:token});
 if(after)q.set('after',after);
 const h=await call('/'+id+'/threads?'+q,null,'history');
 if(!Array.isArray(h.data))throw new Error('History unavailable');
 history.push(...h.data);
 if(!h.paging?.next){complete=true;break;}
 after=h.paging?.cursors?.after;
 if(!after)break;
}
if(!complete)throw new Error('Cannot exhaust history; abort to prevent duplicate');
let parent=history.find(p=>typeof p.text==='string'&&p.text.includes(marker));
if(parent){
 const linked=history.find(p=>String(p.reply_to_id??'')===String(parent.id)&&typeof p.text==='string'&&p.text.includes(post.bookingUrl));
 if(linked){console.log(JSON.stringify({status:'already-published',parentId:parent.id,replyId:linked.id}));process.exit(0);}
 // API may not expose enough history or replies for safe recovery.
 throw new Error('Existing parent '+parent.id+' found without verified reply. Stop and inspect thread manually (no duplicate parent).');
}
const childIds=[];
for(const [index,photo] of photos.entries()){
 const child=await call('/'+id+'/threads',{media_type:'IMAGE',image_url:photo.url,alt_text:photo.alt,is_carousel_item:'true'},'carousel-item-'+(index+1));
 if(!child.id)throw new Error('Missing image carousel child '+(index+1));
 childIds.push(String(child.id));
}
const ctr=await call('/'+id+'/threads',{media_type:'CAROUSEL',children:childIds.join(','),text:caption,topic_tag:'国内旅行'},'carousel-container');
if(!ctr.id)throw new Error('No image container ID');
await new Promise(r=>setTimeout(r,8000));
const sent=await call('/'+id+'/threads_publish',{creation_id:String(ctr.id)},'parent-publish');
if(!sent.id)throw new Error('No published parent ID');
console.log(JSON.stringify({stage:'parent-published',parentId:sent.id,hotelNo:post.hotelNo}));
const replyCtr=await call('/'+id+'/threads',{media_type:'TEXT',text:reply,reply_to_id:String(sent.id)},'reply-container');
if(!replyCtr.id)throw new Error('Reply container failed; parent '+sent.id+' must be reconciled');
await new Promise(r=>setTimeout(r,5000));
const replySent=await call('/'+id+'/threads_publish',{creation_id:String(replyCtr.id)},'reply-publish');
if(!replySent.id)throw new Error('Reply publish ID unavailable; inspect account history first');
console.log(JSON.stringify({status:'published-carousel-and-booking-reply',parentId:sent.id,replyId:replySent.id,photos:photos.length,hotelNo:post.hotelNo}));
// A separate reply provides author credits and source links without burying booking CTA.
const creditCtr=await call('/'+id+'/threads',{media_type:'TEXT',text:photoCredits,reply_to_id:String(sent.id)},'credit-container');
if(!creditCtr.id)throw new Error('Photo credit reply missing container; inspect the published parent');
await new Promise(r=>setTimeout(r,5000));
const creditSent=await call('/'+id+'/threads_publish',{creation_id:String(creditCtr.id)},'credit-publish');
if(!creditSent.id)throw new Error('Photo credit publish uncertain; inspect post history');
console.log(JSON.stringify({status:'complete-with-photo-credits',parentId:sent.id,bookingReplyId:replySent.id,creditReplyId:creditSent.id}));
