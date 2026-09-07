import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { BOARDS } from '../lib/boards.ts';
import { normalizeBoard, summarize, summarizeByLocation, validateMomPage } from '../lib/pipeline.mjs';

// OpenAI verified by HTTP 200 public Ashby response on 2026-09-05.
// Pipeline-only expansion, not a fabricated company directory entry.
const sources = [...Object.entries(BOARDS).map(([company,b])=>({company,...b,cohort:'site'})),
  {company:'openai',provider:'ashby',board:'openai',cohort:'expansion'}];
const startedAt = new Date().toISOString();
const output = path.resolve('data/snapshots', `${startedAt.replace(/[:.]/g,'-')}-${crypto.randomUUID().slice(0,8)}`);
await fs.mkdir(output,{recursive:true});
if(process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT,`directory=${output}\n`);
const receipts=[];
const save = (name,value) => fs.writeFile(path.join(output,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
async function capture(url,name) {
  const response = await fetch(url,{signal:AbortSignal.timeout(30000),headers:{'user-agent':'skillmarketcap.com'},cache:'no-store'});
  const raw = await response.text();
  const receipt={url,status:response.status,fetchedAt:new Date().toISOString(),file:name,sha256:crypto.createHash('sha256').update(raw).digest('hex')};
  receipts.push(receipt);
  await fs.writeFile(path.join(output,name),raw,{flag:'wx'});
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return JSON.parse(raw);
}
const boards=[];
// Sequential bounded requests keep provider load modest and receipts deterministic.
for (const source of sources) {
  const url=source.provider==='greenhouse'
    ? `https://boards-api.greenhouse.io/v1/boards/${source.board}/jobs?content=true`
    : `https://api.ashbyhq.com/posting-api/job-board/${source.board}?includeCompensation=true`;
  try {
    const result=normalizeBoard(await capture(url,`${source.company}.json`),source);
    boards.push({...source,status:'ok',...result});
  } catch(error) { boards.push({...source,status:'failed',error:String(error.message)}); }
}
let benchmark;
try {
  const records=[];
  let total=Infinity;
  for (let offset=0; offset<total; offset+=1000) {
    if(offset>=20000) throw new Error('MOM pagination safety limit');
    const url=`https://data.gov.sg/api/action/datastore_search?resource_id=d_670c3c6cecbcd24e48034a3428bd306e&limit=1000&offset=${offset}`;
    const page=validateMomPage(await capture(url,`mom-${offset}.json`));
    if(total!==Infinity && total!==page.total) throw new Error('MOM inventory changed during pagination');
    total=page.total; records.push(...page.records);
  }
  if(records.length!==total) throw new Error('Incomplete MOM capture');
  benchmark={status:'ok',kind:'occupational-survey',currency:'SGD',period:'month',
    referenceYears:[...new Set(records.map(r=>r.year))],
    source:'https://data.gov.sg/datasets/d_670c3c6cecbcd24e48034a3428bd306e/view',records};
} catch(error) { benchmark={status:'failed',error:String(error.message)}; }
const jobs=boards.flatMap(b=>b.jobs||[]);
const complete=boards.every(b=>b.status==='ok');
let sourceRevision=null;
try { sourceRevision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(); }
catch { /* Code hashes below remain authoritative when Git is not on Node's PATH. */ }
const summary={startedAt,completedAt:new Date().toISOString(),complete,
  sourceRevision,
  codeHashes:Object.fromEntries(await Promise.all(['lib/classification.ts','lib/comp.ts','lib/job-normalization.ts','lib/boards.ts','lib/pipeline.mjs','scripts/capture-market.mjs'].map(async file=>[file,crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')]))),
  boards:boards.map(({jobs,...b})=>({...b,postings:jobs?.length??null})),receipts,
  // A failed source never publishes a comparable ranking based on a partial set.
  siteSignals:complete?summarize(jobs.filter(j=>sources.some(s=>s.company===j.company && s.cohort==='site'))):null,
  expandedSignals:complete?summarize(jobs):null,
  bySourceLocation:complete?summarizeByLocation(jobs):null,
  limitations:['Seniority unclassified','Source locations may combine multiple cities','Distinct posting IDs can represent the same vacancy','Keyword mentions are not verified requirements','Pooled salary midpoints are not standalone skill prices']};
await save('jobs.json',jobs);
await save('mom-benchmark.json',benchmark);
await save('manifest.json',summary);
console.log(JSON.stringify({output,complete,postings:jobs.length,benchmark:benchmark.status,boards:summary.boards},null,2));
if(!complete || benchmark.status!=='ok') process.exitCode=1;
