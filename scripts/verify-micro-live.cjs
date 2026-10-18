// Public/subpath smoke check; separate from the full local Playwright suite.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://127.0.0.1:4192/';
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const go=async(mode)=>{await page.goto(base+'#/u/wyatt/MICRO/'+mode);await page.locator('#microRoom').waitFor();};
 await page.goto(base+'#/u/wyatt');await page.locator('[data-course-code="MICRO"]').first().click();await page.locator('#microRoom').waitFor();
 await go('concepts');await page.getByLabel('Round length').selectOption('2');await page.getByRole('button',{name:'Start round',exact:true}).click();
 assert.equal(await page.locator('#microAnswer').isVisible(),false);
 await page.getByRole('button',{name:'Reveal answer',exact:true}).click();assert.ok((await page.locator('#microAnswer').textContent()).includes('resources'));
 await page.getByRole('button',{name:'Again',exact:true}).click();await page.getByRole('button',{name:'Reveal answer',exact:true}).click();await page.getByRole('button',{name:'Got it',exact:true}).click();
 await page.getByRole('button',{name:'Retry missed (1)'}).click();assert.equal(await page.locator('#microCount').textContent(),'Card 1 of 1');
 await go('practice');await page.getByRole('button',{name:'Start round',exact:true}).click();await page.getByLabel('Your recall answer').fill('Independent smoke-check draft');await page.reload();await page.getByLabel('Your recall answer').waitFor();assert.equal(await page.getByLabel('Your recall answer').inputValue(),'Independent smoke-check draft');
 await go('games');await page.getByRole('button',{name:'Start / replay six pairs'}).click();assert.equal(await page.locator('.micro-tile').count(),12);
 const ids=await page.locator('.micro-tile[data-side="question"]').evaluateAll(es=>es.map(e=>e.dataset.pair));
 for(const id of ids){await page.locator(`[data-pair="${id}"][data-side="question"]`).click();await page.locator(`[data-pair="${id}"][data-side="answer"]`).click();}
 assert.ok((await page.locator('#microMatchStatus').textContent()).includes('Six pairs matched'));
 assert.ok((await page.locator('#microBest').textContent()).includes('Personal best'));
 await go('sheet');await page.getByLabel('Guide topic').selectOption('ch5');assert.equal(await page.locator('.micro-guide h3').count(),18);assert.ok((await page.locator('.micro-guide').textContent()).includes('Q_d=-2P+100'));
 const source=await page.request.get(new URL('assets/micro/study-guide-1.docx',base).href);assert.equal(source.status(),200);assert.ok((await source.body()).length>20000);
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);}
 assert.deepEqual(errors,[]);
 console.log('PASS: deployed dashboard route, reveal/rate/retry, saved recall draft, 12-tile matching completion/best, chapter filtering, recovered equation, source download, three viewport widths, no JS errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
