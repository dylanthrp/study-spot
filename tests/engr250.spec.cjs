const {test,expect}=require('@playwright/test');
test.use({launchOptions:{args:['--disable-gpu']}});
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const dataPath=path.join(__dirname,'../engr250-data.json');
const realData=()=>JSON.parse(fs.readFileSync(dataPath,'utf8'));
test('unit-cell model uses SI conversion and crystallographic geometry',()=>{
 const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../engr250.js'),'utf8')+';this.room=Engr250',ctx);
 expect(typeof ctx.room.unitCell).toBe('function');
 for(const [type,n,factor] of [['SC',1,2],['BCC',2,4/Math.sqrt(3)],['FCC',4,2*Math.sqrt(2)]]){
  const actual=ctx.room.unitCell(type,0.128,63.546);
  expect(actual.n).toBe(n);expect(actual.a).toBeCloseTo(factor*0.128,10);
  expect(actual.density).toBeCloseTo(n*63.546/(6.02214076e23*(factor*0.128*1e-7)**3),8);
 }
 expect(ctx.room.unitCell('FCC',0,63.546)).toBeNull();
 expect(ctx.room.vacancyFraction(1,1000)).toBeCloseTo(9.124767650803168e-6,12);
 expect(ctx.room.vacancyFraction(1,0)).toBeNull();
});
test('real study loop preserves drafts, retries misses and isolates students',async({page})=>{
 const data=realData();
 await page.goto('/#/u/dylan/ENGR-250/practice');
 await page.getByRole('button',{name:'Start round',exact:true}).click();
 const topics=new Set();
 for(let i=0;i<5;i++){
  const id=await page.locator('#engrQuestion').getAttribute('data-id'),q=data.questions.find(q=>q.id===id);topics.add(q.topic);
  const choice=i===0?(q.answerIndex+1)%q.choices.length:q.answerIndex;
  await page.locator('input[name="engrChoice"]').nth(choice).check();
  if(i===0){await page.getByLabel('Focus view',{exact:true}).check();await page.getByLabel('Text size',{exact:true}).selectOption('largest');await expect(page.locator('input[name="engrChoice"]').nth(choice)).toBeChecked();await page.reload();await expect(page.locator('input[name="engrChoice"]').nth(choice)).toBeChecked();}
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(page.locator('#engrFeedback')).toContainText(q.explanation);
  await page.getByRole('button',{name:i===4?'Finish round':'Next question',exact:true}).click();
 }
 expect(topics.size).toBeGreaterThan(1);
 await expect(page.getByRole('heading',{name:'Round complete'})).toBeVisible();
 await page.getByRole('button',{name:'Retry missed (1)',exact:true}).click();
 await expect(page.locator('#engrRep')).toContainText('1 of 1');
 await page.goto('/#/u/charlie/ENGR-250/practice');await expect(page.getByRole('button',{name:'Start round',exact:true})).toBeVisible();
 await expect(page.getByLabel('Focus view',{exact:true})).not.toBeChecked();
 await page.goto('/#/u/dylan/ENGR-250/practice');await expect(page.locator('#engrRep')).toContainText('1 of 1');
});
test('concepts reveal, rate, filter, retry and preserve mastery independently',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#/u/dylan/ENGR-250/concepts');
 const first=await page.locator('[data-card-id]').getAttribute('data-card-id');
 await page.getByRole('button',{name:'Reveal answer',exact:true}).click();
 await expect(page.locator('#engrBack')).toBeVisible();
 await expect(page.getByRole('button',{name:'Again',exact:true})).toBeFocused();
 await page.getByRole('button',{name:'Again',exact:true}).click();
 await page.getByRole('button',{name:'Reveal answer',exact:true}).click();
 await page.getByRole('button',{name:'Got it',exact:true}).click();
 await page.getByRole('button',{name:'Retry missed cards',exact:true}).click();
 await expect(page.locator('[data-card-id]')).toHaveAttribute('data-card-id',first);
 await page.getByRole('button',{name:'Reveal answer',exact:true}).click();await page.reload();await expect(page.locator('#engrBack')).toBeVisible();
 expect(errors).toEqual([]);
});

