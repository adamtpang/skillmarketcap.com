import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { normalizeBoard, summarize, summarizeByLocation, validateMomPage } from './pipeline.mjs';

// Recompute the publication from its raw receipts instead of trusting saved totals.
export async function verifyCapture(manifest, jobs, readFile, benchmark) {
  assert.equal(manifest.complete, true, 'Incomplete ATS cohort');
  assert.ok(manifest.boards.length > 0, 'No boards recorded');
  for (const receipt of manifest.receipts) {
    assert.equal(receipt.status, 200, 'Unsuccessful source receipt');
    const raw=await readFile(receipt.file);
    assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),receipt.sha256,`Hash mismatch: ${receipt.file}`);
  }
  const recomputed=[];
  for (const board of manifest.boards) {
    assert.equal(board.status, 'ok', 'Failed board');
    const receipt=manifest.receipts.find(r=>r.file===`${board.company}.json`);
    assert.ok(receipt, 'Missing board receipt');
    const result=normalizeBoard(JSON.parse(await readFile(receipt.file)),board);
    assert.equal(result.jobs.length,board.postings,'Posting count mismatch');
    recomputed.push(...result.jobs);
  }
  assert.deepEqual(jobs,recomputed,'Normalized postings differ from raw sources');
  const siteCompanies=new Set(manifest.boards.filter(b=>b.cohort==='site').map(b=>b.company));
  assert.deepEqual(manifest.siteSignals,summarize(jobs.filter(j=>siteCompanies.has(j.company))),'Site summary mismatch');
  assert.deepEqual(manifest.expandedSignals,summarize(jobs),'Expanded summary mismatch');
  assert.deepEqual(manifest.bySourceLocation,summarizeByLocation(jobs),'Location summary mismatch');
  assert.equal(benchmark.status,'ok','Incomplete occupational benchmark');
  assert.equal(benchmark.currency,'SGD');
  assert.equal(benchmark.period,'month');
  const momReceipts=manifest.receipts.filter(r=>/^mom-\d+\.json$/.test(r.file));
  assert.ok(momReceipts.length,'Missing MOM receipts');
  const pages=await Promise.all(momReceipts.map(async r=>validateMomPage(JSON.parse(await readFile(r.file)))));
  const records=pages.flatMap(p=>p.records);
  assert.ok(pages.every(p=>p.total===records.length),'Incomplete MOM pagination');
  assert.deepEqual(benchmark.records,records,'Benchmark differs from raw sources');
  assert.deepEqual(benchmark.referenceYears,[...new Set(records.map(r=>r.year))],'Benchmark reference years differ');
  return {postings:jobs.length,receipts:manifest.receipts.length};
}
