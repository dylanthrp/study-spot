const {test,expect}=require('@playwright/test');
const data=require('../law-data.json');
const visit=(page,mode='overview',who='cooper')=>page.goto(`/#/u/${who}/LE-253/${mode}`);
test('law links preserve identities and disclose provisional sources',async({page})=>{
 await page.goto('/#/u/cooper?tab=library');
 await page.locator('.dash-course[data-course-code="LE-253"]').click();
 await expect(page.locator('.law-caveat')).toContainText('Cooper-supplied exam outline');
 await expect(page.locator('.law-caveat')).toContainText('Chapter numbers refer to the supplied outline, not Saylor');
 await expect(page.locator('.law-caveat')).toContainText('Assigned text remains unconfirmed');
 await expect(page.getByRole('heading',{name:'Exam outline map',exact:true})).toBeVisible();
 await expect(page.locator('#lawRoom')).not.toContainText('No professor materials were supplied');
 await expect(page.locator('#lawRoom')).toContainText('not current legal advice');
 await expect(page.locator('#lawRoom')).toContainText('CC BY-NC-SA 3.0');
 await visit(page,'overview','wyatt'); await expect(page.getByLabel('Focus view',{exact:true})).toBeChecked();
 await expect(page.locator('#lawRoom')).toContainText('Wyatt');
});
test('cards shuffle within the selected outline chapter without losing recall history',async({page})=>{
 await visit(page,'concepts');await page.getByLabel('Card chapter').selectOption('ch4');
 await page.locator('#lawFlip').click();await page.locator('#lawAgain').click();
 // Deterministic RNG tests the actual shuffle, without flaky chance of unchanged order.
 await page.evaluate(()=>{Math.random=()=>0;});
 await page.getByRole('button',{name:'Shuffle cards',exact:true}).click();
 await expect(page.locator('#lawCardCount')).toHaveText(`Card 1 of ${data.cards.filter(c=>c.group==='ch4').length}`);
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('law_v2_cooper')));
 const ids=data.cards.filter(c=>c.group==='ch4').map(c=>c.id);
 expect([...state.cards.ids].sort()).toEqual([...ids].sort());expect(state.cards.ids).not.toEqual(ids);
 expect(state.cardHistory[ids[0]]).toBe(false);
 await page.reload();await expect(page.locator('.ex-flash h2')).toHaveText(data.cards.find(c=>c.id===state.cards.ids[0]).front);
 await page.getByLabel('Card chapter').selectOption('missed');await page.getByRole('button',{name:'Shuffle cards',exact:true}).click();
 await expect(page.locator('#lawCardCount')).toHaveText('Card 1 of 1');
});
test('concepts require reveal, persist progress and retry only missed cards',async({page})=>{
 await visit(page,'concepts'); await page.getByLabel('Card chapter').selectOption('ch1');
 const cards=data.cards.filter(c=>c.group==='ch1');
 await expect(page.locator('#lawGot')).toBeHidden();
 for(let i=0;i<cards.length;i++){
  await page.locator('#lawFlip').click(); await expect(page.locator('#lawBack')).toContainText(cards[i].back);
  await page.locator(i===0?'#lawAgain':'#lawGot').click();
  if(i===0){await page.reload();await expect(page.locator('#lawCardCount')).toHaveText(`Card 2 of ${cards.length}`);}
 }
 await page.getByRole('button',{name:'Retry cards (1)',exact:true}).click();
 await expect(page.locator('#lawCardCount')).toHaveText('Card 1 of 1');
 await visit(page,'concepts','wyatt');await expect(page.locator('#lawCardCount')).toHaveText(`Card 1 of ${data.cards.length}`);
});
test('question provenance is separate from secondary Saylor page references',async({page})=>{
 const fixture=structuredClone(data);
 fixture.questions[0].kind='supplied';fixture.questions[0].source_file='Untitled document (1).docx';
 fixture.questions[1].kind='original';
 await page.route('**/law-data.json',route=>route.fulfill({json:fixture}));
 await visit(page,'practice');await page.getByLabel('Practice chapter').selectOption('ch1');await page.locator('#lawStart').click();
 await expect(page.locator('.law-provenance')).toContainText('Cooper-supplied review example');
 await expect(page.locator('.law-provenance')).toContainText('Untitled document (1).docx');
 await page.locator('#lawReveal').click();await expect(page.locator('#lawFeedback a')).toContainText('Saylor secondary reference');
 await page.locator('#lawNext').click();await expect(page.locator('.law-provenance')).toContainText('Original generated study scenario');
 await expect(page.locator('.law-provenance')).not.toContainText('Untitled document');
});
test('v2 ignores stale law content state without changing other students or courses',async({page})=>{
 await page.addInitScript(()=>{
  if(!localStorage.getItem('law_v1_cooper')){
   localStorage.setItem('law_v1_cooper',JSON.stringify({prefs:{size:'largest'},history:{old:true},cardHistory:{old:true}}));
   localStorage.setItem('exam1_cooper','unrelated sentinel');
  }
 });
 await visit(page,'concepts');await expect(page.getByLabel('Text size',{exact:true})).toHaveValue('normal');
 await page.locator('#lawFlip').click();await page.locator('#lawAgain').click();
 const saved=await page.evaluate(()=>({old:JSON.parse(localStorage.getItem('law_v1_cooper')),fresh:JSON.parse(localStorage.getItem('law_v2_cooper')),other:localStorage.getItem('exam1_cooper')}));
 expect(saved.old.history).toEqual({old:true});expect(saved.fresh.history).toEqual({});expect(saved.fresh.cardHistory[data.cards[0].id]).toBe(false);expect(saved.other).toBe('unrelated sentinel');
 await visit(page,'concepts','wyatt');await expect(page.locator('#lawCardCount')).toHaveText(`Card 1 of ${data.cards.length}`);
});
test('scenario loop grades, reloads, retries misses and keeps drafts across preferences',async({page})=>{
 await visit(page,'practice','wyatt'); await page.getByLabel('Practice chapter').selectOption('ch1');await page.locator('#lawStart').click();
 const questions=data.questions.filter(q=>q.group==='ch1').slice(0,5);
 for(const [i,q] of questions.entries()){
  await expect(page.locator('#lawQuestion')).toHaveText(q.prompt);
  await expect(page.locator('#lawFeedback a')).toHaveCount(0);
  const choice=i===0?(q.answer+1)%4:q.answer;
  await page.locator(`#lawChoice${choice}`).check();
  await page.getByLabel('Text size',{exact:true}).selectOption('large');await page.getByLabel('Focus view',{exact:true}).uncheck();
  await expect(page.locator(`#lawChoice${choice}`)).toBeChecked();
  await page.locator('#lawCheck').click();await expect(page.locator('#lawFeedback')).toContainText(i===0?'Not quite':'Correct');
  await expect(page.locator('#lawFeedback a')).toHaveAttribute('href',`${data.source.url}#page=${q.page}`);
  await page.reload(); await expect(page.locator('#lawFeedback')).toContainText(q.explanation);await page.locator('#lawNext').click();
 }
 await expect(page.locator('#lawContent')).toContainText('4 / 5');await page.getByRole('button',{name:'Retry missed (1)',exact:true}).click();
 await expect(page.locator('#lawRepCount')).toHaveText('Rep 1 of 1');
 await visit(page,'practice');await expect(page.locator('#lawStart')).toBeVisible();
});
for(const chapter of [1,4,5,6,8,9])test(`all chapter ${chapter} scenarios grade from source data`,async({page})=>{
 await visit(page,'practice');await page.getByLabel('Practice chapter').selectOption(`ch${chapter}`);await page.getByLabel('Round length').selectOption('all');await page.locator('#lawStart').click();
 for(const q of data.questions.filter(q=>q.group===`ch${chapter}`)){
 await expect(page.locator('#lawQuestion')).toHaveText(q.prompt);await page.locator(`#lawChoice${q.answer}`).check();await page.locator('#lawCheck').click();await expect(page.locator('#lawFeedback')).toContainText('Correct');await page.locator('#lawNext').click();}
 await expect(page.getByRole('heading',{name:'Round complete',exact:true})).toBeVisible();
});
test('matching uses selected chapter, six pairs, penalties, replay and isolated best',async({page})=>{
 await visit(page,'games');await page.getByLabel('Match chapter').selectOption('ch4');await page.locator('#lawMatchStart').click();
 const tiles=page.locator('.law-tile');await expect(tiles).toHaveCount(12);
 const pairs=await tiles.evaluateAll(es=>es.map(e=>({id:e.dataset.pair,side:e.dataset.side,text:e.textContent})));
 expect(new Set(pairs.map(x=>x.id)).size).toBe(6);
 for(const pair of pairs)expect(data.cards.filter(c=>c.group==='ch4').some(c=>c.id===pair.id)).toBeTruthy();
 const ids=[...new Set(pairs.map(x=>x.id))];
 await page.locator(`[data-pair="${ids[0]}"][data-side="term"]`).click();await page.locator(`[data-pair="${ids[1]}"][data-side="match"]`).click();await expect(page.locator('#lawMatchStatus')).toContainText('+1 second');
 for(const id of ids){await page.locator(`[data-pair="${id}"][data-side="term"]`).click();await page.locator(`[data-pair="${id}"][data-side="match"]`).click();}
 await expect(page.locator('#lawMatchStatus')).toContainText('Six pairs matched');await expect(page.locator('#lawBest')).not.toContainText('No best yet');
 await page.locator('#lawMatchStart').click();await expect(page.locator('.law-tile:disabled')).toHaveCount(0);
 await visit(page,'games','wyatt');await page.getByLabel('Match chapter').selectOption('ch4');await expect(page.locator('#lawBest')).toContainText('No best yet');
});
test('dashboard mode links lead to the correct law tools',async({page})=>{
 for(const [tab,mode] of [['cards','concepts'],['tests','practice'],['guides','sheet'],['games','games']]){
  await page.goto(`/#/u/cooper?tab=${tab}`);
  await expect(page.locator('.dash-course[data-course-code="LE-253"]')).toHaveAttribute('href',`#/u/cooper/LE-253/${mode}`);
 }
});
test('law room fits 320px and guide prints only law content',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 for(const mode of ['overview','concepts','practice','games','sheet']){
 await visit(page,mode);await expect(page.locator('#lawRoom')).toBeVisible();
 if(mode==='games')await page.locator('#lawMatchStart').click();
 if(mode==='practice')await page.locator('#lawStart').click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 await page.emulateMedia({media:'print'});await expect(page.locator('.law-guide')).toBeVisible();await expect(page.locator('#lawRoom .ex-sidebar')).toBeHidden();
});
