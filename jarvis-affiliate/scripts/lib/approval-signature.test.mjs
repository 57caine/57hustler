import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifyApprovalSignature } from './approval-signature.mjs';
const secret='x'.repeat(64);
const fields=['actionType','target','targetSha','specVersion','approver','approvedAt','evidenceRef','scope'];
const approval=()=>({actionType:'experiment_publish',target:'lp',targetSha:'abc',specVersion:'2.0',
  approver:'owner',approvedAt:'2026-11-15T00:00:00Z',evidenceRef:'issue207',scope:'one LP'});
const sign=(record)=>({...record,signature:createHmac('sha256',secret).update(JSON.stringify(fields.map(k=>record[k]))).digest('hex')});
test('valid owner-controlled HMAC passes',()=>assert.equal(verifyApprovalSignature(sign(approval()),secret),true));
test('unsigned/short secret blocked',()=>{
  assert.equal(verifyApprovalSignature(approval(),secret),false);
  assert.equal(verifyApprovalSignature(sign(approval()),'short'),false);
});
test('approval cannot be reused for other LP, SHA or scope',()=>{
  const a=sign(approval());
  assert.equal(verifyApprovalSignature({...a,target:'other'},secret),false);
  assert.equal(verifyApprovalSignature({...a,targetSha:'changed'},secret),false);
  assert.equal(verifyApprovalSignature({...a,scope:'all'},secret),false);
});
