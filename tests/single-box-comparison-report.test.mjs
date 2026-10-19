import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchSingleBoxComparisons } from '../scripts/lib/fetch-single-box-comparisons.mjs';
const options = { property: 'properties/test', startDate: '2026-10-20', endDate: '2026-11-02' };
const report = response => fetchSingleBoxComparisons({ runReport: async () => [response] }, options);

test('queries comparison intent on 1day only, with the requested period and no grouping', async () => {
  let request;
  const result = await fetchSingleBoxComparisons({ runReport: async value => { request = value; return [{rowCount:1, rows:[{metricValues:[{value:'7'}]}]}]; } }, options);
  assert.deepEqual(result, {status:'ok',total:7});
  assert.deepEqual(request.dateRanges, [{startDate:options.startDate,endDate:options.endDate}]);
  assert.deepEqual(request.dimensions, []);
  assert.equal(request.property, options.property);
  assert.deepEqual(request.dimensionFilter.andGroup.expressions.map(x => [x.filter.fieldName, x.filter.stringFilter.value]), [['eventName','single_box_comparison_click'],['pagePath','/category/1day']]);
});
test('successful empty response is a measured zero', async () => {
  assert.deepEqual(await report({rowCount:0}), {status:'ok',total:0});
});
test('API failure never becomes zero', async () => {
  assert.deepEqual(await fetchSingleBoxComparisons({runReport:async()=>{throw new Error('unavailable');}}, options), {status:'error',total:null});
});
test('malformed and incomplete responses remain unavailable', async () => {
  for (const response of [undefined, {}, {rowCount:1,rows:[]}, {rowCount:0,metadata:{subjectToThresholding:true}}, {rowCount:0,metadata:{dataLossFromOtherRow:true}}, ...['-1','1.2','','nope','9007199254740992'].map(value=>({rowCount:1,rows:[{metricValues:[{value}]}]}))]) {
    assert.deepEqual(await report(response), {status:'error',total:null});
  }
});
