// Pure daily slot planner. No network, credentials or publishing.
export const slots=Object.freeze([
 {brand:'lens',slot:'lunch',cron:'15 3 * * *',time:'12:15',index:0},
 {brand:'rakutabi',slot:'lunch',cron:'30 3 * * *',time:'12:30',index:0},
 {brand:'rakutabi',slot:'evening',cron:'30 11 * * *',time:'20:30',index:1},
 {brand:'lens',slot:'evening',cron:'15 12 * * *',time:'21:15',index:1}
]);
export function planSlot(date,cron,posts){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('Invalid date');
 const slot=slots.find(s=>s.cron===cron);
 if(!slot)return null;
 const offset=(Date.parse(date)-Date.parse('2026-11-29'))/86400000;
 if(offset<0)return null;
 const day=(slot.brand==='lens'?18:24)+offset*2+slot.index;
 const post=posts.find(p=>p.day===day&&(slot.brand==='rakutabi'||p.brand==='lens'));
 if(!post)return {...slot,day,status:'missing-draft'};
 return {...slot,day,status:'ready'};
}
