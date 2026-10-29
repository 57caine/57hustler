import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { buildGa4Init, validMeasurementId } from '../lib/ga4.mjs';
test('missing or unsafe IDs cannot initialize analytics', () => {
  for (const id of [undefined, '', 'G-X', "G-TEST123';alert(1)//"]) {
    assert.equal(validMeasurementId(id), false);
    assert.throws(() => buildGa4Init(id));
  }
});
test('production initializes config exactly once without manual page_view', () => {
  const scripts=[];const context={location:{hostname:'rakutabi-nine.vercel.app'},document:{createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}}};
  context.window=context;vm.runInNewContext(buildGa4Init('G-TEST12345'),context);
  assert.equal(scripts.length,1);
  assert.equal(context.dataLayer.filter(a=>a[0]==='config').length,1);
  assert.equal(context.dataLayer.filter(a=>a[0]==='event' && a[1]==='page_view').length,0);
  assert.match(scripts[0].src,/id=G-TEST12345$/);
});
test('preview and localhost send nothing', () => {
  for (const hostname of ['localhost','rakutabi-git-preview.vercel.app']) {
    const context={location:{hostname}};context.window=context;
    vm.runInNewContext(buildGa4Init('G-TEST12345'),context);
    assert.equal(context.dataLayer,undefined);
  }
});
