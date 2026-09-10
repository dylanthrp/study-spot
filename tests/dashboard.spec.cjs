const { test, expect } = require('@playwright/test');

test('Charlie has the same course collection as Dylan', async ({ page }) => {
  await page.goto('/#/u/dylan?tab=library');
  const courses = await page.locator('.dash-course').allTextContents();
  await page.goto('/#/u/charlie?tab=library');
  await expect(page.locator('.dash-course')).toHaveCount(courses.length);
  expect(await page.locator('.dash-course').allTextContents()).toEqual(courses);
  await expect(page.getByText(/schedule confirmation is still needed/)).toHaveCount(0);
  await page.locator('.dash-course').filter({ hasText: 'MATH-215' }).click();
  await expect(page).toHaveURL(/#\/u\/charlie\/MATH-215$/);
});

test('all five student dashboards and study navigation render without script errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const who of ['dylan', 'charlie', 'cooper', 'wyatt', 'christian']) {
    await page.goto('/#/u/' + who);
    await expect(page.getByRole('heading', { name: 'Jump back in', exact: true })).toBeVisible();
    for (const label of ['Your library', 'Flashcards', 'Study Guides', 'Games', 'Practice Tests']) {
      await page.getByRole('link', { name: label, exact: true }).click();
      await expect(page.getByRole('heading', { name: label, exact: true })).toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});

test('dashboard fits narrow, tablet and desktop viewports with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/u/dylan');
  for (const width of [320, 390, 768, 1024, 1280, 1857]) {
    await page.setViewportSize({ width, height: 918 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const box = await page.locator('.dash-resume').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
  expect(await page.locator('.dash-section').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});

test('folders save selected courses, persist, and stay separate for each student', async ({ page }) => {
  await page.goto('/#/u/dylan');
  await page.getByRole('button', { name: 'Create a folder', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'New folder' });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Folder name').fill('Midterm review <3');
  await dialog.getByRole('checkbox', { name: /PHYS-150 · General Physics I$/ }).check();
  await dialog.getByRole('button', { name: 'Create folder', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Midterm review <3', exact: true })).toBeVisible();
  await expect(page.locator('.dash-course')).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Midterm review <3', exact: true })).toBeVisible();
  await page.goto('/#/u/charlie');
  await expect(page.getByRole('link', { name: 'Midterm review <3', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'New folder', exact: true }).click();
  await expect(page.getByLabel('Folder name')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'New folder', exact: true })).toBeFocused();
});

test('dashboard search filters courses, clears, and preserves user routes', async ({ page }) => {
  await page.goto('/#/u/dylan');
  const search = page.getByRole('searchbox', { name: 'Search your courses and materials' });
  await page.keyboard.press('/');
  await expect(search).toBeFocused();
  await search.fill('calculus');
  await search.press('Enter');
  await expect(page).toHaveURL(/tab=library&q=calculus/);
  await expect(page.locator('.dash-course')).toHaveCount(1);
  await expect(page.locator('.dash-course')).toContainText('MATH-215');
  await search.press('Escape');
  await expect(page.locator('.dash-course')).toHaveCount(6);
  await page.getByRole('link', { name: 'Games', exact: true }).click();
  await expect(page.getByText('Study games are not available yet.', { exact: false })).toBeVisible();
});

test('mobile sidebar opens and closes without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/u/dylan');
  const nav = page.getByRole('navigation', { name: 'Student navigation' });
  await expect(nav).toBeHidden();
  await page.getByRole('button', { name: 'Toggle sidebar' }).click();
  await expect(nav).toBeVisible();
  await page.getByRole('link', { name: 'Your library', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your library' })).toBeVisible();
  await expect(nav).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('course visits become recent and keep Charlie in his own dashboard', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/u/charlie');
  await page.getByRole('link', { name: 'Open course', exact: false }).first().click();
  await expect(page).toHaveURL(/#\/u\/charlie\/PHYS-150\/notes$/);
  await page.getByRole('button', { name: '← Back to hub' }).click();
  await expect(page).toHaveURL(/#\/u\/charlie$/);
  await expect(page.locator('#dashRecents')).toContainText('General Physics I');
  await expect(page.locator('.dash-resume')).toContainText('Continue');
  await page.reload();
  await expect(page.locator('#dashRecents')).toContainText('General Physics I');
  await page.goto('/#/u/dylan');
  await expect(page.locator('#dashRecents')).toContainText('A fresh start.');
  expect(errors).toEqual([]);
});

test('person selection opens the reference-style dashboard without removed sections', async ({ page }) => {
  await page.goto('/');
  await page.locator('.roommate[data-route="/u/dylan"]').click();
  await expect(page.getByRole('navigation', { name: 'Student navigation' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Jump back in', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recents', exact: true })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search your courses and materials' })).toBeVisible();
  for (const label of ['Expert Solutions', 'Study groups', 'Notifications']) {
    await expect(page.getByText(label, { exact: true })).toHaveCount(0);
  }
  await expect(page.getByText('Mechanical Engineering', { exact: true }).first()).toBeVisible();
});
