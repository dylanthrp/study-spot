const {test,expect}=require('@playwright/test');
const data=require('../law-data.json');
test('mixed five-question law rounds draw across chapters rather than always Chapter 1',async({page})=>{
 await page.goto('/#/u/cooper/LE-253/practice');await page.locator('#lawStart').click();const chapters=[];
 for(let i=0;i<5;i++){
  const prompt=await page.locator('#lawQuestion').textContent(),q=data.questions.find(q=>q.prompt===prompt);chapters.push(q.group);
  await page.locator(`#lawChoice${q.answer}`).check();await page.locator('#lawCheck').click();await page.locator('#lawNext').click();
 }
 expect(new Set(chapters).size).toBe(5);
 await page.locator('#lawNew').click();await page.locator('#lawStart').click();
 // Next round should prioritize unseen Chapter 9.
 await expect(page.locator('#lawQuestion')).toHaveText(data.questions.find(q=>q.group==='ch9').prompt);
});
test('mixed rounds put unanswered and missed questions before mastered questions',async({page})=>{
 const history=Object.fromEntries(data.questions.map(q=>[q.id,true]));
 const unanswered=data.questions.find(q=>q.group==='ch9'),missed=data.questions.find(q=>q.group==='ch8');
 delete history[unanswered.id];history[missed.id]=false;
 await page.addInitScript(history=>localStorage.setItem('law_v2_cooper',JSON.stringify({history})),history);
 await page.goto('/#/u/cooper/LE-253/practice');await page.locator('#lawStart').click();
 const ids=await page.evaluate(()=>JSON.parse(localStorage.getItem('law_v2_cooper')).round.ids);
 expect(new Set(ids.slice(0,2))).toEqual(new Set([unanswered.id,missed.id]));
 expect(ids.slice(2).every(id=>history[id]===true)).toBeTruthy();
});
test('law tools appear in dashboard cards, guides, tests and games categories',async({page})=>{
 for(const [tab,mode] of [['cards','concepts'],['guides','sheet'],['tests','practice'],['games','games']]){
  await page.goto(`/#/u/wyatt?tab=${tab}`);await page.locator('.dash-course[data-course-code="LE-253"]').click();
  await expect(page).toHaveURL(new RegExp(`/LE-253/${mode}$`));await expect(page.locator('#lawRoom')).toBeVisible();
 }
});
