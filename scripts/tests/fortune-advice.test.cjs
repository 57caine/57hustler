const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { CONCRETE_ADVICE_EXAMPLES, FORBIDDEN_ADVICE, invalidAdviceStars, buildAdviceGuidance, buildRetryFeedback } = require('../lib/fortune-advice.ts');
const source = readFileSync('scripts/post-threads-fortune.ts', 'utf8');
test('prompt examples are complete, within length limit and pass the production advice gate', () => {
  for (const value of CONCRETE_ADVICE_EXAMPLES) {
    assert.ok(value.length >= 8 && value.length <= 18, value);
    assert.doesNotMatch(value, /[をにがの]$/);
    assert.deepEqual(invalidAdviceStars({ 1: value }), []);
  }
});
test('all existing vague phrase families stay rejected and appear in guidance', () => {
  for (const phrase of FORBIDDEN_ADVICE.slice(2)) {
    assert.deepEqual(invalidAdviceStars({ 9: phrase }), ['9']);
    assert.ok(buildAdviceGuidance().includes(phrase));
  }
  assert.deepEqual(invalidAdviceStars({1:'南西で信用が高まる',9:'火の輝きで幸運が訪れる'}), ['1','9']);
});
test('retry feedback identifies both failed star sets and missing keys', () => {
  const feedback = buildRetryFeedback([1], ['9'], false);
  assert.match(feedback, /文字数・欠落NG星：1/);
  assert.match(feedback, /抽象表現NG星：9/);
  assert.match(feedback, /キーは1〜9/);
  assert.match(feedback, /具体的な行動/);
  assert.doesNotMatch(buildRetryFeedback([], ['9'], true), /文字数・欠落NG星|キーは/);
});
test('a rejected nine-star response can be corrected without weakening the validator', () => {
  const candidate = Object.fromEntries(Array.from({length:9}, (_, i) => [i+1, CONCRETE_ADVICE_EXAMPLES[i%4]]));
  candidate[9] = '火の輝きで幸運が訪れる';
  assert.deepEqual(invalidAdviceStars(candidate), ['9']);
  candidate[9] = '会議の前に資料を見直す';
  assert.deepEqual(invalidAdviceStars(candidate), []);
});
test('production sends retry guidance, caps attempts, and stops before posting on exhaustion', () => {
  assert.match(source, /generateOneLiners\(dailyStarNum, monthlyStarNum, retryFeedback\)/);
  assert.match(source, /retryFeedback = buildRetryFeedback/);
  assert.match(source, /const MAX_RETRIES = 3/);
  const failure = source.slice(source.indexOf('if (oneLiners === null)'), source.indexOf('const text = buildPostText'));
  assert.match(failure, /throw new Error/);
  assert.ok(source.indexOf('const creationId = await createThreadsContainer') > source.indexOf('if (oneLiners === null)'));
});
