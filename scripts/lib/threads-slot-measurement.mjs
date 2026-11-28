// Keep affiliate revenue unknown until an official per-post attribution is supplied.
export function slotForDay(brand,day){
 if(!Number.isSafeInteger(day))return null;
 const start=brand==='lens'?18:brand==='rakutabi'?24:null;
 if(start===null||day<start)return null;
 const offset=day-start;
 const date=new Date(Date.UTC(2026,10,29)+Math.floor(offset/2)*86400000).toISOString().slice(0,10);
 const slot=offset%2===0?'lunch':'evening';
 const time=brand==='lens'?(slot==='lunch'?'12:15':'21:15'):(slot==='lunch'?'12:30':'20:30');
 return {brand,day,date,slot,plannedJst:time};
}
export function measurementForPost(brand,day){
 const slot=slotForDay(brand,day);
 return {...(slot??{brand,day,slot:'legacy',date:null,plannedJst:null}),affiliateClicks:null,orders:null,confirmedCommissionJPY:null,revenueAttributionStatus:'unverified'};
}
