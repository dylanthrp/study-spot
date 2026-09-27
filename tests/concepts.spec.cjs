const {test,expect}=require('@playwright/test');
const data=require('../exam1-concepts.json');

test('concept dataset has source-linked cards and unambiguous matching pairs',()=>{
  expect(data.cards).toHaveLength(36);
  for(const field of ['id','front','term','match'])expect(new Set(data.cards.map(c=>c[field])).size).toBe(data.cards.length);
  for(const group of data.groups)expect(data.cards.filter(c=>c.group===group.id)).toHaveLength(12);
  for(const c of data.cards){
    expect(c.id).toMatch(/^\w+$/);
    for(const field of ['front','back','trap','term','match'])expect(c[field].length).toBeGreaterThan(3);
    expect(data.sources.some(s=>s.id===c.source)).toBe(true);
    expect(c.front+' '+c.back).not.toMatch(/closing entries|income summary|reversing entries/i);
  }
});

test('concept cards reveal, remember progress, retry misses and isolate students',async({page})=>{
  await page.goto('/#/u/cooper/ACC-298/concepts');
  await page.getByLabel('Concept topic',{exact:true}).selectOption('foundations');
  await page.getByRole('button',{name:'Start concept cards',exact:true}).click();
  const first=await page.locator('#exConceptQuestion').textContent();
  await expect(page.getByRole('button',{name:'Got it',exact:true})).toBeHidden();
  await page.getByRole('button',{name:'Flip card',exact:true}).click();
  await expect(page.locator('#exConceptBack')).toContainText('Don’t fall for this:');
  await page.getByRole('button',{name:'Again',exact:true}).click();
  await page.reload();await expect(page.locator('#exConceptCount')).toHaveText('Concept 2 of 10');
  for(let i=1;i<10;i++){await page.getByRole('button',{name:'Flip card',exact:true}).click();await page.getByRole('button',{name:'Got it',exact:true}).click();}
  await page.getByRole('button',{name:'Retry concept misses (1)',exact:true}).click();
  await expect(page.locator('#exConceptQuestion')).toHaveText(first);
  await page.goto('/#/u/wyatt/ACC-298/concepts');
  await expect(page.getByRole('button',{name:'Start concept cards',exact:true})).toBeVisible();
  await expect(page.locator('#exFocus')).toBeChecked();
});

for(const group of data.groups)test(`concept topic ${group.id}: every answer appears and shuffle preserves IDs`,async({page})=>{
  await page.goto('/#/u/wyatt/ACC-298/concepts');
  await page.getByLabel('Concept topic',{exact:true}).selectOption(group.id);
  await page.getByLabel('Concept round length',{exact:true}).selectOption('all');
  await page.getByRole('button',{name:'Start concept cards',exact:true}).click();
  await page.getByRole('button',{name:'Shuffle remaining cards',exact:true}).click();
  const seen=[];
  for(let i=0;i<12;i++){
    const front=await page.locator('#exConceptQuestion').textContent();const card=data.cards.find(c=>c.front===front);
    expect(card.group).toBe(group.id);expect(seen).not.toContain(card.id);seen.push(card.id);
    await page.getByRole('button',{name:'Flip card',exact:true}).click();
    await expect(page.locator('#exConceptBack')).toContainText(card.back);
    await page.getByRole('button',{name:'Got it',exact:true}).click();
  }
  await expect(page.getByRole('heading',{name:'Concept round complete',exact:true})).toBeVisible();
});

test('matching has twelve tiles, penalties, six valid pairs, saved best and fresh replay',async({page})=>{
  await page.goto('/#/u/cooper/ACC-298/games');
  await page.getByLabel('Matching topic',{exact:true}).selectOption('timing');
  await page.getByRole('button',{name:'Start matching',exact:true}).click();
  await expect(page.locator('.ex-match-tile')).toHaveCount(12);
  const ids=await page.locator('[data-side="term"]').evaluateAll(xs=>xs.map(x=>x.dataset.card));
  expect(new Set(ids).size).toBe(6);
  for(const id of ids)expect(data.cards.find(c=>c.id===id).group).toBe('timing');
  await page.locator(`[data-card="${ids[0]}"][data-side="term"]`).click();
  await page.locator(`[data-card="${ids[1]}"][data-side="definition"]`).click();
  await expect(page.locator('#exMatchStatus')).toContainText('+1 second');
  expect(parseFloat(await page.locator('#exMatchTime').textContent())).toBeGreaterThanOrEqual(1);
  // The first pair also exercises drag-and-drop; the rest exercise keyboard activation.
  await page.locator(`[data-card="${ids[0]}"][data-side="term"]`).dragTo(page.locator(`[data-card="${ids[0]}"][data-side="definition"]`));
  for(const id of ids.slice(1)){
    await page.locator(`[data-card="${id}"][data-side="term"]`).press('Enter');
    await page.locator(`[data-card="${id}"][data-side="definition"]`).press('Space');
  }
  await expect(page.locator('#exMatchFinal')).toBeVisible();
  await expect(page.locator('#exContent')).toContainText('1 penalty second included');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('exam1_match_v1_cooper')).timing)).toBeGreaterThanOrEqual(1);
  await page.getByRole('button',{name:'Play again · new cards',exact:true}).click();
  const next=await page.locator('[data-side="term"]').evaluateAll(xs=>xs.map(x=>x.dataset.card).sort());
  expect(next).not.toEqual([...ids].sort());
  await page.goto('/#/u/wyatt/ACC-298/games');await expect(page.locator('#exMatchBest')).toHaveText('No time yet');
});

test('matching stays 4 by 3 at mobile widths and stops cleanly on navigation',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#/u/wyatt/ACC-298/games');
  await page.getByRole('button',{name:'Start matching',exact:true}).click();
  await page.getByLabel('Text size',{exact:true}).selectOption('largest');
  for(const width of [390,320]){
    await page.setViewportSize({width,height:844});
    const layout=await page.locator('.ex-match-grid').evaluate(e=>({cols:getComputedStyle(e).gridTemplateColumns.split(' ').length,rows:getComputedStyle(e).gridTemplateRows.split(' ').length,overflow:document.documentElement.scrollWidth>innerWidth}));
    expect(layout).toEqual({cols:4,rows:3,overflow:false});
  }
  await page.getByRole('link',{name:'Ch. 1–3 Concepts',exact:true}).click();
  await expect(page.getByRole('button',{name:'Start concept cards',exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});
