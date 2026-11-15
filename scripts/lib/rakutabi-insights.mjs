/** Pure matching and safe normalization for Threads insights. */
export function matchRakutabiPost(media,posts){
 const text=media?.text;
 if(typeof text!=='string'||!text.startsWith('【PR】 '))return null;
 return posts.find(post=>text.trim()==='【PR】 '+post.caption.trim() || text.includes('【宿番号 '+post.hotelNo+'・企画'+post.day+'】'))||null;
}
export function parseMediaInsights(body){
 const out={};
 if(!Array.isArray(body?.data))throw Error('Missing insights');
 for(const metric of ['views','likes','replies','reposts','quotes','shares']){
   const item=body.data.find(x=>x?.name===metric);
   const value=item?.values?.[0]?.value??item?.total_value?.value;
   out[metric]=typeof value==='number'&&Number.isFinite(value)&&value>=0?value:null;
 }
 return out;
}
