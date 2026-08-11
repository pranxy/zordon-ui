import { expect, test } from './fixtures/accessibility';

test('serves meaningful rendered HTML without client JavaScript', async ({ browser, request }) => {
  const response = await request.get('/');
  const html = await response.text();

  expect(response.ok()).toBe(true);
  expect(html).toContain('Zordon UI SSR and hydration example');
  expect(html).toContain('Hydration status: server-rendered');
  expect(html).toContain('data-testid="server-theme-scope"');
  expect(html).toContain('data-theme="dark"');
  expect(html).toContain('data-testid="server-nested-theme"');
  expect(html).toContain('data-theme="light"');
  expect(html).toMatch(/ngh="\d+"/);

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Zordon UI SSR and hydration example' }),
  ).toBeVisible();
  await expect(page.getByTestId('hydration-state')).toHaveText('Hydration status: server-rendered');
  await context.close();
});

test('hydrates without errors and enables interaction', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByTestId('hydration-state')).toHaveText('Hydration status: ready');
  await expect(page.getByTestId('server-theme-scope')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByTestId('server-nested-theme')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByTestId('counter')).toHaveText('Hydrated count: 0');

  await page.getByTestId('increment').click();
  await expect(page.getByTestId('counter')).toHaveText('Hydrated count: 1');

  await page
    .getByTestId('clear-server-theme')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(page.getByTestId('server-theme-scope')).not.toHaveAttribute('data-theme');
  await expect(page.getByTestId('server-nested-theme')).toHaveAttribute('data-theme', 'light');
  expect(errors).toEqual([]);
});

test('has no detectable WCAG A or AA violations after hydration', async ({ page, runAxeScan }) => {
  await page.goto('/');
  await expect(page.getByTestId('hydration-state')).toHaveText('Hydration status: ready');

  const results = await runAxeScan('[data-testid="ssr-example"]');
  expect(results.violations).toEqual([]);
});
