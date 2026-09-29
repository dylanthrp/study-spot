const {test,expect}=require('@playwright/test');
const d=require('../law-data.json');

test('outline-aligned law content is internally consistent and cites supporting chapters',()=>{
 expect(d.chapters.map(c=>c.number)).toEqual([1,4,5,6,8,9]);
 expect(d.cards).toHaveLength(48);expect(d.questions).toHaveLength(36);
 expect(d.source.license).toContain('BY-NC-SA');
 const bounds={ch1:[2,34],ch4:[172,204],ch5:[117,172],ch6:[67,117],ch8:[204,277],ch9:[237,277]};
 const checkPage=(x,g)=>{expect(Number.isInteger(x.page)).toBe(true);expect(x.page).toBeGreaterThanOrEqual(bounds[g][0]);expect(x.page).toBeLessThanOrEqual(bounds[g][1]);};
 for(const rows of [d.cards,d.questions]){
  expect(new Set(rows.map(x=>x.id)).size).toBe(rows.length);
  for(const x of rows){expect(x.id).toMatch(/^\w+$/);expect(Object.keys(bounds)).toContain(x.group);checkPage(x,x.group);expect(x.outline_topic).toBeTruthy();}
 }
 for(const c of d.chapters){
  expect(d.cards.filter(x=>x.group===c.id)).toHaveLength(8);expect(d.questions.filter(x=>x.group===c.id)).toHaveLength(6);
  expect(c.rules).toHaveLength(4);for(const r of c.rules)checkPage(r,c.id);
 }
 expect(new Set(d.cards.map(x=>x.term.toLowerCase())).size).toBe(d.cards.length);
 expect(new Set(d.cards.map(x=>x.match.toLowerCase())).size).toBe(d.cards.length);
 for(const c of d.cards)for(const f of ['front','back','trap','term','match'])expect(c[f].length).toBeGreaterThan(3);
 for(const q of d.questions){
  expect(['original','supplied']).toContain(q.kind);expect(q.choices).toHaveLength(4);expect(new Set(q.choices).size).toBe(4);
  expect(Number.isInteger(q.answer)).toBe(true);expect(q.answer).toBeGreaterThanOrEqual(0);expect(q.answer).toBeLessThan(4);
  for(const f of ['prompt','explanation','trap'])expect(q[f].length).toBeGreaterThan(12);
 }
});
test('all six Cooper examples are preserved and separated from original practice',()=>{
 const original=require('./fixtures/law-outline.json');const normalize=s=>s.replace(/\s+/g,' ').trim();
 expect(d.questions.filter(q=>q.kind==='supplied')).toHaveLength(6);
 for(const item of original){
  const q=d.questions.find(q=>q.group===item.group&&q.kind==='supplied');
  expect(normalize(q.prompt)).toBe(normalize(item.prompt));expect(q.choices.map(normalize)).toEqual(item.choices.map(normalize));
  expect(q.source_file).toBe('Untitled document (1).docx');
 }
 expect(d.questions.filter(q=>q.kind==='original')).toHaveLength(30);
 expect(d.scope_note).toContain('outline');expect(d.chapters.find(c=>c.id==='ch9').title).toMatch(/negligence/i);
});

test('supplied examples have reviewed explanations, not an alleged official key',()=>{
 const answerByGroup={ch1:1,ch4:0,ch5:3,ch6:1,ch8:3,ch9:0};
 for(const [group,answer] of Object.entries(answerByGroup)){
  const q=d.questions.find(q=>q.group===group&&q.kind==='supplied');expect(q.answer).toBe(answer);
 }
 const explanation=group=>d.questions.find(q=>q.group===group&&q.kind==='supplied').explanation;
 expect(explanation('ch4')).toMatch(/state|local/i);
 expect(explanation('ch8')).toMatch(/privileg/i);
 expect(explanation('ch9')).toMatch(/breach|duty|elements/i);
});
