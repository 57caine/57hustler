/**
 * Validates the full, unmodified existing Rakuten-issued hb.afl URL.
 * Does not append a tracking parameter; tracking IDs MUST be set in Rakuten's official UI.
 * Returns the exact URL on success so no affiliate attribution is rewritten.
 */
export function validateHotelBookingLink(link,hotelNo){
  if(!Number.isInteger(hotelNo)||hotelNo<1)throw Error('Missing hotel number');
  const u=new URL(link);
  if(u.protocol!=='https:'||u.hostname!=='hb.afl.rakuten.co.jp'||!u.pathname.startsWith('/hgc/'))throw Error('Rakuten affiliate URL is invalid');
  // Existing links use a nested Rakuten Travel URL in the official pc field.
  // This check rejects mistaken hotels, missing affiliation and manipulated redirects.
  if(!u.searchParams.get('pc'))throw Error('Rakuten affiliate booking destination is missing');
  const destination=new URL(u.searchParams.get('pc'));
  if(destination.protocol!=='https:'||destination.hostname!=='travel.rakuten.co.jp')throw Error('Unexpected Rakuten affiliate destination');
  if(destination.pathname!==`/HOTEL/${hotelNo}/${hotelNo}.html`)throw Error('Affiliate link hotel does not match posted hotel');
  if(destination.search||destination.hash)throw Error('Nested travel destination must be canonical');
  // Do not silently add IDs or normalize the supplied link; preserve exact issued bytes.
  return link;
}
export function measurementRow(post){
 const bookingUrl=validateHotelBookingLink(post.bookingUrl,post.hotelNo);
 const date=new Date(Date.UTC(2026,11,2+(post.day-25)*2)).toISOString().slice(0,10);
 return {date,day:post.day,hotelNo:post.hotelNo,hotelName:post.hotelName,
   proposedMeasurementId:`rkt${post.day}`,
   officialIdStatus:'not_verified',
   existingLinkStatus:'valid_unattributed_to_post',
   affiliateUrlUnchanged:bookingUrl===post.bookingUrl};
}
