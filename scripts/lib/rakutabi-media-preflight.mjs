/** Pure image URL and response-status checks. */
export function validateMediaSource(photo){
 const url=new URL(photo?.url);
 if(url.protocol!=='https:'||url.hostname!=='upload.wikimedia.org'||!url.pathname.startsWith('/wikipedia/commons/'))throw Error('Unsupported image host');
 if(!photo?.photoRights?.owner||!photo?.photoRights?.proofUrl||!photo?.photoRights?.licenseUrl)throw Error('Missing image rights metadata');
 return url.href;
}
export function evaluateImageResponse(status,type){
 const mime=String(type??'').split(';',1)[0].trim().toLowerCase();
 return status>=200&&status<300&&['image/jpeg','image/png','image/webp'].includes(mime)?'ok':'unavailable';
}
