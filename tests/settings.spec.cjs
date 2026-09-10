const {test,expect}=require('@playwright/test');

test('dark appearance keeps the printable formula sheet ink friendly',async({page})=>{
  await page.goto('/#/u/dylan/MATH-215/sheet');
  await page.getByRole('button',{name:'Settings',exact:true}).click();
  await page.getByRole('dialog').getByRole('radio',{name:'Dark',exact:true}).check();
  await page.keyboard.press('Escape');
  await page.emulateMedia({media:'print'});
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(255, 255, 255)');
  await expect(page.locator('.calc-formula').first()).toHaveCSS('color','rgb(17, 17, 17)');
});

test('mobile settings stays on screen and preserves the current quiz answer',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto('/#/u/dylan');
  const button=page.getByRole('button',{name:'Settings',exact:true});
  const box=await button.boundingBox();
  expect(box.x+box.width).toBeLessThanOrEqual(375);
  await button.click();
  const dialog=page.getByRole('dialog',{name:'Settings',exact:true});
  const bounds=await dialog.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x+bounds.width).toBeLessThanOrEqual(375);
  await page.keyboard.press('g');
  await expect(page).toHaveURL(/#\/u\/dylan$/);
  await page.keyboard.press('Escape');
  await page.goto('/#/u/dylan/MATH-215/practice');
  await page.getByRole('radio').first().check();
  await button.click();
  await dialog.getByRole('radio',{name:'Dark',exact:true}).check();
  await page.keyboard.press('Escape');
  await expect(page.locator('#calcQuiz input[type="radio"]').first()).toBeChecked();
  await expect(page.locator('#calcQuestionCount')).toHaveText('Question 1 of 12');
});

test('settings remains usable when browser storage is blocked',async({page})=>{
  await page.addInitScript(()=>{ Storage.prototype.setItem=()=>{throw new Error('Storage blocked for test');}; });
  await page.goto('/#/u/dylan/MATH-215');
  await page.getByRole('button',{name:'Settings',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Settings',exact:true});
  await dialog.getByRole('radio',{name:'Dark',exact:true}).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(dialog.getByRole('status')).toContainText('could not be saved');
  await page.keyboard.press('Escape');
});

test('settings switches the whole site to dark mode and remembers it',async({page})=>{
  await page.goto('/#/u/dylan');
  await page.getByRole('button',{name:'Settings',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Settings',exact:true});
  await expect(dialog).toBeVisible();
  await dialog.getByRole('radio',{name:'Dark',exact:true}).check();
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(15, 17, 21)');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Settings',exact:true})).toBeFocused();
  await page.reload();
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(15, 17, 21)');
  for(const route of ['/#/u/charlie/MATH-215','/#/u/dylan/PHYS-150','/#/']) {
    await page.goto(route);
    await expect(page.locator('body')).toHaveCSS('background-color','rgb(15, 17, 21)');
    await expect(page.getByRole('button',{name:'Settings',exact:true})).toBeVisible();
  }
  await page.getByRole('button',{name:'Settings',exact:true}).click();
  await dialog.getByRole('radio',{name:'Light',exact:true}).check();
  await dialog.getByRole('button',{name:'Close settings',exact:true}).click();
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(251, 247, 240)');
});
