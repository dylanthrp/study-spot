const {test,expect}=require('@playwright/test');
const visit=async(page,mode='overview')=>{await page.goto('/#/u/wyatt/MICRO/'+mode);await expect(page.locator('#microRoom')).toBeVisible();};
test('Wyatt micro folder opens the source room and returns to dashboard',async({page})=>{
 await page.goto('/#/u/wyatt?tab=folder&folder=microeconomics');
 await expect(page.getByRole('heading',{name:'Microeconomics',exact:true,level:1})).toBeVisible();
 await page.locator('[data-course-code="MICRO"]').click();
 await expect(page.locator('#microRoom')).toBeVisible();
 await page.getByRole('link',{name:'← Your dashboard'}).click();await expect(page.locator('.dash-shell')).toBeVisible();
});

const data=require('../micro-source.json');
test('concepts reveal two genuine cards, self-rate, retry and persist independently',async({page})=>{
 await visit(page,'concepts');await page.getByLabel('Round length').selectOption('2');await page.getByRole('button',{name:'Start round',exact:true}).click();
 const first=data.chapters[0].items[0];await expect(page.locator('#microQuestion')).toHaveText(first.question);
 await expect(page.locator('#microAnswer')).toBeHidden();await page.getByRole('button',{name:'Reveal answer',exact:true}).click();await expect(page.locator('#microAnswer')).toContainText(first.answer);
 await page.getByRole('button',{name:'Again',exact:true}).click();await expect(page.locator('#microCount')).toHaveText('Card 2 of 2');
 await page.getByRole('button',{name:'Reveal answer',exact:true}).click();await page.getByRole('button',{name:'Got it',exact:true}).click();
 await page.reload();await expect(page.getByRole('heading',{name:'Round complete'})).toBeVisible();
 await page.getByRole('button',{name:'Retry missed (1)'}).click();await expect(page.locator('#microQuestion')).toHaveText(first.question);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('micro_v1_wyatt_MICRO')));expect(saved.conceptsHistory[first.id]).toBe(false);
 await page.goto('/#/u/cooper');await expect(page.locator('[data-course-code="MICRO"]')).toHaveCount(0);
});

test('six source pairs complete with timer, mismatch penalty and persistent best',async({page})=>{
 await visit(page,'games');await page.getByRole('button',{name:'Start / replay six pairs'}).click();await expect(page.locator('.micro-tile')).toHaveCount(12);
 const ids=await page.locator('.micro-tile[data-side="question"]').evaluateAll(es=>es.map(e=>e.dataset.pair));
 await page.locator(`[data-pair="${ids[0]}"][data-side="question"]`).click();await page.waitForTimeout(250);
 await page.locator(`[data-pair="${ids[1]}"][data-side="answer"]`).click();await expect(page.locator('#microMatchStatus')).toContainText('+1 second');expect(parseFloat(await page.locator('#microClock').textContent())).toBeGreaterThan(1);
 for(const id of ids){await page.locator(`[data-pair="${id}"][data-side="question"]`).click();await page.locator(`[data-pair="${id}"][data-side="answer"]`).click();}
 await expect(page.locator('#microMatchStatus')).toContainText('Six pairs matched');await expect(page.locator('#microBest')).toContainText('Personal best');
 const stopped=await page.locator('#microClock').textContent();await page.waitForTimeout(250);await expect(page.locator('#microClock')).toHaveText(stopped);
 await page.reload();await expect(page.locator('#microBest')).toContainText('Personal best');
 await page.getByLabel('Match topic').selectOption(data.chapters[1].id);await page.getByRole('button',{name:'Start / replay six pairs'}).click();
 await expect(page.locator('#microMatchSources')).toBeAttached();
 const selected=await page.locator('.micro-tile[data-side="question"]').evaluateAll(es=>es.map(e=>e.dataset.pair));
 for(const q of data.chapters[1].items.filter(q=>selected.includes(q.id)&&q.note))await expect(page.locator('#microMatchSources')).toContainText(q.note);
 for(const id of await page.locator('.micro-tile').evaluateAll(es=>es.map(e=>e.dataset.pair)))expect(data.chapters[1].items.some(q=>q.id===id)).toBeTruthy();
});
test('source guide filters exact questions and prints attribution',async({page})=>{
 await visit(page,'sheet');await page.getByLabel('Guide topic').selectOption(data.chapters[1].id);
 await expect(page.locator('.micro-guide h3')).toHaveCount(data.chapters[1].items.length);await expect(page.locator('.micro-guide')).toContainText(data.chapters[1].items[0].answer);
 await expect(page.locator('.micro-scope')).toContainText(data.scope_note);
 await page.emulateMedia({media:'print'});await expect(page.locator('#microRoom .ex-sidebar')).toBeHidden();await expect(page.locator('#microRoom .ex-footer')).toBeVisible();
});

