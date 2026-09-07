import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBoard, summarize, summarizeByLocation, validateMomPage } from '../lib/pipeline.mjs';
const source={company:'fixture',provider:'ashby'};
const posting={id:'one',title:'Python Engineer',location:'Singapore',jobUrl:'https://example.com/job',descriptionPlain:'Python',isListed:true};
test('duplicate IDs and canonical URLs do not inflate posting counts',()=>{
  const result=normalizeBoard({jobs:[posting,posting,{...posting,id:'two',jobUrl:posting.jobUrl+'?utm_source=test'}]},source);
  assert.equal(result.jobs.length,1);assert.equal(result.duplicates,2);
  assert.equal(summarize(result.jobs).find(s=>s.skill==='python').matchingPostings,1);
});
test('unlisted jobs are excluded and missing salary stays missing',()=>{
  const result=normalizeBoard({jobs:[posting,{...posting,id:'hidden',isListed:false}]},source);
  assert.equal(result.jobs.length,1);
  const python=summarize(result.jobs).find(s=>s.skill==='python');
  assert.equal(python.disclosedCount,0);assert.equal(python.medianAdvertisedAnnualUsd,null);
  assert.equal(summarizeByLocation(result.jobs)[0].sourceLocation,'Singapore');
  assert.equal(result.jobs[0].seniority,null);
});
test('schema failures are errors, not successful empty inventories',()=>{
  assert.throws(()=>normalizeBoard({error:'rate limited'},source),/Invalid jobs/);
  assert.throws(()=>validateMomPage({success:false}),/Invalid MOM/);
});
