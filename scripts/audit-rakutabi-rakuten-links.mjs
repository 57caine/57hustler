import {readFileSync,writeFileSync} from 'node:fs';
import {measurementRow} from './lib/rakutabi-rakuten-measurement.mjs';
const posts=JSON.parse(readFileSync(new URL('../data/rakutabi-threads-hotel-posts.json',import.meta.url),'utf8')).posts.filter(p=>p.day>=25&&p.day<=39);
if(posts.length!==15)throw Error('Expected 15 December hotel posts');
const rows=posts.map(measurementRow);
if(new Set(rows.map(p=>p.day)).size!==15||new Set(rows.map(p=>p.hotelNo)).size!==15)throw Error('Duplicate days or hotels');
const report={generatedAt:new Date().toISOString(),status:'official_tracking_ids_not_yet_issued_or_verified',
  documentation:'https://affiliate.rakuten.co.jp/guides/link/',
  warning:'Proposed IDs are a naming plan, NOT IDs created in Rakuten; existing affiliate links are untouched. No post-level clicks or orders have been measured.',
  rows};
const output=process.env.RAKUTABI_RAKUTEN_AUDIT_OUTPUT;
if(output)writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,hotelCount:rows.length,validExistingAffiliateLinks:rows.filter(x=>x.affiliateUrlUnchanged).length,proposedIds:rows.map(x=>x.proposedMeasurementId)}));
