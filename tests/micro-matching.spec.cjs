const {test,expect}=require('@playwright/test');
const data=require('../micro-source.json'),match=require('../micro-match.json');
test('matching uses the reviewed compact source pairs for every chapter',async({page})=>{
 await page.goto('/#/u/wyatt/MICRO/games');await expect(page.locator('#microRoom')).toBeVisible();
 for(const ch of data.chapters){await page.getByLabel('Match topic').selectOption(ch.id);await page.getByRole('button',{name:'Start / replay six pairs'}).click();await expect(page.locator('.micro-tile')).toHaveCount(12);
  const tiles=await page.locator('.micro-tile').evaluateAll(es=>es.map(e=>({id:e.dataset.pair,side:e.dataset.side,text:e.textContent})));
  for(const tile of tiles){expect(match.pairs[tile.id]).toBeTruthy();expect(tile.text).toBe(match.pairs[tile.id][tile.side==='question'?0:1]);}
 }
 await expect(page.getByRole('link',{name:'Download supplied DOCX'})).toHaveAttribute('href','assets/micro/study-guide-1.docx');
});
