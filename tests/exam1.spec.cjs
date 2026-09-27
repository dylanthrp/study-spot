const { test, expect } = require('@playwright/test');
const data = require('../exam1-data.json');

test('Cooper has a source-labeled Exam 1 room without losing the existing accounting deck', async ({page}) => {
  await page.goto('/#/u/cooper?tab=library');
  await expect(page.locator('.dash-course[data-course-code="ACC-289"]')).toHaveAttribute('href','https://dylanthrp.github.io/coop-accounting-deck/');
  await page.locator('.dash-course[data-course-code="ACC-298"]').click({timeout:3000});
  await expect(page.getByRole('heading',{name:'Exam 1. Make every rep count.',exact:true})).toBeVisible();
  await expect(page.locator('#examRoom')).toContainText('Chapters 1–3');
  await expect(page.getByRole('link',{name:'Professor’s review PDF',exact:true})).toHaveAttribute('href',/exam1-review.pdf/);
  await page.getByRole('link',{name:'← Your dashboard',exact:true}).click();
  await expect(page).toHaveURL(/#\/u\/cooper$/);
});

test('quick reps grade both sides, retain progress, and retry only missed questions', async ({page}) => {
  await page.goto('/#/u/cooper/ACC-298/practice');
  await page.getByLabel('Practice topic').selectOption('journal',{timeout:3000});
  await page.getByRole('button',{name:'Start round',exact:true}).click();
  await page.getByLabel('Debit account',{exact:true}).selectOption('Cash');
  await page.getByLabel('Credit account',{exact:true}).selectOption('Common Stock');
  await page.getByLabel('Amount ($)',{exact:true}).fill('150');
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(page.locator('#exFeedback')).toContainText('Not quite');
  await expect(page.getByRole('button',{name:'Check answer',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Next rep',exact:true}).click();
  await page.getByLabel('Debit account',{exact:true}).selectOption('Cash');
  await page.getByLabel('Credit account',{exact:true}).selectOption('Notes Payable');
  await page.getByLabel('Amount ($)',{exact:true}).fill('$6,000');
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(page.locator('#exFeedback')).toContainText('Correct');
  await page.reload();
  await expect(page.locator('#exFeedback')).toContainText('Correct');
  await page.getByRole('button',{name:'Next rep',exact:true}).click();
  for(let i=0;i<3;i++) {
    await page.getByRole('button',{name:'Show solution · mark for retry',exact:true}).click();
    await page.getByRole('button',{name:i===2?'Finish round':'Next rep',exact:true}).click();
  }
  await expect(page.getByRole('heading',{name:'Round complete',exact:true})).toBeVisible();
  await expect(page.locator('#exContent')).toContainText('1 / 5');
  await page.getByRole('button',{name:'Retry missed (4)',exact:true}).click();
  await expect(page.locator('#exRepCount')).toHaveText('Rep 1 of 4');
  await page.goto('/#/u/wyatt/ACC-298/practice');
  await expect(page.getByRole('button',{name:'Start round',exact:true})).toBeVisible();
});

test('recall cards reveal before self-grading and loop back to missed cards', async ({page}) => {
  await page.goto('/#/u/cooper/ACC-298/cards');
  await page.getByRole('button',{name:'Reveal answer',exact:true}).click({timeout:3000});
  await expect(page.locator('#exCardBack')).toBeVisible();
  await page.getByRole('button',{name:'Again',exact:true}).click();
  for(let i=1;i<12;i++) {
    await page.getByRole('button',{name:'Reveal answer',exact:true}).click();
    await page.getByRole('button',{name:'Got it',exact:true}).click();
  }
  await page.getByRole('button',{name:'Retry cards (1)',exact:true}).click();
  await expect(page.locator('#exCardCount')).toHaveText('Card 1 of 1');
});

test('Wyatt Focus view keeps answers while adjusting reading preferences and theme', async ({page}) => {
  await page.goto('/#/u/wyatt/ACC-298/practice');
  await expect(page.getByLabel('Focus view',{exact:true})).toBeChecked({timeout:3000});
  await page.getByRole('button',{name:'Start round',exact:true}).click();
  await page.getByLabel('Amount ($)',{exact:true}).fill('123');
  await page.getByLabel('Text size',{exact:true}).selectOption('large');
  await expect(page.getByLabel('Amount ($)',{exact:true})).toHaveValue('123');
  await page.getByRole('button',{name:'Settings',exact:true}).click();
  await page.getByRole('radio',{name:'Dark',exact:true}).check();
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Amount ($)',{exact:true})).toHaveValue('123');
  await page.getByRole('button',{name:'Show solution · mark for retry',exact:true}).click();
  await expect(page.locator('#exSteps li')).toHaveCount(0);
  await page.getByRole('button',{name:'Show next explanation step',exact:true}).click();
  await expect(page.locator('#exSteps li')).toHaveCount(1);
  await page.reload();
  await expect(page.getByLabel('Text size',{exact:true})).toHaveValue('large');
  await expect(page.locator('#exFeedback')).toContainText('Solution revealed');
  await page.goto('/#/u/wyatt/ACC-298/sheet');
  await expect(page.getByRole('heading',{name:'One-page guide',exact:true})).toBeVisible();
  await expect(page.locator('#exContent')).toContainText('$250');
  await page.getByRole('link',{name:'← Your dashboard',exact:true}).click();
  await expect(page).toHaveURL(/#\/u\/wyatt$/);
});

for (const topic of data.topics) {
  test(`all ${topic.id} questions grade correctly and keep source links valid`,async({page,request})=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/#/u/cooper/ACC-298/practice');
    await page.getByLabel('Practice topic').selectOption(topic.id);
    await page.getByLabel('Round length').selectOption('all');
    await page.getByRole('button',{name:'Start round',exact:true}).click();
    const questions=data.problems.filter(p=>p.topic===topic.id);
    for(const [i,p] of questions.entries()) {
      await expect(page.locator('#exQuestion')).toHaveText(p.title);
      if(p.debit) {
        await page.getByLabel('Debit account',{exact:true}).selectOption(p.debit);
        await page.getByLabel('Credit account',{exact:true}).selectOption(p.credit);
      } else {
        await expect(page.locator('.ex-original')).toHaveCount(0);
        await expect(page.locator('.ex-source a').first()).toHaveAttribute('href',new RegExp(`exam1-solution.pdf#page=${p.page}$`));
      }
      await page.locator('#exAmount').fill(String(p.debit?p.amount:p.number));
      await page.getByRole('button',{name:'Check answer',exact:true}).click();
      await expect(page.locator('#exFeedback h2')).toHaveText('Correct');
      await page.getByRole('button',{name:i===questions.length-1?'Finish round':'Next rep',exact:true}).click();
    }
    await expect(page.locator('.ex-score')).toHaveText(`${questions.length} / ${questions.length}`);
    expect(errors).toEqual([]);
    for(const url of ['/assets/exam1-review.pdf','/assets/exam1-solution.pdf']) {
      const response=await request.get(url);expect(response.status()).toBe(200);
      expect((await response.body()).subarray(0,5).toString()).toBe('%PDF-');
    }
  });
}

test('invalid amounts do not grade, wrong accounts do, and 320px largest-text focus stays within viewport',async({page})=>{
  await page.setViewportSize({width:320,height:900});
  await page.goto('/#/u/wyatt/ACC-298/practice');
  await page.getByLabel('Text size',{exact:true}).selectOption('largest');
  await page.getByRole('button',{name:'Start round',exact:true}).click();
  await page.getByLabel('Debit account',{exact:true}).selectOption('Common Stock');
  await page.getByLabel('Credit account',{exact:true}).selectOption('Cash');
  await page.locator('#exAmount').fill('15,00');
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(page.locator('#exValidation')).toContainText('valid amount');
  await expect(page.locator('#exFeedback')).toBeEmpty();
  await page.locator('#exAmount').fill('15,000');
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(page.locator('#exFeedback')).toContainText('Not quite');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('read-aloud includes context and cancels on navigation (speech API mock)',async({page})=>{
  await page.addInitScript(()=>{
    window.speechCalls=[];window.speechStops=0;
    Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text;}}});
    Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>window.speechCalls.push(u.text),cancel:()=>window.speechStops++}});
  });
  await page.goto('/#/u/wyatt/ACC-298/practice');
  await page.getByRole('button',{name:'Start round',exact:true}).click();
  await page.getByRole('button',{name:'Read question aloud',exact:true}).click();
  const calls=await page.evaluate(()=>window.speechCalls);
  expect(calls[0]).toContain('Issue common stock');expect(calls[0]).toContain('$15,000');
  const before=await page.evaluate(()=>window.speechStops);
  await page.getByRole('link',{name:'Recall cards',exact:true}).click();
  await expect(page.getByRole('button',{name:'Reveal answer',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>window.speechStops)).toBeGreaterThan(before);
});
