import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileAspSnapshots } from './reconcile-asp.mjs';

const row = () => ({
  asp:'a8',accountId:'account1',sourceRecordId:'transaction1',
  sourceUpdatedAt:'2026-11-01T12:00:00Z',
  periodStart:'2026-10-01',periodEnd:'2026-10-31',timezone:'Asia/Tokyo',
  cohortBasis:'occurrence_date',currency:'JPY',sourceRef:'local-private-report',
  programId:'p1',campaignId:null,status:'pending',amount:300
});
const at = (status,day) => ({...row(),status,sourceUpdatedAt:`2026-11-${day}T12:00:00Z`});
test('pending -> confirmed -> cancelled contributes zero',()=>{
  const out=reconcileAspSnapshots([at('pending','01'),at('confirmed','02'),at('cancelled','03')]);
  assert.equal(out.totalConfirmed,0);
  assert.equal(out.cancelledCount,1);
  assert.equal(out.recordCount,1);
});
test('confirmed duplicates counted once and unattributed once',()=>{
  const a=at('confirmed','02');
  const out=reconcileAspSnapshots([a,a]);
  assert.equal(out.totalConfirmed,300);
  assert.equal(out.unattributedConfirmed,300);
  assert.deepEqual(out.campaigns,{});
});
test('explicit campaigns are attributed once',()=>{
  const out=reconcileAspSnapshots([{...at('confirmed','02'),campaignId:'lp-one'}]);
  assert.equal(out.campaigns['lp-one'],300);
});
test('missing is not zero, zero is valid',()=>{
  assert.throws(()=>reconcileAspSnapshots([{...row(),amount:null}]),/BLOCKED/);
  assert.equal(reconcileAspSnapshots([{...at('confirmed','02'),amount:0}]).totalConfirmed,0);
});
test('conflicting same timestamp is blocked',()=>{
  assert.throws(()=>reconcileAspSnapshots([at('pending','02'),at('confirmed','02')]),/conflicting/);
});
test('cross-period, cross-cohort and sample are blocked',()=>{
  assert.throws(()=>reconcileAspSnapshots([row(),{...row(),sourceRecordId:'transaction2',periodStart:'2026-09-01'}]),/incomparable/);
  assert.throws(()=>reconcileAspSnapshots([row(),{...row(),sourceRecordId:'transaction2',cohortBasis:'confirmation_date'}]),/incomparable/);
  assert.throws(()=>reconcileAspSnapshots([{...row(),isSample:true}]),/sample/);
});
test('invalid status, missing ID, invalid amount and reversed periods blocked',()=>{
  assert.throws(()=>reconcileAspSnapshots([{...row(),status:'paid'}]),/unknown status/);
  assert.throws(()=>reconcileAspSnapshots([{...row(),sourceRecordId:''}]),/missing/);
  assert.throws(()=>reconcileAspSnapshots([{...row(),amount:'300'}]),/invalid/);
  assert.throws(()=>reconcileAspSnapshots([{...row(),periodStart:'2026-12-01'}]),/inverted/);
});
