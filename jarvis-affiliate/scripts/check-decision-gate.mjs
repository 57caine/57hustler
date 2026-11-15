/** Explicit local decision gate. This is a safeguard, not identity authentication. */
import fs from 'node:fs';
import { evaluatePublicationGate } from './lib/publication-gates.mjs';
import { verifyApprovalSignature } from './lib/approval-signature.mjs';
const argv = process.argv.slice(2);
const arg = (flag) => { const i = argv.indexOf(flag); return i >= 0 ? argv[i+1] : null; };
const campaignSlug = arg('--campaign');
const action = arg('--action');
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || process.env.JARVIS_RELEASE_SHA || '';
if (!campaignSlug || !['experiment_publish','scale'].includes(action)) {
  console.error('Usage: npm run gate:check -- --campaign <slug> --action experiment_publish|scale');
  process.exit(1);
}
let manifest;
try {
  manifest = JSON.parse(process.env.JARVIS_PUBLICATION_EVIDENCE_JSON || fs.readFileSync(new URL('../config/publication-gates.json', import.meta.url),'utf8'));
  if (!Array.isArray(manifest.approvals)) throw Error('approvals must be an array');
} catch (err) {
  console.error('BLOCKED: publication-gates.json unavailable or invalid: '+err.message);
  process.exit(1);
}
const evidence = manifest?.campaigns?.[campaignSlug] ?? null;
const approval = manifest.approvals.find(a=>a?.target===campaignSlug&&a?.actionType===action) ?? null;
const result = evaluatePublicationGate(evidence,approval,{action,campaignSlug,commitSha});
if (!verifyApprovalSignature(approval,process.env.JARVIS_APPROVAL_SECRET)) {
  result.pass=false;
  result.errors.push('owner approval signature missing/invalid');
}
console.log(JSON.stringify({campaignSlug,action,pass:result.pass,errors:result.errors,forecastProfit:result.forecastProfit},null,2));
if (!result.pass) process.exitCode = 1;
