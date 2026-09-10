const { test, expect } = require('@playwright/test');

test('desktop lesson navigation stays below the sticky site header', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/#/u/dylan/MATH-215/cross');
  await expect(page.getByRole('heading',{name:'Cross products and unit normals',exact:true})).toBeVisible();
  await expect(page.locator('.calc-sidebar')).toBeVisible();
  await expect(page.locator('.topbar')).toBeVisible();
  await page.evaluate(()=>scrollTo(0,400));
  await expect.poll(()=>page.evaluate(()=>document.querySelector('.calc-sidebar').getBoundingClientRect().top-document.querySelector('.topbar').getBoundingClientRect().bottom)).toBeGreaterThanOrEqual(0);
});

test('all classroom surfaces fit mobile and every lesson reaches its final answer without errors', async ({ page }) => {
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto('/#/u/dylan/MATH-215');
  const lessons = await page.evaluate(()=>CALC3_DATA.lessons.map(l=>({id:l.id,steps:l.example.steps.length,answer:l.example.answer})));
  for(const l of lessons) {
    await page.goto(`/#/u/dylan/MATH-215/${l.id}`);
    for(let i=0;i<l.steps;i++) await page.getByRole('button',{name:'Reveal next step',exact:true}).click();
    await expect(page.locator('.calc-answer')).toContainText(l.answer);
    await expect(page.getByRole('button',{name:'Reveal next step',exact:true})).toBeDisabled();
    await page.getByRole('button',{name:'Restart example',exact:true}).click();
    await expect(page.locator('.calc-example-step')).toHaveCount(0);
  }
  await page.setViewportSize({width:390,height:844});
  for(const mode of ['overview','cross','lab','practice','sheet','notebook']) {
    await page.goto(`/#/u/charlie/MATH-215/${mode}`);
    await expect(page.locator('.calc-sidebar a.selected')).toHaveAttribute('href', `#/u/charlie/MATH-215/${mode}`);
    await expect(page.locator('.topbar .toolbar')).toBeHidden();
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth), {message:`${mode} fits mobile after hash routing`}).toBeLessThanOrEqual(390);
  }
  expect(errors).toEqual([]);
});

