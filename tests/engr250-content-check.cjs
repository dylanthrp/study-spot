// Content-contract checks; numerical and source review remain separate requirements.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const file = path.join(__dirname, '..', 'engr250-data.json');
assert.ok(fs.existsSync(file), 'ENGR 250 study content has not been built yet');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const nonempty = (value, name) => assert.ok(typeof value === 'string' && value.trim(), name);
assert.equal(data.courseCode, 'ENGR-250');
nonempty(data.scope, 'Exam scope');
nonempty(data.textbook.note, 'Textbook provenance/limitations');
assert.ok(data.sources.length >= 3, 'Syllabus, notes and equation-sheet provenance');
const topics = new Set(data.topics.map(t => t.id));
assert.equal(topics.size, data.topics.length, 'Unique topic IDs');
for (const collection of ['cards', 'questions', 'examples', 'formulas']) {
  assert.ok(data[collection].length > 0, `${collection} is populated`);
  const ids = new Set();
  for (const item of data[collection]) {
    nonempty(item.id, `${collection}: ID`);
    assert.ok(!ids.has(item.id), `Duplicate ${collection} ID: ${item.id}`);
    ids.add(item.id);
    assert.ok(topics.has(item.topic), `Unknown topic: ${item.topic}`);
    nonempty(item.source, `${item.id}: source`);
  }
}
for (const card of data.cards) {
  for (const key of ['front', 'back', 'term', 'definition']) nonempty(card[key], `${card.id}: ${key}`);
}
for (const q of data.questions) {
  nonempty(q.prompt, `${q.id}: prompt`);
  nonempty(q.explanation, `${q.id}: explanation`);
  assert.ok(q.choices.length >= 2, `${q.id}: choices`);
  assert.equal(new Set(q.choices).size, q.choices.length, `${q.id}: distinct choices`);
  assert.ok(Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex < q.choices.length, `${q.id}: answer bounds`);
  assert.ok(['original', 'tutor-adapted'].includes(q.kind), `${q.id}: practice provenance`);
  assert.ok(q.steps.length > 0, `${q.id}: reasoning steps`);
}
for (const ex of data.examples) {
  for (const key of ['title', 'given', 'find', 'answer']) nonempty(ex[key], `${ex.id}: ${key}`);
  assert.ok(ex.steps.length > 0, `${ex.id}: worked steps`);
  assert.ok(['original', 'tutor-adapted'].includes(ex.kind), `${ex.id}: example provenance`);
}
for (const formula of data.formulas) {
  for (const key of ['name', 'ascii', 'when', 'units', 'pitfall']) nonempty(formula[key], `${formula.id}: ${key}`);
}
console.log('ENGR250 content contract passed:', JSON.stringify(Object.fromEntries(['topics', 'cards', 'questions', 'examples', 'formulas'].map(k => [k, data[k].length]))));
