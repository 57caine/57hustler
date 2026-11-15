import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePublicationGate } from './publication-gates.mjs';

const evidence = () => ({
  isSample: false,
  demand: { target:'buyer', intent:'purchase', evidenceUrl:'https://example.com/source',
    checkedAt:'2026-11-14', competitiveDiff:'verified benefit', organicChannel:'search' },
  asp: { status:'approved', conditionsSource:'https://example.com/terms' },
  quality: { complianceChecked:true, linksChecked:true },
  forecast: { sessions:100, sendRate:0.4, occurrenceRate:0.2, confirmationRate:0.8,
    rewardPerConversion:1000, directCost:0, operationCost:0, minProfit:1,
    sessionsSource:'GA4', rateSource:'pilot', rewardSource:'ASP', costSource:'budget' },
  actual: { confirmedReward:900, cost:100, sessions:100, minProfit:1,
    reconciliation:'matched', repeatabilityEvidence:['period A','period B'] }
});
const ctx = (action='experiment_publish') => ({action, campaignSlug:'one', commitSha:'abc'});
const approval = (actionType='experiment_publish') => ({
  actionType, target:'one', targetSha:'abc', specVersion:'2.0', approver:'owner',
  approvedAt:'2026-11-14T00:00:00Z', evidenceRef:'issue207', scope:'one'
});
test('missing evidence / missing owner approval fail closed',()=>{
  assert.equal(evaluatePublicationGate(null,null,ctx()).pass,false);
  assert.equal(evaluatePublicationGate(evidence(),null,ctx()).pass,false);
});
test('valid experiment and forecast pass',()=>{
  const r=evaluatePublicationGate(evidence(),approval(),ctx());
  assert.equal(r.pass,true);
  assert.equal(r.forecastProfit,6400);
});
test('approval cannot be reused for another commit, action or campaign',()=>{
  assert.equal(evaluatePublicationGate(evidence(),approval(),{...ctx(),commitSha:'def'}).pass,false);
  assert.equal(evaluatePublicationGate(evidence(),approval(),{...ctx(),campaignSlug:'other'}).pass,false);
  assert.equal(evaluatePublicationGate(evidence(),approval(),ctx('scale')).pass,false);
});
test('sample, missing costs, unprofitable campaigns refuse publication',()=>{
  assert.equal(evaluatePublicationGate({...evidence(),isSample:true},approval(),ctx()).pass,false);
  assert.equal(evaluatePublicationGate({...evidence(),forecast:{...evidence().forecast,operationCost:null}},approval(),ctx()).pass,false);
  assert.equal(evaluatePublicationGate({...evidence(),forecast:{...evidence().forecast,operationCost:10000}},approval(),ctx()).pass,false);
});
test('scale checks reconciled actual profit, repeatability, distinct approval',()=>{
  assert.equal(evaluatePublicationGate(evidence(),approval('scale'),ctx('scale')).pass,true);
  assert.equal(evaluatePublicationGate({...evidence(),actual:{...evidence().actual,reconciliation:'pending'}},approval('scale'),ctx('scale')).pass,false);
  assert.equal(evaluatePublicationGate({...evidence(),actual:{...evidence().actual,cost:1200}},approval('scale'),ctx('scale')).pass,false);
  assert.equal(evaluatePublicationGate({...evidence(),actual:{...evidence().actual,repeatabilityEvidence:['one']}},approval('scale'),ctx('scale')).pass,false);
});