test('practice drafts, topic filtering, shuffle, recall and themes survive reload',async({page})=>{
 await visit(page,'practice');await page.getByLabel('Topic',{exact:true}).selectOption('ch3');await page.getByLabel('Round length').selectOption('2');await page.getByRole('button',{name:'Start round',exact:true}).click();
 await expect(page.locator('#microQuestion')).toHaveText(data.chapters[1].items[0].question);await page.getByLabel('Your recall answer').fill('My recall attempt');
 await page.getByLabel('Focus view').uncheck();await page.getByLabel('Text size').selectOption('largest');
 await page.locator('#microRoom').getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('radio',{name:'Dark',exact:true}).check();await page.getByRole('button',{name:'Close settings'}).click();
 await page.reload();await expect(page.getByLabel('Your recall answer')).toHaveValue('My recall attempt');await expect(page.getByLabel('Focus view')).not.toBeChecked();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 for(const rating of ['Again','Got it']){await page.getByRole('button',{name:'Reveal answer',exact:true}).click();await page.getByRole('button',{name:rating,exact:true}).click();}
 await page.getByRole('button',{name:'Retry missed (1)'}).click();await expect(page.locator('#microQuestion')).toHaveText(data.chapters[1].items[0].question);
 await page.getByRole('button',{name:'Choose another round'}).click();await page.getByLabel('Topic',{exact:true}).selectOption('ch5');await page.getByRole('button',{name:'Shuffle cards'}).click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('micro_v1_wyatt_MICRO')));expect(saved.practice.ids.every(id=>data.chapters[2].items.some(q=>q.id===id))).toBe(true);expect(saved.conceptsHistory).toEqual({});
});
test('all dashboard tool links preserve Wyatt and micro room',async({page})=>{
 for(const [tab,mode] of [['cards','concepts'],['tests','practice'],['guides','sheet'],['games','games'],['library','overview']]){
  await page.goto('/#/u/wyatt?tab='+tab);await page.locator('.dash-course[data-course-code="MICRO"]').click();await expect(page.locator('#microRoom')).toBeVisible();await expect(page).toHaveURL(new RegExp('/MICRO/'+mode+'$'));
 }
 await page.goto('/#/u/wyatt?tab=folder&folder=businesslaw');await expect(page.locator('h1')).toHaveText('Business Law');await expect(page.locator('.dash-course[data-course-code="LE-253"]')).toBeVisible();
});
for(const width of [320,390,1280])test(`active mobile/desktop layout, grid and screenshots at ${width}`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:900});await visit(page,'practice');
 await page.getByLabel('Round length').selectOption('2');await page.getByRole('button',{name:'Start round',exact:true}).click();await page.getByLabel('Your recall answer').fill('Recall before reveal');await page.getByRole('button',{name:'Reveal answer',exact:true}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`C:/Users/dylan/AppData/Local/hermes/cache/wyatt-micro-practice-${width}.png`,fullPage:true});
 await visit(page,'games');await page.getByLabel('Match topic').selectOption('ch1');await page.getByRole('button',{name:'Start / replay six pairs'}).click();await page.getByLabel('Text size').selectOption('largest');
 expect(await page.locator('#microMatchGrid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(4);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('.micro-tile').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth&&e.scrollHeight<=e.clientHeight))).toBe(true);
 await page.locator('#microRoom').getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('radio',{name:'Dark',exact:true}).check();await page.getByRole('button',{name:'Close settings'}).click();
 await page.screenshot({path:`C:/Users/dylan/AppData/Local/hermes/cache/wyatt-micro-match-dark-${width}.png`,fullPage:true});expect(errors).toEqual([]);
});
