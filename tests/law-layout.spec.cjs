const {test,expect}=require('@playwright/test');
test('source context is visible without a long repeated mobile disclaimer',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#/u/wyatt/LE-253/concepts');
 await expect(page.locator('.law-caveat')).toContainText('Cooper');
 const details=page.locator('.law-caveat details');await expect(details).toHaveCount(1);await expect(details).not.toHaveAttribute('open','');
 await details.locator('summary').click();await expect(details).toHaveAttribute('open','');await expect(details).toContainText('not an official answer key');
});
test('long supplied scenarios use readable body-scale type on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#/u/wyatt/LE-253/practice');await page.locator('#lawStart').click();
 expect(await page.locator('#lawQuestion').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeLessThanOrEqual(24);
 await expect(page.locator('#lawQuestion')).toBeFocused();
 expect((await page.locator('#lawQuestion').boundingBox()).y).toBeGreaterThanOrEqual(80);
});
