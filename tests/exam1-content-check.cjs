'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
assert.ok(fs.existsSync(path.join(root, 'exam1-data.json')), 'Exam 1 source-grounded data exists');
const data = JSON.parse(fs.readFileSync(path.join(root, 'exam1-data.json'), 'utf8'));
assert.equal(data.course, 'ACC-298');
assert.deepEqual(data.topics.map(t => t.id), ['journal', 'adjust', 'statements']);
assert.equal(data.problems.length, 30);
assert.equal(data.flashcards.length, 12);
const ids = [...data.topics, ...data.problems, ...data.flashcards].map(x => x.id);
assert.equal(new Set(ids).size, ids.length);
ids.forEach(id => assert.match(id, /^[a-z]+$/));
const expected = [
 ['stock','Cash','Common Stock',15000], ['borrow','Cash','Notes Payable',6000],
 ['truck','Equipment','Cash',8000], ['prepayrent','Prepaid Rent','Cash',1500],
 ['prepayinsurance','Prepaid Insurance','Cash',2400], ['buysupplies','Supplies','Accounts Payable',2000],
 ['billfirst','Accounts Receivable','Service Revenue',3700], ['paysupplier','Accounts Payable','Cash',500],
 ['paysalaries','Salaries and Wages Expense','Cash',1750], ['collect','Cash','Accounts Receivable',1600],
 ['billsecond','Accounts Receivable','Service Revenue',4200], ['maintenance','Maintenance and Repairs Expense','Cash',350],
 ['dividend','Dividends','Cash',900], ['unbilled','Accounts Receivable','Service Revenue',200],
 ['depreciation','Depreciation Expense','Accumulated Depreciation—Equipment',250],
 ['expireinsurance','Insurance Expense','Prepaid Insurance',2400/6],
 ['usesupplies','Supplies Expense','Supplies',2000-280],
 ['accruesalaries','Salaries and Wages Expense','Salaries and Wages Payable',1080],
 ['expirerent','Rent Expense','Prepaid Rent',1500/3],
 ['accrueinterest','Interest Expense','Interest Payable',6000*.06/12]
];
const journal = data.problems.filter(p => p.topic === 'journal');
const adjustments = data.problems.filter(p => p.topic === 'adjust');
assert.equal(journal.length,13); assert.equal(adjustments.length,7);
const money = n => '$' + n.toLocaleString('en-US');
for (const [id,debit,credit,amount] of expected) {
 const p = data.problems.find(x=>x.id===id);
 assert.ok(p,id); assert.equal(p.debit,debit,id); assert.equal(p.credit,credit,id); assert.equal(p.amount,amount,id);
 assert.equal(p.number,null,id); assert.equal(p.answer,`Debit ${debit} ${money(amount)}; credit ${credit} ${money(amount)}.`,id);
 const lines = [{debit:p.amount,credit:0},{debit:0,credit:p.amount}];
 assert.equal(lines.reduce((s,l)=>s+l.debit,0),lines.reduce((s,l)=>s+l.credit,0),`${id} balances`);
}
function post(entries) {
 const ledger = new Map();
 for (const p of entries) {
  assert.ok(Number.isFinite(p.amount) && p.amount>0);
  assert.notEqual(p.debit,p.credit);
  ledger.set(p.debit,(ledger.get(p.debit)||0)+p.amount);
  ledger.set(p.credit,(ledger.get(p.credit)||0)-p.amount);
 }
 return ledger;
}
function totals(ledger) { return [...ledger.values()].reduce((r,n)=>[r[0]+Math.max(n,0),r[1]+Math.max(-n,0)],[0,0]); }
const unadjusted = post(journal), adjusted = post([...journal,...adjustments]);
assert.deepEqual(totals(unadjusted),[30400,30400]);
const expectedUnadjusted = {'Cash':7200,'Accounts Receivable':6300,'Supplies':2000,'Prepaid Rent':1500,'Prepaid Insurance':2400,'Equipment':8000,'Notes Payable':-6000,'Accounts Payable':-1500,'Common Stock':-15000,'Dividends':900,'Service Revenue':-7900,'Maintenance and Repairs Expense':350,'Salaries and Wages Expense':1750};
assert.deepEqual(Object.fromEntries(unadjusted),expectedUnadjusted);
assert.deepEqual(totals(adjusted),[31960,31960]);
assert.equal(data.balances.length,adjusted.size);
assert.equal(new Set(data.balances.map(b=>b.account)).size,adjusted.size);
for (const b of data.balances) {
 assert.ok(b.debit>=0 && b.credit>=0 && !(b.debit && b.credit),b.account);
 assert.equal(b.debit-b.credit,adjusted.get(b.account),b.account);
}
const amount = account => adjusted.get(account)||0;
const expenses = [...adjusted].filter(([a])=>a.endsWith('Expense')).reduce((s,[,n])=>s+n,0);
const revenue = -amount('Service Revenue');
const income = revenue-expenses;
const retained = income-amount('Dividends');
const assets = ['Cash','Accounts Receivable','Supplies','Prepaid Rent','Prepaid Insurance','Equipment','Accumulated Depreciation—Equipment'].reduce((s,a)=>s+amount(a),0);
const liabilities = -['Notes Payable','Accounts Payable','Salaries and Wages Payable','Interest Payable'].reduce((s,a)=>s+amount(a),0);
const equity = -amount('Common Stock')+retained;
assert.equal(expenses,6080); assert.equal(income,2020); assert.equal(retained,1120);
assert.equal(assets,24730); assert.equal(liabilities,8610); assert.equal(equity,16120); assert.equal(assets,liabilities+equity);
const checkpoints = {unadjustedtotal:totals(unadjusted)[0],adjustedtotal:totals(adjusted)[0],endingcash:amount('Cash'),adjustedrevenue:revenue,totalexpenses:expenses,netincome:income,retainedearnings:retained,totalassets:assets,totalliabilities:liabilities,totalequity:equity};
assert.equal(data.problems.filter(p=>p.topic==='statements').length,10);
for (const [id,n] of Object.entries(checkpoints)) {
 const p = data.problems.find(x=>x.id===id);
 assert.ok(p,id); assert.equal(p.number,n,id); assert.equal(p.answer,money(n),id);
 assert.equal(p.amount,null); assert.equal(p.debit,null); assert.equal(p.credit,null);
}
for (const p of data.problems) {
 ['title','statement','prompt','find','answer','source_file','pitfall'].forEach(k=>assert.ok(typeof p[k]==='string' && p[k].length,`${p.id}.${k}`));
 assert.ok(p.given.length && p.steps.length>=2,p.id);
 assert.ok(Number.isInteger(p.page) && Number.isInteger(p.solution_page),p.id);
 assert.ok(['journal','adjust','statements'].includes(p.topic));
 const textPath=path.join(root,'.hermes','exam1-source',p.source_file.replace(/\.pdf$/,'.txt'));
 if(fs.existsSync(textPath)) {
  const text=fs.readFileSync(textPath,'utf8').replace(/\r\n/g,'\n');
  const page=text.split(`=== PAGE ${p.page} ===`)[1]?.split(/=== PAGE \d+ ===/)[0];
  assert.ok(page && page.includes(p.statement),`${p.id}: excerpt is verbatim on cited page`);
 }
}
for(const f of data.flashcards) ['front','back','source_file'].forEach(k=>assert.ok(f[k],`${f.id}.${k}`));
assert.ok(data.source_notes.some(n=>n.includes('2,500') && n.includes('250') && n.includes('visually checked')));
console.log('PASS: 13 journal + 7 adjusting entries; 10 numeric checkpoints; 12 flashcards; source excerpts checked when available.');
console.log('Trial balances: 30,400 / 31,960; expenses 6,080; net income 2,020; retained earnings 1,120; assets 24,730 = liabilities 8,610 + equity 16,120.');