test('real matching board shares card IDs, applies penalties, completes with keyboard and saves private best',async({page})=>{
 const data=realData();await page.goto('/#/u/dylan/ENGR-250/games');
 await page.locator('#engrMatchStart').click();const tiles=page.locator('.engr-tile');await expect(tiles).toHaveCount(12);
 const pairs=await tiles.evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.pair,side:n.dataset.side,text:n.textContent})));
 expect(new Set(pairs.map(p=>p.id)).size).toBe(6);
 for(const p of pairs)expect(p.text).toBe(data.cards.find(c=>c.id===p.id)[p.side]);
 await tiles.nth(0).click();const wrong=pairs.findIndex(p=>p.id!==pairs[0].id);await tiles.nth(wrong).click();await expect(page.locator('#engrMatchStatus')).toContainText('+1 second');
 const firstId=pairs[0].id;
 await page.locator(`[data-pair="${firstId}"][data-side="term"]`).focus();await page.keyboard.press('Enter');
 await page.locator(`[data-pair="${firstId}"][data-side="definition"]`).focus();await page.keyboard.press('Space');
 for(const id of [...new Set(pairs.map(p=>p.id))].slice(1)){
  await page.locator(`[data-pair="${id}"][data-side="term"]`).click();await page.locator(`[data-pair="${id}"][data-side="definition"]`).click();
 }
 await expect(page.locator('#engrMatchStatus')).toContainText('Six pairs matched');await expect(page.locator('#engrMatchStatus')).toContainText('1 penalty seconds');
 await expect(page.locator('#engrBest')).toContainText('Personal best:');await page.reload();await expect(page.locator('#engrBest')).toContainText('Personal best:');
 await page.goto('/#/u/charlie/ENGR-250/games');await expect(page.locator('#engrBest')).toHaveText('No personal best yet');
 for(const t of data.topics){const count=data.cards.filter(c=>c.topic===t.id&&c.term&&c.definition).length;await expect(page.locator(`#engrMatchTopic option[value="${t.id}"]`)).toHaveJSProperty('disabled',count<6);}
});
test('all word-safe routes, progressive worked examples and printable source guide',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const data=realData();
 for(const [mode,title] of [['overview','Engineering Materials.'],['concepts','Concepts'],['practice','Practice'],['examples','Worked examples'],['sheet','Formula guide'],['games','Games · Match six pairs'],['models','Interactive models']]){
  await page.goto('/#/u/charlie/ENGR-250/'+mode);await expect(page.locator('#engrContent h1').first()).toContainText(title);
 }
 await page.goto('/#/u/charlie/ENGR-250/examples');
 for(const ex of data.examples){await page.locator('#engrExample').selectOption(ex.id);await expect(page.locator('#engrWorkedSteps li')).toHaveCount(0);for(let i=0;i<ex.steps.length;i++){await page.locator('#engrExampleStep').click();await expect(page.locator('#engrWorkedSteps li')).toHaveCount(i+1);}await expect(page.locator('.engr-answer')).toContainText(ex.answer);}
 await page.goto('/#/u/charlie/ENGR-250/sheet');await expect(page.locator('.engr-guide article')).toHaveCount(data.formulas.length);
 await page.evaluate(()=>{document.documentElement.dataset.theme='dark';});await page.emulateMedia({media:'print'});
 await expect(page.locator('#engrPrint')).toBeHidden();expect(await page.locator('.engr-guide article').first().evaluate(e=>getComputedStyle(e).color)).toBe('rgb(17, 17, 17)');
 await page.screenshot({path:testInfo.outputPath('engr250-print.png'),fullPage:true});expect(errors).toEqual([]);
});
test('models update genuine SVG geometry and checked outputs without losing input',async({page},testInfo)=>{
 await page.goto('/#/u/dylan/ENGR-250/models');
 for(const [type,n,density] of [['SC',8,'6.2895'],['BCC',9,'8.1703'],['FCC',14,'8.8947']]){
  await page.locator('#engrCrystal').selectOption(type);await expect(page.locator('#engrCrystalDrawing circle')).toHaveCount(n);await expect(page.locator('[data-value="density"]')).toHaveText(density);
 }
 await expect(page.locator('#engrVacancy')).toContainText('9.12477e-6');
 await page.locator('#engrTemperature').fill('1200');await expect(page.locator('#engrVacancy')).toContainText(Math.exp(-1/(8.617333262e-5*1200)).toExponential(5));
 await page.locator('#engrRadius').fill('0.150');await page.locator('#engrSize').selectOption('large');await expect(page.locator('#engrRadius')).toHaveValue('0.150');await page.reload();await expect(page.locator('#engrRadius')).toHaveValue('0.150');
 await page.locator('#engrRadius').fill('0');await expect(page.locator('#engrDensity')).toContainText('positive');await page.locator('#engrRadius').fill('0.128');
 await page.screenshot({path:testInfo.outputPath('engr250-models-desktop.png'),fullPage:true});
});
test('mobile dark largest-text question and 4 by 3 board fit without overflow',async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#/u/dylan/ENGR-250/practice');
 await page.locator('#engrSize').selectOption('largest');await page.locator('#engrFocus').check();await page.evaluate(()=>document.documentElement.dataset.theme='dark');
 await page.locator('#engrStart').click();await expect(page.locator('#engrQuestion')).toBeFocused();
 const rect=await page.locator('#engrQuestion').boundingBox();expect(rect.y).toBeGreaterThanOrEqual(65);expect(rect.y).toBeLessThan(300);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:testInfo.outputPath('engr250-practice-mobile-dark.png'),fullPage:true});
 await page.goto('/#/u/dylan/ENGR-250/games');await page.locator('#engrMatchStart').click();await expect(page.locator('.engr-tile')).toHaveCount(12);
 const grid=await page.locator('#engrMatchGrid').evaluate(e=>({cols:getComputedStyle(e).gridTemplateColumns.split(' ').length,rows:getComputedStyle(e).gridTemplateRows.split(' ').length}));expect(grid).toEqual({cols:4,rows:3});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const clipped=await page.locator('.engr-tile').evaluateAll(nodes=>nodes.some(n=>n.scrollWidth>n.clientWidth+1||n.scrollHeight>n.clientHeight+1));expect(clipped).toBe(false);
 await page.screenshot({path:testInfo.outputPath('engr250-game-mobile-dark.png'),fullPage:true});
});
test('dashboard tool destinations preserve existing custom folders and unrelated progress',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{localStorage.setItem('studyspot_dashboard:dylan:folders',JSON.stringify([{id:'keepme',name:'My originals',courses:['MATH-215']}]));localStorage.setItem('law_v2_cooper','unchanged');localStorage.setItem('phys150:progress','unchanged');});
 for(const [tab,mode] of [['library','overview'],['cards','concepts'],['tests','practice'],['guides','sheet'],['games','games']]){
  await page.goto('/#/u/dylan?tab='+tab);await expect(page.locator('[data-course-code="ENGR-250"]')).toHaveAttribute('href','#/u/dylan/ENGR-250/'+mode);
 }
 await page.getByRole('link',{name:'My originals',exact:true}).click();await expect(page.getByRole('heading',{name:'My originals',exact:true})).toBeVisible();await expect(page.locator('[data-course-code="MATH-215"]')).toBeVisible();
 await page.goto('/#/u/dylan/ENGR-250/concepts');await page.locator('#engrFlip').click();await page.locator('#engrAgain').click();
 expect(await page.evaluate(()=>[localStorage.getItem('law_v2_cooper'),localStorage.getItem('phys150:progress')])).toEqual(['unchanged','unchanged']);
});
test('missing source data stays honest and late loads cannot overwrite navigation',async({page})=>{
 await page.route('**/engr250-data.json',route=>route.abort());await page.goto('/#/u/dylan/ENGR-250/practice');await expect(page.locator('#engrLoading')).toContainText('no substitute questions');await expect(page.locator('#engrStart')).toHaveCount(0);
 await page.unroute('**/engr250-data.json');let release;const gate=new Promise(r=>release=r);await page.route('**/engr250-data.json',async route=>{await gate;await route.continue();});
 await page.goto('/#/u/dylan/ENGR-250/models');await expect(page.locator('#engrLoading')).toBeVisible();await page.goto('/#/u/charlie');await expect(page.getByRole('heading',{name:'Jump back in'})).toBeVisible();release();await expect(page.locator('#engrRoom')).toHaveCount(0);
});


