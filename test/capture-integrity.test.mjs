import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { normalizeBoard, summarize, summarizeByLocation } from '../lib/pipeline.mjs';
import { verifyCapture } from '../lib/verify-capture.mjs';

function fixture() {
  const board={company:'example',provider:'greenhouse',cohort:'site',status:'ok',postings:1};
  const raw=JSON.stringify({jobs:[{id:1,title:'Python Engineer',absolute_url:'https://example.com/jobs/1',location:{name:'London'},content:'Python'}]});
  const files={'example.json':raw,'mom-0.json':JSON.stringify({success:true,result:{total:0,records:[]}})};
  const jobs=normalizeBoard(JSON.parse(raw),board).jobs;
  const manifest={complete:true,boards:[board],receipts:Object.entries(files).map(([file,raw])=>({file,status:200,sha256:crypto.createHash('sha256').update(raw).digest('hex')})),
    siteSignals:summarize(jobs),expandedSignals:summarize(jobs),bySourceLocation:summarizeByLocation(jobs)};
  const benchmark={status:'ok',currency:'SGD',period:'month',records:[],referenceYears:[]};
  return {files,jobs,manifest,benchmark};
}
test('capture verification recomputes from receipts and rejects tampered data',async()=>{
  const {files,jobs,manifest,benchmark}=fixture();
  const read=async name=>files[name];
  assert.deepEqual(await verifyCapture(manifest,jobs,read,benchmark),{postings:1,receipts:2});
  await assert.rejects(verifyCapture({...manifest,complete:false},jobs,read,benchmark),/Incomplete ATS/);
  await assert.rejects(verifyCapture(manifest,[{...jobs[0],compUsd:123456}],read,benchmark),/Normalized postings/);
  const altered=structuredClone(manifest); altered.siteSignals[0].matchingPostings++;
  await assert.rejects(verifyCapture(altered,jobs,read,benchmark),/Site summary/);
  await assert.rejects(verifyCapture(manifest,jobs,read,{...benchmark,currency:'USD'}));
  files['example.json']+=' ';
  await assert.rejects(verifyCapture(manifest,jobs,read,benchmark),/Hash mismatch/);
});
