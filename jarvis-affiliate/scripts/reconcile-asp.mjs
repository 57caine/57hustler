/** Read explicitly normalized private ASP JSON; write no raw rows or secrets. */
import fs from 'node:fs';
import { reconcileAspSnapshots } from './lib/reconcile-asp.mjs';
const i=process.argv.indexOf('--file');
const f=i>=0 ? process.argv[i+1] : '';
if (!f || !fs.existsSync(f)) {
  console.error('Usage: npm run reconcile:asp -- --file <private-normalized-asp.json>');
  process.exit(1);
}
try {
  const data=JSON.parse(fs.readFileSync(f,'utf8'));
  const summary=reconcileAspSnapshots(data);
  console.log(JSON.stringify(summary,null,2));
} catch (error) {
  console.error('BLOCKED: '+error.message);
  process.exitCode=1;
}
