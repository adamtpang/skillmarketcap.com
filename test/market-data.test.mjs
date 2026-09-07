import assert from 'node:assert/strict';
import test from 'node:test';
import { SKILLS, matchesSkill } from '../lib/classification.ts';
import { textCompMidpointUsd, ashbyCompMidpointUsd } from '../lib/comp.ts';
import { normalize } from '../lib/job-normalization.ts';

const match = (slug, title, description = '', team = null) => matchesSkill(SKILLS.find(s => s.slug === slug), {title, description, team});
test('AI company context does not turn sales and planning into technical AI demand', () => {
  assert.equal(match('ai-machine-learning', 'Account Executive, AI Native'), false);
  assert.equal(match('ai-machine-learning', 'AI Infrastructure Operations, Demand Planning'), false);
  assert.equal(match('ai-machine-learning', 'AI Engineer, GTM Claudification'), true);
  assert.equal(match('ai-machine-learning', 'Applied AI Architect'), true);
  assert.equal(match('sales-gtm', 'Account Executive, AI Native'), true);
});
test('technical requirements need occupational evidence in the title', () => {
  assert.equal(match('python', 'Product Manager, Applied AI', 'Python', 'Engineering'), false);
  assert.equal(match('python', 'Software Engineer', 'Python preferred'), true);
  assert.equal(match('python', 'Member of Technical Staff', 'Python'), true);
  assert.equal(match('python', 'Finance Systems Engineer, Finance and Strategy', 'Python'), true);
  assert.equal(match('ai-machine-learning', 'AI Operations Engineer, Partnerships'), true);
  assert.equal(match('python', 'Infrastructure Demand Planner', 'Python'), false);
});
test('salary parser requires annual salary context and rejects other dollar amounts', () => {
  assert.equal(textCompMidpointUsd('Annual Salary: $320,000 - $405,000 USD'), 362500);
  assert.equal(textCompMidpointUsd('Annual Salary: $405,000 - $485,000 USD'), 445000);
  assert.equal(textCompMidpointUsd('Signing bonus: $50,000 - $100,000'), null);
  assert.equal(textCompMidpointUsd('Salary: $150,000 - $200,000 per month'), null);
  assert.equal(textCompMidpointUsd('Annual Salary: $150,000 - $200,000 cad'), null);
  assert.equal(textCompMidpointUsd('Hourly salary: $32 - $39'), null);
  assert.equal(textCompMidpointUsd(null), null);
});
test('structured salary skips hourly values in annual fields and invalid numeric input', () => {
  const job = (minValue,maxValue) => ({compensation:{summaryComponents:[{compensationType:'Salary',currencyCode:'USD',interval:'1 YEAR',minValue,maxValue}]}});
  assert.equal(ashbyCompMidpointUsd(job(32,39)), null);
  assert.equal(ashbyCompMidpointUsd(job(211400,290600)), 251000);
  assert.equal(ashbyCompMidpointUsd(job(NaN,200000)), null);
});
test('encoded Greenhouse markup is removed before classification', () => {
  const j=normalize({id:1,title:'Engineer',absolute_url:'https://example.com/job',content:'&lt;p class=&quot;python&quot;&gt;Build APIs&lt;/p&gt;'},'greenhouse',true);
  assert.equal(j.description, 'Build APIs');
  assert.equal(matchesSkill(SKILLS.find(s=>s.slug==='python'),j),false);
});