test('select keyboard typeahead is not intercepted by legacy global shortcuts',async({page})=>{
 await page.goto('/#/u/dylan/ENGR-250/games');await page.locator('#engrMatchTopic').focus();await page.keyboard.press('g');await expect(page).toHaveURL(/ENGR-250\/games$/);
});
test('fewer than six genuine cards fails safely rather than looping',async({page})=>{
 const data=realData();data.cards=data.cards.slice(0,5);
 await page.route('**/engr250-data.json',route=>route.fulfill({json:data}));await page.goto('/#/u/dylan/ENGR-250/games');
 await expect(page.locator('#engrMatchTopic option').nth(1)).toHaveJSProperty('disabled',true);await page.locator('#engrMatchStart').click();await expect(page.locator('#engrMatchStatus')).toContainText('Not enough pairs');await expect(page.locator('.engr-tile')).toHaveCount(0);
});
test('Charlie completes a graded round and retries; theme changes preserve entered answers',async({page})=>{
 const data=realData();await page.goto('/#/u/charlie/ENGR-250/practice');await page.locator('#engrStart').click();
 for(let i=0;i<5;i++){
  const id=await page.locator('#engrQuestion').getAttribute('data-id'),q=data.questions.find(q=>q.id===id);
  const index=i===1?(q.answerIndex+1)%q.choices.length:q.answerIndex;await page.locator('input[name="engrChoice"]').nth(index).check();
  if(i===0){await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByLabel('Dark',{exact:true}).check();await page.getByRole('button',{name:'Close settings'}).click();await expect(page.locator('input[name="engrChoice"]').nth(index)).toBeChecked();}
  await page.locator('#engrCheck').click();if(i===1){await page.locator('#engrStep').click();await expect(page.locator('#engrFeedback li')).toHaveCount(1);await page.reload();await expect(page.locator('#engrFeedback li')).toHaveCount(1);}
  await page.locator('#engrNext').click();
 }
 await page.getByRole('button',{name:'Retry missed (1)',exact:true}).click();await expect(page.locator('#engrRep')).toContainText('1 of 1');await page.reload();await expect(page.locator('#engrRep')).toContainText('1 of 1');
 const id=await page.locator('#engrQuestion').getAttribute('data-id'),q=data.questions.find(q=>q.id===id);await page.locator('input[name="engrChoice"]').nth(q.answerIndex).check();await page.locator('#engrCheck').click();await page.locator('#engrNext').click();await expect(page.locator('.ex-score')).toHaveText('1 / 1');
});

test('Engineering Materials folder is visible for both enrolled students without losing other courses',async({page})=>{
 for(const who of ['dylan','charlie']){
  await page.goto('/#/u/'+who);
  await page.getByRole('link',{name:'Engineering Materials',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Engineering Materials',exact:true})).toBeVisible();
  await page.locator('[data-course-code="ENGR-250"]').click();
  await expect(page.locator('#engrRoom')).toBeVisible();
  await page.goto('/#/u/'+who+'?tab=library');
  await expect(page.locator('[data-course-code="MATH-215"]')).toBeVisible();
 }
});
