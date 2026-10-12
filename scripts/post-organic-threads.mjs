/** Manual organic Threads launcher; dry-run by default. Never reads legacy credentials. */
import { readFile } from 'node:fs/promises';
const args = process.argv.slice(2);
function arg(name) { const i=args.indexOf('--'+name); return i<0?undefined:args[i+1]; }
const brand=arg('brand'), day=Number(arg('day')), publish=args.includes('--publish');
const CONFIG={
  rakutabi:{handle:'rakutabi_navi',token:'RAKUTABI_THREADS_ACCESS_TOKEN',userId:'RAKUTABI_THREADS_USER_ID'},
  lens:{handle:'lens_navi_jp',token:'LENS_THREADS_ACCESS_TOKEN',userId:'LENS_THREADS_USER_ID'}
};
if(!Object.hasOwn(CONFIG,brand)||!Number.isInteger(day)||day<1||day>3) throw new Error('Invalid brand/day');
const cfg=CONFIG[brand];
const data=JSON.parse(await readFile(new URL('../data/organic-threads-posts-20261013.json',import.meta.url),'utf8'));
const post=data.posts.find(p=>p.brand===brand&&p.day===day);
if(!post||typeof post.text!=='string'||!post.text.trim()||post.text.length>500) throw new Error('Invalid post');
if(/https?:\/\/|【PR】|#PR|アフィリエイト/i.test(post.text)) throw new Error('Organic content must not contain promotional links/disclosures');
console.log(JSON.stringify({mode:publish?'publish':'dry-run',brand,expectedHandle:cfg.handle,day,message:post.text}));
if(!publish) process.exit(0);
if(process.env.ENABLE_ORGANIC_THREADS_PUBLISH!=='true') throw new Error('Publishing not authorized');
const token=process.env[cfg.token], configuredId=process.env[cfg.userId];
if(!token) throw new Error('Missing brand token');
const API='https://graph.threads.net/v1.0';
async function call(url,options={},stage='request'){
 let response,json;
 try {response=await fetch(url,{...options,signal:AbortSignal.timeout(15000)});json=await response.json();}
 catch {throw new Error('Threads request outcome unknown; inspect history before retrying');}
 if(!response.ok||json.error) { const code=Number.isInteger(json?.error?.code)?json.error.code:null; const subcode=Number.isInteger(json?.error?.error_subcode)?json.error.error_subcode:null; throw new Error('Threads API error '+JSON.stringify({stage,status:response.status,code,subcode})); }
 return json;
}
const me=await call(API+'/me?fields=id,username&access_token='+encodeURIComponent(token));
if(!/^[0-9]+$/.test(String(me.id??''))||me.username?.toLowerCase()!==cfg.handle||(configuredId&&String(configuredId)!==String(me.id))) throw new Error('Account mismatch');
const id=String(me.id);
let after,complete=false;
const seen=new Set();
for(let page=0;page<10;page++){
 const q=new URLSearchParams({fields:'id,text',limit:'100',access_token:token});
 if(after) q.set('after',after);
 const history=await call(API+'/'+encodeURIComponent(id)+'/threads?'+q);
 if(!Array.isArray(history.data)) throw new Error('Cannot verify history');
 if(history.data.some(item=>item.text===post.text)){
   console.log(JSON.stringify({status:'skipped-already-published',brand,day}));process.exit(0);
 }
 if(!history.paging?.next){complete=true;break;}
 after=history.paging?.cursors?.after;
 if(typeof after!=='string'||!after||seen.has(after)) break;
 seen.add(after);
}
if(!complete) throw new Error('Incomplete posting history; abort');
const container=await call(API+'/'+encodeURIComponent(id)+'/threads',{method:'POST',body:new URLSearchParams({media_type:'TEXT',text:post.text,access_token:token})});
if(!container.id) throw new Error('Container creation failed');
// Give Threads time to prepare the new media container before publishing.
// Never retry threads_publish automatically: an ambiguous failure may have published.
await new Promise(resolve => setTimeout(resolve, 5000));
const result=await call(API+'/'+encodeURIComponent(id)+'/threads_publish',{method:'POST',body:new URLSearchParams({creation_id:container.id,access_token:token})},'publish');
if(!result.id) throw new Error('No published ID returned');
console.log(JSON.stringify({status:'published',brand,day,postId:result.id}));