test('dashboard study guides and practice tests include the Calc III classroom', async ({ page }) => {
  await page.goto('/#/u/charlie?tab=tests');
  const calc = page.locator('.dash-course').filter({hasText:'MATH-215'});
  await expect(calc).toContainText('Guided lessons');
  await calc.click();
  await expect(page.getByRole('heading',{name:'Quiz practice',exact:true})).toBeVisible();
  await page.getByRole('link',{name:'← Your dashboard',exact:true}).click();
  await expect(page).toHaveURL(/#\/u\/charlie$/);
  await page.goto('/#/u/charlie?tab=guides');
  await page.locator('.dash-course').filter({hasText:'MATH-215'}).click();
  await expect(page.getByRole('heading',{name:'Vectors, without the guesswork.'})).toBeVisible();
});

test('formula sheet collects every lesson rule in printable form', async ({ page }) => {
  await page.goto('/#/u/dylan/MATH-215/sheet');
  await expect(page.getByRole('heading',{name:'Your formula sheet',exact:true})).toBeVisible();
  await expect(page.locator('.calc-formula')).toHaveCount(8);
  await expect(page.getByRole('button',{name:'Print formula sheet',exact:true})).toBeVisible();
  await page.emulateMedia({ media:'print' });
  await expect(page.locator('.calc-sidebar')).toBeHidden();
});

test('quiz checks one answer once, explains mistakes, finishes, and retries missed questions', async ({ page }) => {
  await page.goto('/#/u/charlie/MATH-215/practice');
  await expect(page.getByRole('heading', { name:'Quiz practice', exact:true })).toBeVisible();
  const keys = await page.evaluate(() => CALC3_DATA.questions.map(q=>q.correct));
  for (let i=0;i<keys.length;i++) {
    await expect(page.getByRole('button',{name:'Check answer',exact:true})).toBeDisabled();
    await page.getByRole('radio').nth(i===0 ? (keys[i]+1)%4 : keys[i]).check();
    await page.getByRole('button',{name:'Check answer',exact:true}).click();
    await expect(page.locator('#calcQuizFeedback')).toContainText(i===0 ? 'Not quite' : 'Correct');
    await expect(page.getByRole('button',{name:'Check answer',exact:true})).toBeDisabled();
    await expect(page.getByRole('radio').first()).toBeDisabled();
    await page.getByRole('button',{name:i===keys.length-1 ? 'See results' : 'Next question',exact:true}).click();
    await expect(page.locator(i===keys.length-1 ? '#calcScore' : '#calcQuiz legend')).toBeFocused();
  }
  await expect(page.locator('#calcScore')).toHaveText(`${keys.length-1} / ${keys.length}`);
  await page.getByRole('button',{name:'Retry missed questions',exact:true}).click();
  await expect(page.locator('#calcQuestionCount')).toHaveText('Question 1 of 1');
  await expect(page.locator('#calcQuiz legend')).toBeFocused();
  await expect(page.locator('#calcQuizFeedback')).toBeEmpty();
  await page.getByRole('radio').nth(keys[0]).check();
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  await page.getByRole('button',{name:'See results',exact:true}).click();
  await expect(page.locator('#calcScore')).toHaveText('1 / 1');
  await expect(page.getByRole('button',{name:'Retry missed questions',exact:true})).toHaveCount(0);
});

test('notebook saves literal text per student, survives refresh, and exports', async ({ page }) => {
  await page.goto('/#/u/dylan/MATH-215/notebook');
  const notes = page.getByLabel('My Calc III notes');
  await expect(notes).toBeVisible();
  await notes.pressSequentially('g / ? <b>Dot is scalar</b>');
  await expect(page).toHaveURL(/dylan\/MATH-215\/notebook$/);
  await expect(page.getByRole('status')).toContainText('Saved');
  await page.reload();
  await expect(notes).toHaveValue('g / ? <b>Dot is scalar</b>');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my notes' }).click();
  expect((await download).suggestedFilename()).toBe('dylan-calc3-notes.txt');
  await page.goto('/#/u/charlie/MATH-215/notebook');
  await expect(notes).toHaveValue('');
});

test('vector playground demonstrates parallel, perpendicular, and opposite vectors', async ({ page }) => {
  await page.goto('/#/u/dylan/MATH-215/lab');
  const angle = page.getByLabel('Angle between a and b');
  await angle.focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#calcDotValue')).toHaveText('12.00');
  await expect(page.locator('#calcCrossValue')).toHaveText('0.00');
  await page.getByRole('button', { name: '90° · perpendicular', exact: true }).click();
  await expect(page.locator('#calcDotValue')).toHaveText('0.00');
  await expect(page.locator('#calcCrossValue')).toHaveText('12.00');
  await angle.focus();
  await page.keyboard.press('End');
  await expect(page.locator('#calcDotValue')).toHaveText('-12.00');
  await expect(page.locator('#calcCrossValue')).toHaveText('0.00');
  await expect(page.getByRole('img', { name: 'Projection and perpendicular residual reference' })).toBeVisible();
  expect(await page.locator('.calc-reference img').evaluateAll(imgs => imgs.every(i => i.complete && i.naturalWidth > 0))).toBe(true);
});

test('Calc III opens a guided lesson and reveals one example step at a time', async ({ page }) => {
  await page.goto('/#/u/dylan/MATH-215');
  await expect(page.getByRole('heading', { name: 'Vectors, without the guesswork.' })).toBeVisible();
  await page.getByRole('link', { name: 'Start learning', exact: true }).click();
  await expect(page.locator('.calc-example-step')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reveal next step', exact: true }).click();
  await expect(page.locator('.calc-example-step')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reveal next step', exact: true }).click();
  await expect(page.locator('.calc-example-step')).toHaveCount(2);
  await page.getByRole('link', { name: /Dot product/ }).first().click();
  await expect(page.locator('.calc-example-step')).toHaveCount(0);
});
