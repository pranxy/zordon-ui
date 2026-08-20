import { expect, test } from '@playwright/test';

test('delivers route-specific documentation HTML before JavaScript runs', async ({
  browser,
  request,
}) => {
  const response = await request.get('/docs/getting-started');
  const html = await response.text();

  expect(response.ok()).toBe(true);
  expect(html).toContain('Get started with Zordon UI');
  expect(html).toContain('Angular applications configured with Tailwind CSS 4 and daisyUI 5.');
  expect(html).toMatch(/ngh="\d+"/);

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/docs/getting-started');
  await expect(page.getByRole('heading', { name: 'Get started with Zordon UI' })).toBeVisible();
  await context.close();
});

test('hydrates the server-rendered documentation without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Zordon UI' })).toBeVisible();
  await page.getByLabel('Primary navigation').getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Get started with Zordon UI' })).toBeVisible();

  expect(errors).toEqual([]);
});
