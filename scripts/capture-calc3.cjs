const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
  fs.mkdirSync('.hermes/previews', { recursive:true });
  const browser=await chromium.launch();
  const page=await browser.newPage({ viewport:{width:1440,height:1050} });
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const mode of ['overview','cross','lab']) {
    await page.goto(`http://127.0.0.1:4173/#/u/dylan/MATH-215/${mode}`);
    await page.locator('.calc-main').waitFor();
    await page.evaluate(()=>document.fonts.ready);
    if(mode==='cross') for(let i=0;i<2;i++) await page.getByRole('button',{name:'Reveal next step',exact:true}).click();
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`.hermes/previews/calc3-${mode}.png`,fullPage:true,animations:'disabled'});
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:4173/#/u/charlie/MATH-215/practice');
  await page.getByRole('heading',{name:'Quiz practice',exact:true}).waitFor();
  await page.screenshot({path:'.hermes/previews/calc3-mobile.png',fullPage:true,animations:'disabled'});
  await browser.close();
  if(errors.length) throw new Error(errors.join('\n'));
  console.log('Four Calc III screenshots captured; no page errors.');
})().catch(e=>{console.error(e);process.exitCode=1;});
