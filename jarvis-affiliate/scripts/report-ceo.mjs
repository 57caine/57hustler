/** Private CEO evidence report from validated ASP transaction snapshots.
 * Requires explicit local JSON input; never reads built-in demo fixtures.
 * No inferred cost or GA4 sessions. Does not write raw ASP transaction identifiers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { reconcileAspSnapshots } from './lib/reconcile-asp.mjs';
const args=process.argv.slice(2);
function arg(flag) { const i=args.indexOf(flag); return i>=0?args[i+1]:null; }
const input=arg('--file');
const business=arg('--business');
const issue=arg('--issue') || '207';
if (!input || !business || !/^[a-z0-9-]+$/.test(business)) {
  console.error('Usage: npm run report:ceo -- --file /private/asp-normalized.json --business <id>');
  process.exit(1);
}
try {
  if (path.resolve(input).startsWith(path.resolve('dist')+path.sep)) {
    throw Error('Cannot read published dist as private evidence');
  }
  const raw=JSON.parse(fs.readFileSync(input,'utf8'));
  const summary=reconcileAspSnapshots(raw);
  const money=(value,reason=null)=>({value,unit:'JPY',missing_reason:reason});
  const output={
    schema_version:'2.0',
    master_issue:Number(issue),
    business_id:business,
    fetched_at:new Date().toISOString(),
    reconciliation_status:summary.unattributedConfirmed>0?'unattributed':'matched',
    observation_period:{start:summary.period[0],end:summary.period[1],timezone:summary.period[2],cohort_basis:summary.period[3]},
    metrics:{
      confirmed_reward_total:money(summary.totalConfirmed),
      confirmed_reward_unattributed:money(summary.unattributedConfirmed),
      confirmed_orders:{value:summary.confirmedCount,unit:'orders',missing_reason:null},
      sessions:{value:null,unit:'sessions',missing_reason:'GA4 same-period data not connected'},
      operating_cost:money(null,'verified cost data not provided'),
      net_profit:money(null,'cost data and attributable GA4 data not verified')
    },
    campaign_confirmed_rewards:summary.campaigns,
    source_count:summary.recordCount,
    note:'ASP source exports must be authenticated separately. No transaction-level GA4/ASP match was asserted. No revenue from pending/cancelled/rejected is included.',
    gate_results:{profitability_actual:'insufficient_data'},
    next_action:'Review verified costs and permitted attribution before business decisions'
  };
  const dest=path.resolve('output','reports','ceo-'+business+'-'+new Date().toISOString().slice(0,10)+'.json');
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,JSON.stringify(output,null,2)+'\n',{mode:0o600});
  console.log('Validated evidence saved (private; no raw rows): '+dest);
  console.log(JSON.stringify({business_id:business,confirmed_reward_total:summary.totalConfirmed,unattributed:summary.unattributedConfirmed,profit:'unavailable'},null,2));
} catch (error) {
  console.error('BLOCKED: '+error.message);
  process.exitCode=1;
}
