const {test,expect}=require('@playwright/test');
for(const who of ['cooper','wyatt'])test(`${who} has a separate Business Law folder using the accounting room layout`,async({page})=>{
 await page.goto(`/#/u/${who}`);
 await page.evaluate(who=>localStorage.setItem(`studyspot_dashboard:${who}:folders`,JSON.stringify([{id:'myaccounting',name:'Accounting',courses:['ACC-298']} ])),who);
 await page.reload();
 await expect(page.locator('#dashFolders').getByRole('link',{name:'Accounting',exact:true})).toBeVisible();
 await page.locator('#dashFolders').getByRole('link',{name:'Business Law',exact:true}).click();
 await expect(page.locator('#dashContent .dash-course')).toHaveCount(1);
 await expect(page.locator('#dashContent .dash-course')).toHaveAttribute('data-course-code','LE-253');
 await page.locator('#dashContent .dash-course').click();
 await expect(page.locator('#lawRoom.ex-shell .ex-sidebar')).toBeVisible();
 await expect(page.locator('#lawRoom .ex-main')).toBeVisible();
 await expect(page.locator('#lawRoom .ex-nav')).toHaveCount(5);
 await page.getByRole('link',{name:'← Your dashboard',exact:true}).click();
 await page.locator('#dashFolders').getByRole('link',{name:'Accounting',exact:true}).click();
 await expect(page.locator('#dashContent .dash-course')).toHaveCount(1);
 await expect(page.locator('#dashContent .dash-course')).toHaveAttribute('data-course-code','ACC-298');
});
