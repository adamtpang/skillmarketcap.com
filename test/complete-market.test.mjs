import test from 'node:test';
import assert from 'node:assert/strict';
import { requireCompleteMarket } from '../lib/complete-market.ts';

test('cache admission rejects partial refreshes but permits genuinely empty complete samples',()=>{
  const complete={sourceFailures:[],rolesScanned:0,signals:[]};
  assert.equal(requireCompleteMarket(complete),complete);
  assert.throws(()=>requireCompleteMarket({sourceFailures:['Cursor'],rolesScanned:674,signals:[]}),/Market refresh incomplete: Cursor/);
});
