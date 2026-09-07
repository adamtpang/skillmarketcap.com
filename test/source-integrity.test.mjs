import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBoard } from '../lib/job-loader.ts';
import { ashbyCompBandUsd, textCompBandUsd } from '../lib/comp.ts';
import { normalizeBoard, validateMomPage } from '../lib/pipeline.mjs';

test('failed HTTP, invalid schemas and successful emptiness remain distinguishable',async()=>{
  const unavailable=await loadBoard('anthropic',async()=>new Response('{}',{status:503}));
  const invalid=await loadBoard('anthropic',async()=>Response.json({message:'bad'}));
  const empty=await loadBoard('anthropic',async()=>Response.json({jobs:[]}));
  const timeout=await loadBoard('anthropic',async()=>{throw new Error('timeout');});
  assert.equal(unavailable.status,'failed');
  assert.equal(invalid.status,'failed');
  assert.equal(timeout.status,'failed');
  assert.equal(empty.status,'ok');assert.deepEqual(empty.jobs,[]);
});
test('meaningful job query parameters survive deduplication',()=>{
  const base={title:'Engineer',location:{name:'London'}};
  const result=normalizeBoard({jobs:[{...base,id:1,absolute_url:'https://example.com/careers?job=1'},{...base,id:2,absolute_url:'https://example.com/careers?job=2'}]}, {company:'test',provider:'greenhouse'});
  assert.equal(result.jobs.length,2);
});
test('malformed listed jobs fail the source rather than silently reducing demand',()=>{
  assert.throws(()=>normalizeBoard({jobs:[{id:1}]},{company:'test',provider:'ashby'}),/Invalid listed posting/);
});
test('text bands require explicit currency and do not choose among different annual ranges',()=>{
  assert.equal(textCompBandUsd('Annual salary: $150,000 - $200,000'),null);
  assert.equal(textCompBandUsd('Annual salary: $150,000 - $200,000 USD. Annual salary: $220,000 - $300,000 USD.'),null);
  assert.deepEqual(textCompBandUsd('Annual salary: $150,000 - $200,000 USD'),{min:150000,max:200000,currency:'USD',period:'year',source:'greenhouse-text'});
});
test('structured bands preserve endpoints and exclude missing bounds and differing tiers',()=>{
  const component={compensationType:'Salary',interval:'1 YEAR',currencyCode:'USD',minValue:150000,maxValue:200000};
  assert.deepEqual(ashbyCompBandUsd({compensation:{summaryComponents:[component]}}),{min:150000,max:200000,currency:'USD',period:'year',source:'ashby-structured'});
  assert.equal(ashbyCompBandUsd({compensation:{summaryComponents:[{...component,maxValue:undefined}]}}),null);
  assert.equal(ashbyCompBandUsd({compensation:{summaryComponents:[component],compensationTiers:[{components:[{...component,maxValue:250000}]}]}}),null);
  assert.equal(ashbyCompBandUsd({compensation:{summaryComponents:[component],compensationTiers:[{components:[component]},{components:[{...component,minValue:180000,maxValue:250000}]}]}}),null);
});
test('MOM wage columns and reference period are required',()=>{
  assert.throws(()=>validateMomPage({success:true,result:{total:-1,records:[]}}),/Invalid MOM/);
  assert.throws(()=>validateMomPage({success:true,result:{total:1,records:[{year:'2024',occ_desc:'Engineer'}]}}),/Missing MOM wage/);
});
