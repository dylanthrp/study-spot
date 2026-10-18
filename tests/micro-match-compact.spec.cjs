const {test,expect}=require('@playwright/test');
const data=require('../micro-source.json');
test('every chapter has six concise source-linked matching pairs, not paragraph-sized tiles',async({page})=>{
 await page.goto('/#/u/wyatt/MICRO/games');
 for(const chapter of data.chapters){
  await page.getByLabel('Match topic').selectOption(chapter.id);
  await page.getByRole('button',{name:'Start / replay six pairs'}).click();
  await expect(page.locator('.micro-tile')).toHaveCount(12);
  const tiles=await page.locator('.micro-tile').evaluateAll(es=>es.map(e=>({id:e.dataset.pair,side:e.dataset.side,text:e.textContent})));
  for(const tile of tiles){
   const item=chapter.items.find(q=>q.id===tile.id);
   expect(item.match).toBeTruthy();
   expect(tile.text).toBe(tile.side==='question'?item.match.term:item.match.definition);
   expect(tile.text.length).toBeLessThanOrEqual(120);
  }
  await page.locator('#microMatchSources summary').click();
  for(const item of chapter.items.filter(i=>i.match&&i.note))await expect(page.locator('#microMatchSources')).toContainText(item.note);
 }
});
