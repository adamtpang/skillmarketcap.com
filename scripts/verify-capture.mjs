import fs from 'node:fs/promises';
import path from 'node:path';
import { verifyCapture } from '../lib/verify-capture.mjs';

if(!process.argv[2]) throw new Error('Usage: npm run data:verify -- <snapshot directory>');
const directory=path.resolve(process.argv[2]);
async function readFile(name) {
  const target=path.resolve(directory,name);
  if(path.dirname(target)!==directory) throw new Error('Receipt path outside snapshot');
  return fs.readFile(target,'utf8');
}
const manifest=JSON.parse(await readFile('manifest.json'));
const jobs=JSON.parse(await readFile('jobs.json'));
const benchmark=JSON.parse(await readFile('mom-benchmark.json'));
if(benchmark.status!=='ok') throw new Error('Incomplete occupational benchmark');
console.log(JSON.stringify(await verifyCapture(manifest,jobs,readFile,benchmark)));
